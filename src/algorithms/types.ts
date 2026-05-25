export type CellState =
  | 'unvisited'
  | 'visited'
  | 'frontier'
  | 'path'
  | 'current'
  | 'wall'
  | 'weight'
  | 'start'
  | 'end';

export interface CellData {
  row: number;
  col: number;
  state: CellState;
  weight: number;
  gScore: number;
  hScore: number;
  fScore: number;
  parent: [number, number] | null;
}

export type AlgorithmStepType =
  | 'visit'
  | 'enqueue'
  | 'dequeue'
  | 'relax'
  | 'path'
  | 'done'
  | 'no-path'
  | 'add-wall'
  | 'remove-wall';

export interface AlgorithmStep {
  type: AlgorithmStepType;
  cell: [number, number];
  from?: [number, number];
  gScore?: number;
  fScore?: number;
  hScore?: number;
  queueSnapshot?: [number, number][];
  visitedCount?: number;
  message?: string;
  pseudocodeLine?: number;
}

export type GridState = CellData[][];

export type HeuristicFn = (a: [number, number], b: [number, number]) => number;

export interface AlgorithmOptions {
  heuristic?: HeuristicFn;
}

export type AlgorithmGenerator = (
  grid: GridState,
  start: [number, number],
  end: [number, number],
  options?: AlgorithmOptions
) => Generator<AlgorithmStep>;

export type AlgorithmId =
  | 'bfs'
  | 'dfs'
  | 'bidirBfs'
  | 'dijkstra'
  | 'astar'
  | 'greedy'
  | 'jps';

export type HeuristicId = 'manhattan' | 'euclidean' | 'chebyshev';

export type PlaybackStatus = 'idle' | 'running' | 'paused' | 'done' | 'no-path';

export interface PaperRef {
  title: string;
  authors: string;
  year: number;
  url: string;
  venue?: string;
}

export interface AlgorithmMeta {
  id: AlgorithmId;
  name: string;
  short: string;
  family: string;
  complexity: { time: string; space: string };
  optimal: boolean;
  complete: boolean;
  weighted: boolean;
  color: 'amber' | 'accent' | 'pink' | 'green';
  blurb: string;
  pseudocode: string[];
  stepToLine: Partial<Record<AlgorithmStepType, number>>;
  papers: PaperRef[];
  proofSketch: string;
  watchFor: string[];
}

export interface RunMetrics {
  id: number;
  algo: AlgorithmId;
  visited: number;
  pathLength: number;
  pathCost: number;
  stepCount: number;
  wallTime: number;
  optimal: boolean;
  timestamp: number;
}

export type MazeAlgoId = 'backtracking' | 'prims' | 'division' | 'random';
