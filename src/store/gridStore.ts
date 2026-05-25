import { create } from 'zustand';
import type { AlgorithmStep, CellData, CellState, GridState } from '../algorithms/types';

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 32;

function makeCell(row: number, col: number): CellData {
  return { row, col, state: 'unvisited', weight: 1, gScore: Infinity, hScore: 0, fScore: Infinity, parent: null };
}

function makeGrid(rows: number, cols: number, start: [number, number], end: [number, number]): CellData[][] {
  const g: CellData[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => makeCell(r, c))
  );
  if (g[start[0]]?.[start[1]]) g[start[0]]![start[1]]!.state = 'start';
  if (g[end[0]]?.[end[1]]) g[end[0]]![end[1]]!.state = 'end';
  return g;
}

function cloneGrid(grid: CellData[][]): CellData[][] {
  return grid.map(row => row.map(cell => ({ ...cell })));
}

export function applyStep(grid: CellData[][], step: AlgorithmStep): CellData[][] {
  const [r, c] = step.cell;
  if (r < 0 || r >= grid.length || c < 0 || c >= (grid[0]?.length ?? 0)) return grid;
  const newGrid = grid.map(row => [...row]);
  const cell = { ...newGrid[r]![c]! };

  const isFixed = cell.state === 'start' || cell.state === 'end';

  switch (step.type) {
    case 'enqueue':
    case 'relax':
      if (!isFixed) cell.state = 'frontier';
      if (step.gScore !== undefined) cell.gScore = step.gScore;
      if (step.hScore !== undefined) cell.hScore = step.hScore;
      if (step.fScore !== undefined) cell.fScore = step.fScore;
      if (step.from) cell.parent = step.from;
      break;
    case 'dequeue':
      if (!isFixed) cell.state = 'current';
      if (step.gScore !== undefined) cell.gScore = step.gScore;
      break;
    case 'visit':
      if (!isFixed) cell.state = 'visited';
      if (step.gScore !== undefined) cell.gScore = step.gScore;
      if (step.from) cell.parent = step.from;
      break;
    case 'path':
      if (!isFixed) cell.state = 'path';
      break;
    case 'add-wall':
      cell.state = 'wall';
      break;
    case 'remove-wall':
      cell.state = 'unvisited';
      break;
  }

  newGrid[r]![c] = cell;
  return newGrid;
}

interface GridStore {
  rows: number;
  cols: number;
  start: [number, number];
  end: [number, number];
  baseGrid: CellData[][];
  visualGrid: CellData[][];
  initGrid: (rows?: number, cols?: number) => void;
  setWall: (r: number, c: number, isWall: boolean) => void;
  setWeight: (r: number, c: number, weight: number) => void;
  setStart: (pos: [number, number]) => void;
  setEnd: (pos: [number, number]) => void;
  clearWalls: () => void;
  clearVisualization: () => void;
  clearAll: () => void;
  stepForward: (step: AlgorithmStep) => void;
  replayTo: (steps: AlgorithmStep[], targetIndex: number) => void;
  setGridSize: (rows: number, cols: number) => void;
  applyMazeStep: (step: AlgorithmStep) => void;
}

export const useGridStore = create<GridStore>((set, get) => {
  const defaultStart: [number, number] = [10, 4];
  const defaultEnd: [number, number] = [10, 27];
  const initBase = makeGrid(DEFAULT_ROWS, DEFAULT_COLS, defaultStart, defaultEnd);

  return {
    rows: DEFAULT_ROWS,
    cols: DEFAULT_COLS,
    start: defaultStart,
    end: defaultEnd,
    baseGrid: initBase,
    visualGrid: cloneGrid(initBase),

    initGrid: (rows = DEFAULT_ROWS, cols = DEFAULT_COLS) => {
      const { start, end } = get();
      const s: [number, number] = [Math.min(start[0], rows - 1), Math.min(start[1], cols - 1)];
      const e: [number, number] = [Math.min(end[0], rows - 1), Math.min(end[1], cols - 1)];
      const g = makeGrid(rows, cols, s, e);
      set({ rows, cols, start: s, end: e, baseGrid: g, visualGrid: cloneGrid(g) });
    },

    setWall: (r, c, isWall) => {
      set(state => {
        const { start, end } = state;
        if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) return {};
        const base = cloneGrid(state.baseGrid);
        const vis = cloneGrid(state.visualGrid);
        const newState: CellState = isWall ? 'wall' : 'unvisited';
        base[r]![c]!.state = newState;
        vis[r]![c]!.state = newState;
        if (!isWall) {
          base[r]![c]!.weight = 1;
          vis[r]![c]!.weight = 1;
        }
        return { baseGrid: base, visualGrid: vis };
      });
    },

    setWeight: (r, c, weight) => {
      set(state => {
        const { start, end } = state;
        if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) return {};
        const base = cloneGrid(state.baseGrid);
        const vis = cloneGrid(state.visualGrid);
        base[r]![c]!.state = weight > 1 ? 'weight' : 'unvisited';
        base[r]![c]!.weight = weight;
        vis[r]![c]!.state = weight > 1 ? 'weight' : 'unvisited';
        vis[r]![c]!.weight = weight;
        return { baseGrid: base, visualGrid: vis };
      });
    },

    setStart: (pos) => {
      set(state => {
        const [pr, pc] = pos;
        const cell = state.baseGrid[pr]?.[pc];
        if (!cell || cell.state === 'wall') return {};

        const base = cloneGrid(state.baseGrid);
        const vis = cloneGrid(state.visualGrid);
        const [or, oc] = state.start;
        base[or]![oc]!.state = 'unvisited';
        vis[or]![oc]!.state = 'unvisited';
        base[pr]![pc]!.state = 'start';
        vis[pr]![pc]!.state = 'start';
        return { start: pos, baseGrid: base, visualGrid: vis };
      });
    },

    setEnd: (pos) => {
      set(state => {
        const [pr, pc] = pos;
        const cell = state.baseGrid[pr]?.[pc];
        if (!cell || cell.state === 'wall') return {};

        const base = cloneGrid(state.baseGrid);
        const vis = cloneGrid(state.visualGrid);
        const [or, oc] = state.end;
        base[or]![oc]!.state = 'unvisited';
        vis[or]![oc]!.state = 'unvisited';
        base[pr]![pc]!.state = 'end';
        vis[pr]![pc]!.state = 'end';
        return { end: pos, baseGrid: base, visualGrid: vis };
      });
    },

    clearWalls: () => {
      set(state => {
        const base = cloneGrid(state.baseGrid);
        const { start, end } = state;
        for (const row of base) {
          for (const cell of row) {
            if (cell.state === 'wall' || cell.state === 'weight') {
              cell.state = 'unvisited';
              cell.weight = 1;
            }
          }
        }
        base[start[0]]![start[1]]!.state = 'start';
        base[end[0]]![end[1]]!.state = 'end';
        return { baseGrid: base, visualGrid: cloneGrid(base) };
      });
    },

    clearVisualization: () => {
      set(state => {
        const vis = cloneGrid(state.baseGrid);
        return { visualGrid: vis };
      });
    },

    clearAll: () => {
      set(state => {
        const g = makeGrid(state.rows, state.cols, state.start, state.end);
        return { baseGrid: g, visualGrid: cloneGrid(g) };
      });
    },

    stepForward: (step) => {
      set(state => ({ visualGrid: applyStep(state.visualGrid, step) }));
    },

    replayTo: (steps, targetIndex) => {
      set(state => {
        let grid = cloneGrid(state.baseGrid);
        for (let i = 0; i <= targetIndex && i < steps.length; i++) {
          grid = applyStep(grid, steps[i]!);
        }
        return { visualGrid: grid };
      });
    },

    applyMazeStep: (step) => {
      set(state => {
        const base = applyStep(state.baseGrid, step);
        const vis = applyStep(state.visualGrid, step);
        return { baseGrid: base, visualGrid: vis };
      });
    },

    setGridSize: (rows, cols) => {
      const { start, end } = get();
      const s: [number, number] = [Math.min(start[0], rows - 1), Math.min(start[1], Math.max(4, Math.floor(cols * 0.15)))];
      const e: [number, number] = [Math.min(end[0], rows - 1), Math.min(cols - 1, Math.max(cols - 5, Math.floor(cols * 0.85)))];
      const g = makeGrid(rows, cols, s, e);
      set({ rows, cols, start: s, end: e, baseGrid: g, visualGrid: cloneGrid(g) });
    },
  };
});

export type { GridState };
