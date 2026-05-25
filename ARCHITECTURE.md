# Shortest Path Visualizer v2 — Architecture

A research-grade educational tool for interactive algorithm visualization, built with TypeScript, React, styled-components v6, and Zustand. This document covers every layer of the system: configuration, data model, algorithm engine, state management, rendering pipeline, UI features, and step-by-step flows.

---

## Table of Contents

1. [Project Configuration](#1-project-configuration)
2. [Directory Layout](#2-directory-layout)
3. [Core Data Model](#3-core-data-model)
4. [Algorithm Engine — Generator Pattern](#4-algorithm-engine--generator-pattern)
5. [State Management — Three Zustand Stores](#5-state-management--three-zustand-stores)
6. [Grid Mutation Model — baseGrid vs visualGrid](#6-grid-mutation-model--basegrid-vs-visualgrid)
7. [Playback Engine — usePlayback Hook](#7-playback-engine--useplayback-hook)
8. [Grid Interaction — useGridInteraction Hook](#8-grid-interaction--usegridinteraction-hook)
9. [Design System — Theme & Styles](#9-design-system--theme--styles)
10. [Component Architecture](#10-component-architecture)
11. [Algorithms — Deep Dive](#11-algorithms--deep-dive)
12. [Maze Generators — Deep Dive](#12-maze-generators--deep-dive)
13. [Feature Flows — Step by Step](#13-feature-flows--step-by-step)
14. [Compare Mode Flow](#14-compare-mode-flow)
15. [Cell Rendering Pipeline](#15-cell-rendering-pipeline)
16. [Keyboard Shortcuts](#16-keyboard-shortcuts)
17. [Algorithm Registry](#17-algorithm-registry)

---

## 1. Project Configuration

### Build Tooling
- **Vite 6** with `@vitejs/plugin-react` (SWC transform). Entry: `src/main.tsx`.
- **TypeScript strict mode** (`strict: true`, `noUncheckedIndexedAccess: false` for ergonomics). Module resolution: `bundler`. Path alias `@/*` → `src/*`.
- **Two tsconfig files**: `tsconfig.json` for app code, `tsconfig.node.json` for Vite config itself.

### Key Dependencies
| Package | Version | Role |
|---------|---------|------|
| `react` + `react-dom` | ^19 | UI framework |
| `styled-components` | ^6 | Theme injection via `ThemeProvider` |
| `zustand` | ^5 | Zero-boilerplate global state |
| `recharts` | ^2 | Bar charts in StatsDrawer |
| `vite` | ^6 | Dev server + bundler |

### Fonts
Loaded via Google Fonts CDN in `index.html`:
- **IBM Plex Sans** — UI sans-serif (`FONT_SANS`)
- **IBM Plex Mono** — code, labels, data tables (`FONT_MONO`)
- **Newsreader** — paper citations, serif body text (`FONT_SERIF`)

---

## 2. Directory Layout

```
src/
├── main.tsx                  # React entry — ThemeProvider + Root
├── App.tsx                   # Three-panel layout, keyboard shortcuts
│
├── algorithms/               # Pure generator functions
│   ├── types.ts              # All shared TypeScript types
│   ├── bfs.ts
│   ├── dfs.ts
│   ├── dijkstra.ts
│   ├── aStar.ts
│   ├── greedyBestFirst.ts
│   ├── bidirectionalBfs.ts
│   └── heuristics.ts
│
├── maze/                     # Maze generator functions (same AlgorithmStep type)
│   ├── recursiveBacktracking.ts
│   ├── primsAlgorithm.ts
│   └── recursiveDivision.ts
│
├── constants/
│   └── algorithms.ts         # ALGORITHM_REGISTRY — metadata for all 7 algos
│
├── store/                    # Zustand stores
│   ├── gridStore.ts          # Grid state + applyStep pure function
│   ├── algorithmStore.ts     # Playback state + metrics
│   └── uiStore.ts            # UI toggles, theme, brushes
│
├── hooks/
│   ├── usePlayback.ts        # run/pause/resume/step/scrub/reset
│   └── useGridInteraction.ts # Mouse drag logic for wall/weight/start/end
│
├── components/
│   ├── algorithm/
│   │   ├── AlgorithmPanel.tsx    # Left panel: algo info + badges
│   │   ├── AlgorithmState.tsx    # Live data structures (open set table)
│   │   ├── PseudocodePanel.tsx   # Pseudocode with line highlighting
│   │   └── StepController.tsx    # Transport controls + scrubber
│   ├── comparison/
│   │   └── CompareMode.tsx       # Split-screen two-algorithm comparison
│   ├── grid/
│   │   ├── Cell.tsx              # Single cell (memoized)
│   │   ├── Grid.tsx              # CSS grid of cells + AutoSizedGrid
│   │   └── GridControls.tsx      # Maze generation floating popover
│   ├── learn/
│   │   └── InfoPanel.tsx         # Proofs, paper citations, watch-fors
│   ├── metrics/
│   │   ├── MetricsBar.tsx        # Bottom status bar
│   │   └── StatsDrawer.tsx       # Post-run stats + run history chart
│   └── ui/
│       ├── Icons.tsx             # SVG icon set
│       ├── NavBar.tsx            # Top navigation bar
│       └── Primitives.tsx        # StatusPill, Kbd, ComplexityBadge, etc.
│
└── styles/
    ├── theme.ts              # darkTheme / lightTheme + Theme interface
    └── GlobalStyles.ts       # CSS keyframes, scrollbars, reset
```

---

## 3. Core Data Model

Everything flows from three types defined in `src/algorithms/types.ts`.

### CellData
```ts
interface CellData {
  row: number;
  col: number;
  state: CellState;   // 'unvisited' | 'visited' | 'frontier' | 'path' |
                      // 'current' | 'wall' | 'weight' | 'start' | 'end'
  weight: number;     // 1 for normal, 2–9 for weighted cells
  gScore: number;     // cost from start (Dijkstra/A*)
  hScore: number;     // heuristic estimate to goal (A*)
  fScore: number;     // g + h (A*)
  parent: [number, number] | null;  // for path reconstruction
}
```

### AlgorithmStep
Every algorithm and maze generator emits these events. They are the universal communication protocol between the engine and the grid renderer.

```ts
interface AlgorithmStep {
  type: AlgorithmStepType;         // what happened
  cell: [number, number];          // which cell
  from?: [number, number];         // parent cell (for relax/enqueue)
  gScore?: number;                 // new g value
  hScore?: number;                 // h value
  fScore?: number;                 // f value
  queueSnapshot?: [number, number][];  // current open set
  visitedCount?: number;           // running count
  message?: string;                // human-readable description
  pseudocodeLine?: number;         // which line to highlight
}

type AlgorithmStepType =
  | 'visit'       // mark cell as visited
  | 'enqueue'     // add to frontier (→ 'frontier' state)
  | 'dequeue'     // remove from frontier (→ 'current' state)
  | 'relax'       // update distance (→ 'frontier' state with new scores)
  | 'path'        // cell is on the final path
  | 'done'        // algorithm succeeded
  | 'no-path'     // no path exists
  | 'add-wall'    // maze: add wall
  | 'remove-wall' // maze: carve passage
```

### RunMetrics
Captured at the end of every run and stored in `metricsHistory` (last 10 runs):
```ts
interface RunMetrics {
  id: number;        // timestamp ID
  algo: AlgorithmId;
  visited: number;
  pathLength: number;
  pathCost: number;  // sum of cell weights along path
  stepCount: number;
  wallTime: number;  // ms wall time
  optimal: boolean;
  timestamp: number;
}
```

---

## 4. Algorithm Engine — Generator Pattern

Every pathfinding algorithm is a **JavaScript generator function**: `function* algo(...): Generator<AlgorithmStep>`. This is the core architectural decision.

### Why Generators?

Instead of computing the entire result eagerly, a generator pauses at each `yield` and can be resumed step by step. This gives us:
- **Time travel**: step backward is just replaying from index 0
- **Scrubbing**: seek to any frame by replaying steps 0..N
- **Synchronization**: compare mode advances two generators in lockstep
- **Decoupled speed**: the UI controls how fast to advance the generator, independently of algorithm complexity

### Eager Collection Pattern

Despite being generators, steps are **collected upfront** into an array before playback begins:

```ts
// In usePlayback.ts
let result = gen.next();
while (!result.done) {
  steps.push(result.value);
  result = gen.next();
}
// steps[] is now the complete animation script
```

Then `setInterval` advances an index into this array. This makes:
- Scrubbing O(N) via `replayTo()` (replays steps 0..target)
- Step-back O(N) via `replayTo()`
- Pause/resume trivial (just stop/restart the interval)

### Step-to-Grid Translation

`applyStep(grid, step)` in `gridStore.ts` is a **pure function** that returns a new grid:

```
enqueue/relax → cell.state = 'frontier', update gScore/hScore/fScore/parent
dequeue       → cell.state = 'current'
visit         → cell.state = 'visited'
path          → cell.state = 'path'
add-wall      → cell.state = 'wall'
remove-wall   → cell.state = 'unvisited'
```

Start and end cells are **protected**: `isFixed` check prevents overwriting `'start'` or `'end'` state.

---

## 5. State Management — Three Zustand Stores

All global state lives in three Zustand stores. React components subscribe only to the slices they need.

### gridStore (`src/store/gridStore.ts`)

Owns the two-layer grid model (see §6) and all mutation actions.

| State | Type | Description |
|-------|------|-------------|
| `rows` / `cols` | `number` | Grid dimensions (default 20 × 32) |
| `start` / `end` | `[number, number]` | Current start/end positions |
| `baseGrid` | `CellData[][]` | Static state: walls, weights, start, end |
| `visualGrid` | `CellData[][]` | Animated state shown to the user |

Key actions:
- `setWall(r, c, isWall)` — toggles a wall on both grids
- `setWeight(r, c, weight)` — sets cell weight on both grids
- `setStart(pos)` / `setEnd(pos)` — moves the start/end marker
- `clearVisualization()` — resets `visualGrid` to a clone of `baseGrid`
- `clearAll()` — resets both grids to empty
- `stepForward(step)` — applies one step to `visualGrid`
- `replayTo(steps, targetIndex)` — rebuilds `visualGrid` from `baseGrid` applying steps 0..target
- `applyMazeStep(step)` — applies a maze step to **both** grids (so walls persist)

### algorithmStore (`src/store/algorithmStore.ts`)

Owns playback state and metrics history.

| State | Type | Description |
|-------|------|-------------|
| `selectedAlgo` | `AlgorithmId` | Currently selected algorithm |
| `heuristic` | `HeuristicId` | Manhattan / Euclidean / Chebyshev |
| `status` | `PlaybackStatus` | `idle` → `running` → `paused` → `done` / `no-path` |
| `steps` | `AlgorithmStep[]` | Full step array (collected before playback) |
| `stepIndex` | `number` | Current position in steps array (-1 = not started) |
| `speed` | `number` | Interval delay in ms (default 50ms) |
| `metricsHistory` | `RunMetrics[]` | Last 10 run results |
| `pathLength` / `visitedCount` / `wallTime` | `number` | Live counters shown in MetricsBar |
| `compareAlgo{Left,Right}` | `AlgorithmId` | Compare mode algorithm selections |
| `compareSteps{Left,Right}` | `AlgorithmStep[]` | Compare mode step arrays |
| `compareIndex{Left,Right}` | `number` | Compare mode step indices |
| `compareStatus{Left,Right}` | `PlaybackStatus` | Compare mode statuses |

### uiStore (`src/store/uiStore.ts`)

Owns UI panel visibility flags, theme, and drawing tools.

| State | Type | Description |
|-------|------|-------------|
| `theme` | `'dark' \| 'light'` | Active theme |
| `compareMode` | `boolean` | Toggles full-screen compare layout |
| `showInfoPanel` | `boolean` | Right panel: learn/papers |
| `showDataPanel` | `boolean` | Left panel: live data structures |
| `showPseudocode` | `boolean` | Right panel: pseudocode |
| `showStatsDrawer` | `boolean` | Post-run stats slide-up |
| `showMazeControls` | `boolean` | Maze generation popover |
| `showKeyboardHud` | `boolean` | Keyboard shortcuts overlay |
| `mazeAlgo` | `MazeAlgoId` | Selected maze algorithm |
| `brushWeight` | `number` | Weight for right-click painting (1–9) |
| `draggingWhat` | `DragMode` | Current mouse drag mode |

---

## 6. Grid Mutation Model — baseGrid vs visualGrid

This two-layer model is the foundation of step-backward and scrubbing.

```
baseGrid        ←─── user edits land here (walls, weights, start, end)
   │                 maze generation also writes here
   │
   └──► clearVisualization() clones baseGrid → visualGrid
   │
   └──► applyStep() applied sequentially → visualGrid
                    (algorithm visualization state)
```

**Key invariant**: `baseGrid` never contains algorithm state (`visited`, `frontier`, `path`, `current`). It only holds the static layout.

**Why this works for step-back**:
- Step-forward: `visualGrid = applyStep(visualGrid, step)` — O(grid size)
- Step-back: `visualGrid = replayTo(steps, targetIndex)` — replays 0..target from `baseGrid`
- This means going back is O(N × grid size) in the worst case, but since all steps are pre-computed in memory, this is fast enough for typical grids (20×32 = 640 cells)

**Maze generation writes to both**: `applyMazeStep()` applies to both `baseGrid` and `visualGrid` so walls persist when the algorithm visualization is cleared.

---

## 7. Playback Engine — usePlayback Hook

`src/hooks/usePlayback.ts` is the orchestration layer that connects the algorithm generators, the stores, and the timer.

### State Machine

```
idle ──run()──► running ──pause()──► paused ──resume()──► running
                   │                    │
                   │                    └──stepForward()/stepBack()
                   │
              (all steps done)
                   │
                   ▼
              done / no-path
```

### run() Flow
```
1. clearInterval (cancel any existing timer)
2. gridStore.clearVisualization()     — reset visual layer
3. algoStore.reset()                  — reset step index, counts
4. algoStore.startTimer()             — record runStartTime
5. runGenerator(algoId, grid, ...)    — drain generator into steps[]
6. algoStore.setSteps(steps)
7. algoStore.setStatus('running')
8. setInterval every `speed` ms:
   a. Apply steps[idx] to visualGrid via gridStore.stepForward()
   b. algoStore.setStepIndex(idx)
   c. Update visitedCount from step.visitedCount if present
   d. Increment pathLength on 'path' steps
   e. idx >= steps.length → clearInterval + finishRun()
```

### finishRun() Flow
```
1. algoStore.stopTimer()            — record wall time
2. algoStore.setStatus('done' | 'no-path')
3. Compute pathSteps and visitedSteps from steps[]
4. algoStore.addMetrics({ visited, pathLength, pathCost, wallTime, ... })
5. uiStore.setShowStatsDrawer(true)  — slide up stats panel
```

### stepBack() Flow
```
1. If stepIndex <= 0: gridStore.clearVisualization(), setStepIndex(-1)
2. Else: gridStore.replayTo(steps, stepIndex - 1)
         algoStore.setStepIndex(stepIndex - 1)
         algoStore.setStatus('paused')
         uiStore.setShowStatsDrawer(false)
```

### scrubTo(idx) Flow
```
1. clearInterval
2. algoStore.setStatus('paused')
3. Clamp idx to [-1, steps.length - 1]
4. If idx < 0: gridStore.clearVisualization()
   Else: gridStore.replayTo(steps, idx)
5. algoStore.setStepIndex(idx)
```

---

## 8. Grid Interaction — useGridInteraction Hook

`src/hooks/useGridInteraction.ts` manages all mouse drag behavior on the grid.

### Drag Modes

| Mode | Trigger | Action |
|------|---------|--------|
| `'start'` | MouseDown on start cell | Drag start marker |
| `'end'` | MouseDown on end cell | Drag end marker |
| `'wall'` | Left-click on empty cell | Paint walls |
| `'erase'` | Left-click on wall cell | Erase walls |
| `'weight'` | Right-click OR shift+left-click | Paint weighted cells with `brushWeight` |

The current drag mode is stored in a `useRef` (not state) to avoid re-renders during drag.

### Interaction Flow
```
onMouseDown(r, c, button, shift):
  1. clearVisualizationIfNeeded() — reset algo state if algo was running
  2. Detect mode based on cell state + button + shift
  3. Apply initial action

onMouseEnter(r, c):
  4. Continue painting in current drag mode

onMouseUp():
  5. dragMode.current = null

Grid onMouseLeave → onMouseUp():
  6. Cancels drag if cursor leaves grid
```

**Guard**: start/end cells cannot be overwritten by wall or weight painting. Protected in both `onMouseDown` and `onMouseEnter`.

---

## 9. Design System — Theme & Styles

### Theme Object
Both `darkTheme` and `lightTheme` implement the `Theme` interface. The active theme is injected by `styled-components ThemeProvider` in `main.tsx` and read in every component via `useTheme() as Theme`.

Key color groups:
- **Backgrounds**: `bg`, `panel`, `panelAlt`, `raised`
- **Text**: `text`, `textMuted`, `textDim`
- **Borders**: `hairline`, `hairlineSoft`, `divider`, `gridLine`
- **Accent colors** (oklch color space): `accent` (blue), `amber` (gold), `green`, `pink`
- **Cell states**: `cellUnvisited`, `cellWall`, `cellFrontier`, `cellFrontierEdge`, `cellVisited`, `cellCurrent`, `cellPath`
- **Shadows**: `shadow`, `shadowLg`

**Why oklch?** The oklch color space provides perceptually uniform lightness, making alpha-variant colors (`oklch(0.72 0.13 220 / 0.35)`) visually consistent across hue angles. This prevents frontier blue and visited blue from appearing different brightness.

### GlobalStyles
CSS keyframes injected globally:
- `pulse-dot` — animated status indicator
- `frontier-pulse` — subtle pulse on frontier cells
- `current-glow` — amber glow ring on the current cell
- `path-appear` — fast fade-in for path cells
- `slide-up` — stats drawer entrance animation
- `fade-in` — general fade-in

`prefers-reduced-motion` disables all animations for accessibility.

### CSS Custom Properties on Cells
Three custom properties are set inline on each cell div for animation access:
- `--fe` — frontier edge color (used in `frontier-pulse` keyframe)
- `--c` — current cell amber color (used in `current-glow`)
- `--c-soft` — current cell amber soft (used in `current-glow` shadow)

---

## 10. Component Architecture

### Layout Structure

```
<Root>                         ← ThemeProvider + GlobalStyles
  <App>
    <NavBar />                 ← top bar: algo selector, toggles
    <div style flex>
      <LeftPanel>              ← 288px, always visible
        <AlgorithmPanel />     ← algo name, family, complexity, badges
        <StepController />     ← transport controls + scrubber
        <AlgorithmState />     ← live open set table (when showDataPanel)
      </LeftPanel>

      <CenterStage>            ← flex 1
        <StageHeader />        ← grid dimensions, step counter, heatmap toggle
        <AutoSizedGrid />      ← fills remaining space
        <CellLegend />         ← floating overlay (top-left)
        <StatsDrawer />        ← slides up from bottom when run completes
        <GridControls />       ← floating maze popover (when showMazeControls)
        <KeyboardHud />        ← floating shortcuts overlay (when showKeyboardHud)
      </CenterStage>

      <RightPanel>             ← 320px, shown when showInfoPanel || showPseudocode
        <HeuristicCard />      ← for A* and Greedy only
        <PseudocodePanel />    ← when showPseudocode
        <InfoPanel />          ← when showInfoPanel (proofs, papers)
      </RightPanel>
    </div>
    <MetricsBar />             ← bottom bar: visited, path, time, speed
  </App>
</Root>
```

### AutoSizedGrid

Uses a `ResizeObserver` (via `useContainerSize` hook) to measure the center panel. Cell size is computed as:

```ts
const cellSize = Math.max(12, Math.min(
  28,
  Math.floor((containerWidth - 64) / cols),
  Math.floor((containerHeight - 64) / rows),
));
```

This clamps cells between 12px (minimum legible) and 28px (maximum decorative), fitting the grid to the available space.

### Cell (memoized)

`Cell` is wrapped in `React.memo`. Because the grid can have 640+ cells, re-rendering all of them on every step would be expensive. The memo prevents re-renders unless the cell's data reference changes — and since `applyStep` returns a **new grid array with only the affected row cloned**, only cells in the modified row are re-rendered per step.

---

## 11. Algorithms — Deep Dive

All algorithms use 4-directional movement: up, down, left, right. Diagonal movement is not supported.

### BFS — Breadth-First Search
**File**: `src/algorithms/bfs.ts`

Data structure: FIFO queue (`Array.shift()`)

```
Queue: [start]
visited: Set<string>
parent: Map<key, parent_key>

Loop:
  u = queue.shift()          → yield dequeue
  if u === goal:             → reconstruct + yield path steps + done
  yield visit(u)
  for each neighbor v not in visited:
    visited.add(v)
    parent[v] = u
    queue.push(v)            → yield enqueue
```

**Properties**: Optimal on unweighted graphs (explores by level = by distance). Complete. Time/Space: O(V + E).

**Why optimal**: The first time a cell is dequeued, it was reached by the shortest possible hop-count path. Any shorter path would have been discovered in an earlier BFS level.

### DFS — Depth-First Search
**File**: `src/algorithms/dfs.ts`

Data structure: LIFO stack (`Array.pop()`)

Same structure as BFS but `stack.pop()` instead of `queue.shift()`. This changes exploration order from level-by-level to depth-first, following one branch until it backtracks.

**Properties**: NOT optimal — finds A path, not THE shortest. Complete. Useful for maze solving where any solution suffices.

### Dijkstra's Algorithm
**File**: `src/algorithms/dijkstra.ts`

Data structure: Min-heap (sorted array by distance) — `[dist, row, col]` tuples

```
dist[start] = 0; dist[all others] = Infinity
heap = [[0, start.r, start.c]]
settled: Set<string>

Loop:
  heap.sort() → [d, r, c] = heap.shift()  → yield dequeue
  if settled: skip
  settled.add([r,c])
  yield visit([r,c])
  for each neighbor v:
    alt = d + cell.weight
    if alt < dist[v]:
      dist[v] = alt
      parent[v] = [r,c]
      heap.push([alt, v.r, v.c])          → yield relax
```

**Properties**: Optimal for non-negative weights. Complete. Time: O((V+E) log V). The `relax` step carries the new `gScore` which is displayed in the live data table and on visited cells (when cellSize ≥ 22px).

### A* Search
**File**: `src/algorithms/aStar.ts`

Data structure: Min-heap sorted by `f = g + h` — `[f, g, row, col]` tuples

```
gScore[start] = 0
fScore[start] = h(start, goal)
open = [[f, g, start.r, start.c]]
closed: Set<string>

Loop:
  open.sort() → [f, g, r, c] = open.shift()   → yield dequeue (with g, h, f)
  if closed: skip
  closed.add([r,c])
  yield visit
  for each neighbor v not in closed:
    w = cell.weight
    tentG = g + w
    if tentG < gScore[v]:
      gScore[v] = tentG
      hVal = h([v.r,v.c], goal)
      fVal = tentG + hVal
      fScore[v] = fVal
      parent[v] = [r,c]
      open.push([fVal, tentG, v.r, v.c])       → yield relax (with g, h, f)
```

Every `relax` step carries `gScore`, `hScore`, and `fScore` — displayed in the AlgorithmState table with three columns. The heatmap overlay shows `h(n)` values color-mixed for all unvisited cells.

**Heuristics** (selectable in HeuristicCard / NavBar):
- **Manhattan**: `|Δr| + |Δc|` — exact on 4-directional unweighted grids, admissible
- **Euclidean**: `√(Δr² + Δc²)` — admissible, slightly under-estimates on grids (slightly more nodes visited than Manhattan)
- **Chebyshev**: `max(|Δr|, |Δc|)` — appropriate for 8-directional movement; on 4-directional grids it under-estimates and remains admissible

All three are **admissible** (never overestimate) → A* remains optimal.

### Greedy Best-First
**File**: `src/algorithms/greedyBestFirst.ts`

Data structure: Min-heap sorted by `h` only — `[h, row, col]`

Identical to A* except: **no g-term**. Priority is purely `h(n, goal)`. This makes it faster (explores fewer nodes when the path is direct) but **non-optimal** — it ignores actual path cost and can be fooled by obstacles.

**Properties**: NOT optimal. NOT complete in infinite spaces (complete on finite grids). The contrast with A* demonstrates why the g-term matters.

### Bidirectional BFS
**File**: `src/algorithms/bidirectionalBfs.ts`

Two simultaneous BFS frontiers:
- Forward frontier from `start`
- Backward frontier from `goal`

Each iteration processes one node from each frontier. When a node explored by the forward frontier is found in the backward frontier's visited set (or vice versa), the frontiers have met.

Path reconstruction: forward path from start to meeting point (via `fParent`) + backward path from meeting point to goal (via `bParent`).

**Properties**: Optimal on unweighted graphs. Complexity O(b^(d/2)) vs O(b^d) for one-directional BFS — dramatically fewer nodes explored on long paths.

### JPS — Jump Point Search
**File**: Registry entry only (metadata in `ALGORITHM_REGISTRY`, no generator implemented)

JPS is documented in the registry with pseudocode, papers (Harabor & Grastien AAAI 2011), and complexity info. The generator is not implemented because JPS requires directional pruning rules that depend on grid structure in ways that don't fit the simple 4-directional step model. It would be a future addition.

---

## 12. Maze Generators — Deep Dive

Maze generators use the same `AlgorithmStep` type as pathfinding algorithms, emitting `add-wall` and `remove-wall` steps. This means they animate through the same grid rendering pipeline.

### Recursive Backtracking (DFS Maze)
**File**: `src/maze/recursiveBacktracking.ts`

```
1. Fill all even-row and even-column cells with walls (creates grid of isolated cells)
2. DFS from a starting cell:
   a. Visit cell: yield remove-wall(cell position)
   b. Shuffle neighbor directions [N, S, E, W]
   c. For each unvisited neighbor:
      - yield remove-wall(wall between current and neighbor)
      - recurse into neighbor
3. Ensure start and end cells are clear
```

The even/odd coordinate system is key: cells are at positions `(2k+1, 2k+1)`, walls between cells are at `(cell1 + cell2) / 2`. This creates a perfect maze (every cell reachable, no loops).

**Result**: Long, winding corridors with few branches. Hard mazes.

### Prim's Algorithm (Random Prim's)
**File**: `src/maze/primsAlgorithm.ts`

```
1. Fill all cells with walls: yield add-wall for every cell
2. Pick a starting cell at center; mark as in-maze
3. Add all neighbors of starting cell to frontier list
4. While frontier not empty:
   a. Pick a random frontier cell
   b. Find a random in-maze neighbor
   c. yield remove-wall(frontier cell)
   d. yield remove-wall(wall between frontier cell and maze neighbor)
   e. Add frontier cell to maze
   f. Add its unvisited neighbors to frontier
5. Clear start and end
```

**Result**: Many short branches, more open feel than backtracking. Easier to solve but still complex.

### Recursive Division
**File**: `src/maze/recursiveDivision.ts`

```
1. Add border walls on all 4 sides
2. Recursively divide(r1, c1, r2, c2):
   a. If region too small: return
   b. Choose orientation: horizontal if taller, vertical if wider, random if square
   c. Horizontal: draw wall at random row, leave one passage hole
      Then recurse on top and bottom sub-regions
   d. Vertical: draw wall at random column, leave one passage hole
      Then recurse on left and right sub-regions
3. Clear start and end
```

**Result**: Rectangular room structure with clear corridors. Visually striking, easy to understand algorithmically.

### Random Scatter
Not a generator — the `GridControls` component has a "Random" option that directly calls `gridStore.setWall()` in a loop with ~30% density.

---

## 13. Feature Flows — Step by Step

### Flow 1: Run an Algorithm

```
User clicks Run (or presses Space/Enter)
  ↓
usePlayback.run()
  ↓
gridStore.clearVisualization()      → visualGrid = clone(baseGrid)
algoStore.reset()                   → status = 'idle', stepIndex = -1
algoStore.startTimer()              → runStartTime = Date.now()
  ↓
runGenerator(algoId, baseGrid, start, end, heuristic)
  ↓ (generator drained into array)
algoStore.setSteps(steps[])         → 500–5000 steps stored in memory
algoStore.setStatus('running')
  ↓
setInterval(speed ms):
  step = steps[idx]
  gridStore.stepForward(step)       → visualGrid = applyStep(visualGrid, step)
  algoStore.setStepIndex(idx)
  idx >= steps.length → finishRun()
  ↓
finishRun():
  algoStore.stopTimer()
  algoStore.setStatus('done' | 'no-path')
  algoStore.addMetrics(...)
  uiStore.setShowStatsDrawer(true)  → StatsDrawer slides up
```

### Flow 2: Draw a Wall

```
User left-clicks empty cell on grid
  ↓
useGridInteraction.onMouseDown(r, c, button=0, shift=false)
  ↓
clearVisualizationIfNeeded()        → if algo was running, clear it
dragMode.current = 'wall'
gridStore.setWall(r, c, true)
  ↓
User drags to adjacent cells
  ↓
onMouseEnter(r, c) for each:
  dragMode.current === 'wall'
  gridStore.setWall(r, c, true)
  ↓
onMouseUp() → dragMode.current = null
```

### Flow 3: Generate a Maze

```
User opens Maze Controls (M key or NavBar button)
User selects algorithm (Backtracking / Prim's / Division)
User clicks "Generate Maze"
  ↓
GridControls.handleGenerate():
  algoStore.reset()
  gridStore.clearAll()              → fresh empty grid
  const gen = recursiveBacktracking(rows, cols, start, end)
  ↓
  While gen not done:
    step = gen.next()
    gridStore.applyMazeStep(step)   → writes to BOTH baseGrid and visualGrid
    await sleep(8ms)                → animation frame delay
  ↓
  setGenerating(false)              → button re-enables
```

The 8ms delay makes the maze carving animate visually. `applyMazeStep` (not `stepForward`) is used so walls persist in `baseGrid`.

### Flow 4: Change Heuristic (A*)

```
User clicks Manhattan / Euclidean / Chebyshev in HeuristicCard
  ↓
algoStore.setHeuristic('euclidean')
  ↓ (Zustand reactive update)
NavBar heuristic selector reflects new value
HeuristicCard highlights new button, shows updated formula
  ↓
Next time user clicks Run:
  runGenerator passes heuristics['euclidean'] as h function to aStar()
```

### Flow 5: Scrub the Playback Timeline

```
User drags the scrubber input in StepController
  ↓
<input type="range" value={stepIndex} onInput={...}>
  ↓
usePlayback.scrubTo(newIndex)
  ↓
clearInterval                       → stop auto-advance
algoStore.setStatus('paused')
gridStore.replayTo(steps, newIndex) → rebuild visualGrid from baseGrid
algoStore.setStepIndex(newIndex)
```

---

## 14. Compare Mode Flow

Compare mode renders two independent algorithm visualizations side by side, synchronized to the same tick counter. The key constraint: **both algorithms use the same `baseGrid`** — so building walls or moving start/goal affects both simultaneously.

```
User clicks Compare in NavBar
  ↓
uiStore.setCompareMode(true)
  ↓
App renders <CompareMode> full-screen (replaces three-panel layout)

CompareMode internals:
  ├── leftAlgo, rightAlgo (local state, default astar + dijkstra)
  ├── leftSteps[], rightSteps[] (local state)
  ├── tick, totalTicks (shared counter)
  └── intervalRef (shared interval)

User clicks Run:
  ↓
runBoth():
  ls = runAlgo(leftAlgo, baseGrid, start, end)   → drain left generator
  rs = runAlgo(rightAlgo, baseGrid, start, end)  → drain right generator
  setTotalTicks(max(ls.length, rs.length))
  setInterval(30ms): setTick(i++)
  ↓
Each ComparePanel:
  visualGrid = useMemo(() => {
    let grid = cloneGrid(baseGrid)
    for (i = 0; i <= stepIdx; i++): grid = applyStep(grid, steps[i])
    return grid
  }, [baseGrid, steps, stepIdx])
  ↓ (pure replay, no shared state mutation)
  Renders own grid with own visualGrid
  Shows own visited/frontier/path counts

When both done:
  <CompareStats> table shows:
    - Nodes visited (left vs right, highlight lower)
    - Path length (highlight if equal)
    - Total steps
    - Optimal? (from ALGORITHM_REGISTRY)
```

Compare mode does **not** use `gridStore.visualGrid` or `gridStore.stepForward()` — it computes its own visual grid via `applyStep` replay in `useMemo`. This keeps it completely independent from the main playback engine.

---

## 15. Cell Rendering Pipeline

For a 20×32 grid (640 cells), cell rendering must be fast. The pipeline:

```
gridStore.visualGrid (Zustand)
  ↓ (Zustand subscription in Grid.tsx)
Grid component re-renders
  ↓
useMemo([visualGrid]) → cells[] array of <Cell> components
  ↓ (React reconciliation)
Only cells whose data reference changed re-render (React.memo)
  ↓ (inside Cell)
getCellBg(cell, theme, showHeatmap, hValue, maxH)
  → returns CSS color string

getCellBoxShadow(cell, theme)
  → returns box-shadow string

getCellAnimation(cell)
  → returns animation string
  ↓
div with inline styles, CSS custom props (--fe, --c, --c-soft)
```

**Heatmap mode** (A* / Greedy only): When enabled, unvisited cells display a `color-mix(in oklch, ...)` gradient based on normalized Manhattan distance to goal. Cells near the goal are warm blue; cells far away are cool/transparent.

**gScore display**: On visited cells with cellSize ≥ 22px, the g-score (cost from start) is shown in the top-left corner of the cell in a small monospace label.

---

## 16. Keyboard Shortcuts

Registered in `App.tsx` via `window.addEventListener('keydown')`.

| Key | Action |
|-----|--------|
| `Space` | Play (if idle) / Pause (if running) / Resume (if paused) |
| `←` | Step back one frame |
| `→` | Step forward one frame |
| `R` | Reset visualization (keep grid) |
| `C` | Clear entire grid + reset |
| `M` | Toggle maze controls popover |
| `Enter` | Run algorithm (when idle/done/no-path) |
| `1`–`9` | Set brush weight for right-click painting |

Shortcuts are disabled when focus is inside `INPUT`, `SELECT`, or `TEXTAREA`.

---

## 17. Algorithm Registry

`src/constants/algorithms.ts` exports `ALGORITHM_REGISTRY: Record<AlgorithmId, AlgorithmMeta>`.

Each entry contains:
- `id`, `name`, `short`, `family` — display names
- `complexity: { time, space }` — shown in `ComplexityBadge` components
- `optimal`, `complete`, `weighted` — shown as `PropertyChip` components
- `color` — accent color used in UI elements for that algorithm
- `blurb` — one-paragraph description shown in `AlgorithmPanel`
- `pseudocode: string[]` — line array displayed in `PseudocodePanel`
- `stepToLine: Partial<Record<AlgorithmStepType, number>>` — maps step types to pseudocode line indices for live highlighting
- `papers: PaperRef[]` — academic citations with DOI links shown in `InfoPanel`
- `proofSketch: string` — plain-English correctness proof shown in `InfoPanel`
- `watchFor: string[]` — bullet points guiding educational observation

### Pseudocode Highlighting Flow
```
algorithmStore.steps[stepIndex].pseudocodeLine
  ↓ (read in PseudocodePanel)
Highlighted line rendered with accent background
Other lines rendered dim
```

The `pseudocodeLine` field is set by each algorithm at every `yield`. It maps to a 0-indexed line in the `pseudocode` array via `stepToLine` in the registry. Some steps carry the line number directly; others are mapped via `stepToLine[step.type]`.

---

## Summary Diagram

```
User Input
    │
    ├── Mouse  → useGridInteraction → gridStore.setWall/Weight/Start/End
    ├── Keyboard → usePlayback.run/pause/resume/step/reset
    └── UI Controls → algorithmStore.setAlgo/setHeuristic, uiStore.toggle*

Algorithm Execution
    │
    ├── src/algorithms/*.ts → Generator<AlgorithmStep>
    └── src/maze/*.ts       → Generator<AlgorithmStep>
         │
         ▼ (drained into array)
    steps: AlgorithmStep[]
         │
         ▼ (setInterval tick)
    gridStore.stepForward(step) → applyStep(visualGrid, step) → new visualGrid

Rendering
    │
    ├── visualGrid (Zustand) → Grid → useMemo(cells) → Cell (memoized)
    ├── algorithmStore → AlgorithmState (open set table), PseudocodePanel
    ├── algorithmStore → MetricsBar (live counters)
    └── metricsHistory → StatsDrawer (post-run chart)
```
