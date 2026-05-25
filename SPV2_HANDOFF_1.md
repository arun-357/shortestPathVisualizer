# Shortest Path Visualizer v2.0 — Claude Code Handoff

## Project Overview

A complete redesign and upgrade of an existing shortest-path visualizer into a **serious, research-grade interactive learning tool** — the kind that belongs in a CS course syllabus or on a senior engineer's portfolio. Not just a pretty grid; a tool that teaches algorithm intuition deeply through step-by-step execution, complexity analysis, linked academic papers, and side-by-side algorithm comparison.

**Existing project (to upgrade, not replace):**
- GitHub: https://github.com/arun-357/shortestPathVisualizer
- Live: https://shortest-path-visualizer-blue.vercel.app/
- Current stack: React + Tailwind CSS + Vite (JavaScript)

**Design reference:** Provided via Claude design URL (attach when running)
**Deploy target:** Vercel (existing deployment, same URL)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 |
| Language | TypeScript — strict mode, `.ts` / `.tsx` throughout |
| Build tool | Vite |
| Component styling | styled-components v6 + ThemeProvider |
| Dynamic styles | @emotion/react `css` prop |
| State management | Zustand (lightweight, no Redux boilerplate) |
| Linting | ESLint + @typescript-eslint + eslint-plugin-react-hooks |
| Formatting | Prettier |
| Git hooks | Husky + lint-staged |
| Deploy | Vercel (static, `vite build`) |

### Migration note
Current codebase is JavaScript. Migrate all files to TypeScript during the rebuild. Keep the algorithm logic from `src/utils/` as the reference implementation — rewrite in TS with proper types.

---

## Core Design Philosophy

This is an **educational tool for advanced CS audiences** (students, engineers, interviewers). Every design decision should serve one goal: making the *internals* of each algorithm visible and understandable.

Three principles:
1. **Step is sacred** — the user controls every tick of the algorithm. Play, pause, step-back, step-forward, scrub. Like a debugger, not a movie.
2. **Data surfaced, not hidden** — the priority queue, visited set, distance table, and relaxation events are visible live as the algorithm runs. No black box.
3. **Comparison is insight** — users can run two algorithms simultaneously on the same grid, side by side, and watch them diverge.

---

## Algorithms to Support

### Uninformed Search
| Algorithm | Notes |
|---|---|
| **BFS** (existing) | Guarantees shortest path on unweighted graphs |
| **DFS** | Does NOT guarantee shortest path — teach this as a contrast |
| **Bidirectional BFS** | Two frontiers meeting in the middle |

### Informed / Heuristic Search
| Algorithm | Notes |
|---|---|
| **Dijkstra's** (existing) | Weighted graphs, no negative edges |
| **A\*** | Heuristic: Manhattan, Euclidean, Chebyshev — user-selectable |
| **Greedy Best-First** | Fast but not optimal — good contrast with A\* |
| **Jump Point Search (JPS)** | A\* optimization for uniform grids — advanced |

### Maze / Graph Generation
| Method | Notes |
|---|---|
| Recursive Backtracking (DFS) | Perfect mazes |
| Randomized Prim's | Organic, uniform spanning tree |
| Recursive Division | Grid-structured, faster |
| Random weights | Assign random 1–10 weights to edges for Dijkstra/A\* demos |

---

## Component Architecture

```
src/
├── components/
│   ├── grid/
│   │   ├── Grid.tsx                    # main canvas — CSS Grid or SVG
│   │   ├── Cell.tsx                    # individual cell with state-driven color
│   │   ├── GridControls.tsx            # size slider, weight toggle, clear button
│   │   └── useGrid.ts                  # grid state, cell mutation, drag handling
│   ├── algorithm/
│   │   ├── AlgorithmPanel.tsx          # left sidebar — algo selector, heuristic picker
│   │   ├── StepController.tsx          # play/pause/step/scrub/speed controls
│   │   ├── AlgorithmState.tsx          # live data structures panel (queue, visited, etc.)
│   │   ├── ComplexityBadge.tsx         # time/space complexity display
│   │   └── PseudocodePanel.tsx         # highlighted pseudocode that tracks current step
│   ├── comparison/
│   │   ├── CompareMode.tsx             # split-screen two-grid layout
│   │   ├── CompareStats.tsx            # side-by-side metrics table after run
│   │   └── AlgoSelector.tsx            # pick left and right algorithms
│   ├── metrics/
│   │   ├── MetricsBar.tsx              # live: nodes visited, path length, time elapsed
│   │   ├── StatsDrawer.tsx             # post-run drawer: full stats, charts
│   │   └── HistoryChart.tsx            # recharts bar chart of past runs
│   ├── learn/
│   │   ├── InfoPanel.tsx               # collapsible right panel with algorithm explainer
│   │   ├── PaperLink.tsx               # linked academic paper citations
│   │   └── ProofHint.tsx               # correctness proof sketch (why it works)
│   └── ui/
│       ├── NavBar.tsx
│       ├── ThemeToggle.tsx
│       ├── Tooltip.tsx
│       └── Modal.tsx
├── algorithms/
│   ├── types.ts                        # AlgorithmStep, GridState, NodeState, HeuristicFn
│   ├── bfs.ts
│   ├── dfs.ts
│   ├── bidirectionalBfs.ts
│   ├── dijkstra.ts
│   ├── aStar.ts
│   ├── greedyBestFirst.ts
│   ├── jumpPointSearch.ts
│   └── heuristics.ts                   # manhattan, euclidean, chebyshev
├── maze/
│   ├── recursiveBacktracking.ts
│   ├── primsAlgorithm.ts
│   └── recursiveDivision.ts
├── store/
│   ├── gridStore.ts                    # Zustand — grid cells, start/end positions
│   ├── algorithmStore.ts               # selected algo, playback state, step history
│   └── uiStore.ts                      # panel visibility, theme, compare mode
├── hooks/
│   ├── usePlayback.ts                  # play/pause/step/rewind logic
│   ├── useGridInteraction.ts           # mouse drag, touch, keyboard shortcuts
│   └── useAnimationSpeed.ts
├── styles/
│   ├── theme.ts                        # design tokens
│   ├── GlobalStyles.ts
│   └── animations.ts
├── types/
│   └── index.ts
├── constants/
│   ├── algorithms.ts                   # registry: name, complexity, paper links
│   └── colors.ts                       # cell state → color mapping
└── App.tsx
```

---

## Algorithm Engine — Key Design

### Generator-based step system

Every algorithm is implemented as a **JavaScript generator function** that yields one `AlgorithmStep` at a time. This is the foundation of the step-by-step visualization — the engine pulls one step per tick and applies it to state.

```ts
// algorithms/types.ts
export type CellState =
  | 'unvisited'
  | 'visited'
  | 'frontier'     // in queue / open set
  | 'path'
  | 'current'      // node being processed this step
  | 'wall'
  | 'weight';

export interface AlgorithmStep {
  type: 'visit' | 'enqueue' | 'dequeue' | 'relax' | 'path' | 'done';
  cell: [number, number];
  from?: [number, number];          // parent pointer
  gScore?: number;                   // distance so far (Dijkstra/A*)
  fScore?: number;                   // f = g + h (A* only)
  hScore?: number;                   // heuristic value (A* only)
  queueSnapshot?: [number, number][]; // current priority queue contents
  visitedCount?: number;
  message?: string;                  // human-readable explanation of this step
}

// Example generator signature:
export type AlgorithmGenerator = (
  grid: GridState,
  start: [number, number],
  end: [number, number],
  options?: AlgorithmOptions
) => Generator<AlgorithmStep, AlgorithmStep[], never>;
```

### Scrub / rewind

Store all yielded steps in a `steps: AlgorithmStep[]` array as the algorithm runs. Scrubbing backwards replays steps from index 0 to the target index — recomputing cell states by replaying the step array. This avoids needing to snapshot the full grid at every step.

### Playback hook

```ts
// hooks/usePlayback.ts
interface PlaybackState {
  status: 'idle' | 'running' | 'paused' | 'done';
  stepIndex: number;
  totalSteps: number;
  speed: number;           // ms per step: 1–500
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  scrubTo: (index: number) => void;
  reset: () => void;
}
```

---

## Live Data Structures Panel

While the algorithm runs, a collapsible side panel shows internal state. This is the **most educationally valuable feature**.

### BFS / DFS
- **Queue / Stack** — rendered as a horizontal scrolling list of cell coordinates. Current front of queue highlighted.
- **Visited Set** — count + last 10 additions

### Dijkstra
- **Priority Queue** — top 10 entries shown as `(node, dist)` pairs, sorted by distance
- **Distance Table** — scrollable table of all nodes with current best-known distance. Updates live.
- **Relaxation log** — last 5 relaxation events: `d[v] = d[u] + w(u,v)` with actual numbers

### A\*
- All of Dijkstra's panels plus:
- **Open Set** with `f = g + h` breakdown per node
- **Heuristic visualizer** — toggle an overlay on the grid showing h-values as a heat map

---

## Pseudocode Panel

Each algorithm has a pseudocode block (plain English, not code) that **highlights the current line** in sync with the step being executed.

```ts
// constants/algorithms.ts
export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: 'astar',
    name: 'A* Search',
    complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
    optimal: true,
    complete: true,
    weighted: true,
    pseudocode: [
      'Initialize open set with start node',
      'Set g(start) = 0, f(start) = h(start)',
      'While open set is not empty:',
      '  Pop node with lowest f score',
      '  If node is goal → reconstruct path',
      '  For each neighbor of node:',
      '    Compute tentative g = g(node) + edge_weight',
      '    If tentative g < g(neighbor):',
      '      Update parent, g, and f of neighbor',
      '      Add neighbor to open set',
    ],
    // step.type maps to pseudocode line index
    stepToLine: {
      enqueue: 0,
      dequeue: 3,
      path: 4,
      relax: 6,
      visit: 7,
    },
    papers: [
      {
        title: 'A Formal Basis for the Heuristic Determination of Minimum Cost Paths',
        authors: 'Hart, Nilsson, Raphael',
        year: 1968,
        url: 'https://ieeexplore.ieee.org/document/4082128',
      },
    ],
    proofSketch: 'A* is optimal when h is admissible (never overestimates). At the moment the goal is dequeued, g(goal) equals the true shortest path cost because any alternative path through an unexplored node would have cost ≥ f of that node ≥ g(goal).',
  },
  // ... other algorithms
];
```

---

## Academic Paper Links

Each algorithm in the info panel links to its original paper. These render as styled citation cards (not plain links).

| Algorithm | Paper | Year | URL |
|---|---|---|---|
| Dijkstra | A note on two problems in connexion with graphs | 1959 | https://link.springer.com/article/10.1007/BF01386390 |
| A\* | A Formal Basis for the Heuristic Determination of Minimum Cost Paths | 1968 | https://ieeexplore.ieee.org/document/4082128 |
| BFS | Introduced formally in Moore 1959, Shannon 1951 | 1959 | https://dl.acm.org/doi/10.1145/321556.321565 |
| Jump Point Search | Online Graph Pruning for Pathfinding on Grid Maps | 2011 | https://users.cecs.anu.edu.au/~dharabor/data/papers/harabor-grastien-aaai11.pdf |
| Bidirectional BFS | Bidirectional Search | Pohl 1971 | https://www.sciencedirect.com/science/article/pii/B9780120928606500060 |

---

## Comparison Mode

Toggle a **split-screen mode** that renders two independent grids (same maze, same start/end) running different algorithms simultaneously. Playback is synced — both advance one step per tick.

After completion, a **stats comparison table** appears:

| Metric | Algorithm A | Algorithm B |
|---|---|---|
| Nodes visited | 142 | 67 |
| Path length | 38 | 38 |
| Path cost (weighted) | 52 | 52 |
| Steps to complete | 142 | 89 |
| Optimal? | ✓ | ✓ |

This directly answers the classic interview question: "Why use A\* over Dijkstra?" — the user *sees* it.

---

## Grid Interaction

- **Left click** — place/remove wall
- **Right click** — place/remove weight (1–9, displayed as number in cell)
- **Drag start node** — move start position
- **Drag end node** — move end position
- **Shift + drag** — paint weights
- **Keyboard shortcuts:**
  - `Space` — play / pause
  - `→` — step forward
  - `←` — step back
  - `R` — reset visualization (keep maze)
  - `C` — clear everything
  - `M` — generate maze
  - `1–9` — set brush weight

---

## Visual Design System

### Cell states → colors (defined in `constants/colors.ts`)

| State | Dark mode | Light mode | Meaning |
|---|---|---|---|
| unvisited | `#0d1117` | `#f8f9fa` | Not yet seen |
| wall | `#1f2937` | `#1f2937` | Blocked |
| frontier | `#1d4ed8` → `#60a5fa` | same | In queue — pulse animation |
| visited | `#0f3460` | `#bfdbfe` | Explored |
| current | `#f59e0b` | `#d97706` | Being processed this step |
| path | `#22c55e` | `#16a34a` | Final shortest path |
| weight-1 | `#1e293b` | `#e2e8f0` | Low cost |
| weight-9 | `#7c2d12` | `#fca5a5` | High cost |

### Animations
- **Frontier spread** — cells entering the queue get a ripple/pulse animation (CSS `@keyframes`)
- **Path reconstruction** — final path draws sequentially, cell by cell, with a traveling highlight
- **Current cell** — glowing border or bright fill on the node being processed
- **Heuristic heatmap** — smooth color gradient (blue → red) for h-values in A\* mode
- All animations respect `prefers-reduced-motion`

### Layout — three-panel design

```
┌─ NAVBAR ────────────────────────────────────────────────────┐
│  Logo  [Algorithm ▾]  [Heuristic ▾]  [Compare]  [Theme]    │
├─ LEFT PANEL (280px) ─┬─ GRID (flex grow) ─┬─ RIGHT PANEL ──┤
│                      │                    │                 │
│  Algorithm Selector  │   GRID CANVAS      │  Info Panel     │
│  Complexity Badge    │                    │  Pseudocode     │
│  Playback Controls   │  ← drag resize →   │  Paper Links    │
│  Speed Slider        │                    │  Proof Sketch   │
│  Data Structures     │                    │                 │
│  (live queue/table)  │                    │  [collapse →]   │
│                      │                    │                 │
├──────────────────────┴────────────────────┴─────────────────┤
│  METRICS BAR: Nodes visited: 142 | Path: 38 | Steps: 0:04  │
└─────────────────────────────────────────────────────────────┘
```

On mobile: left panel becomes a bottom drawer, right panel becomes a floating FAB that opens a sheet.

---

## Metrics & Stats

### Live metrics bar (always visible, bottom of grid)
- Nodes visited (increments each step)
- Current path length (updates as path reconstructs)
- Steps elapsed
- Elapsed time (wall clock, pauses when paused)
- Algorithm status: `RUNNING` / `PAUSED` / `PATH FOUND` / `NO PATH`

### Post-run stats drawer
Slides up after completion:
- Full metrics table
- `recharts` bar chart comparing this run to last 5 runs on the same grid
- "Why did this algorithm visit N nodes?" — one-sentence explanation pulled from `AlgorithmMeta`

---

## Maze Generation UX

Maze generation is also **animated step by step** — walls appear progressively so the user sees the maze being carved. Each generator is also a generator function (`function*`).

Controls in `GridControls`:
- Dropdown: Recursive Backtracking / Prim's / Recursive Division / Random Walls
- Density slider (for random walls: 10%–60%)
- Weight density slider (what % of open cells get weights)
- `Generate Maze` button — animated
- `Clear Maze` — keeps start/end, removes walls

---

## TypeScript Conventions

- `tsconfig.json` — `strict: true`, `noUncheckedIndexedAccess: true`
- `AlgorithmStep` is a discriminated union by `type` field
- `Grid` is `readonly CellData[][]` — mutations go through Zustand actions only
- `CellData` interface:
```ts
interface CellData {
  row: number;
  col: number;
  state: CellState;
  weight: number;         // 1 = default, 2–9 = weighted
  gScore: number;
  hScore: number;
  fScore: number;
  parent: [number, number] | null;
}
```
- All algorithm generators typed as `Generator<AlgorithmStep>`
- `AlgorithmMeta` is fully typed — no loose strings

---

## ESLint Config

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-imports': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-fallthrough': 'error',
  },
};
```

---

## Key `package.json` Dependencies

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "styled-components": "^6",
    "@emotion/react": "^11",
    "@emotion/styled": "^11",
    "zustand": "^4",
    "recharts": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "vite": "^5",
    "@vitejs/plugin-react": "^4",
    "@types/react": "^18",
    "@types/styled-components": "^5",
    "@typescript-eslint/eslint-plugin": "^7",
    "@typescript-eslint/parser": "^7",
    "eslint-plugin-react-hooks": "^4",
    "prettier": "^3",
    "husky": "^9",
    "lint-staged": "^15"
  }
}
```

---

## `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Deliverables Checklist

### Foundation
- [ ] Vite + React + TypeScript scaffold, strict tsconfig
- [ ] Migrate existing JS components and utils to TypeScript
- [ ] Zustand stores: `gridStore`, `algorithmStore`, `uiStore`
- [ ] `theme.ts` + `ThemeProvider` + `GlobalStyles`
- [ ] Three-panel layout (left sidebar, grid, right panel)

### Grid
- [ ] `Grid.tsx` — CSS Grid rendering, responsive sizing
- [ ] `Cell.tsx` — all `CellState` variants styled, animated
- [ ] `useGridInteraction.ts` — drag walls, drag start/end, weight painting
- [ ] Keyboard shortcut handler

### Algorithm Engine
- [ ] `algorithms/types.ts` — all shared types
- [ ] Generator implementations: BFS, DFS, Bidirectional BFS, Dijkstra, A\*, Greedy BFS
- [ ] `heuristics.ts` — Manhattan, Euclidean, Chebyshev
- [ ] `usePlayback.ts` — play/pause/step/scrub/reset
- [ ] Step → cell state application pipeline

### Maze Generation
- [ ] Recursive Backtracking generator
- [ ] Prim's generator
- [ ] Recursive Division generator
- [ ] Animated maze generation (same playback system)

### UI Panels
- [ ] `AlgorithmPanel.tsx` — selector, heuristic picker, complexity badge
- [ ] `StepController.tsx` — play/pause/step/speed/scrub
- [ ] `AlgorithmState.tsx` — live queue/table/visited set
- [ ] `PseudocodePanel.tsx` — pseudocode with line highlighting
- [ ] `InfoPanel.tsx` — explainer, paper citations, proof sketch
- [ ] `MetricsBar.tsx` — live bottom bar

### Comparison Mode
- [ ] `CompareMode.tsx` — split-screen dual grid
- [ ] Synced playback across both grids
- [ ] `CompareStats.tsx` — post-run stats table

### Post-run
- [ ] `StatsDrawer.tsx` with recharts history chart
- [ ] `PaperLink.tsx` citation cards (linked to real papers above)

### Polish
- [ ] Dark / light theme toggle
- [ ] Mobile responsive — bottom drawer + FAB
- [ ] `prefers-reduced-motion` respected
- [ ] All keyboard shortcuts working
- [ ] Deploy to Vercel, verify at existing URL
