import { create } from 'zustand';
import type { AlgorithmId, AlgorithmStep, HeuristicId, PlaybackStatus, RunMetrics } from '../algorithms/types';

interface AlgorithmStore {
  selectedAlgo: AlgorithmId;
  heuristic: HeuristicId;
  status: PlaybackStatus;
  steps: AlgorithmStep[];
  stepIndex: number;
  speed: number;
  metricsHistory: RunMetrics[];
  pathLength: number;
  visitedCount: number;
  wallTime: number;
  runStartTime: number;
  // compare mode
  compareAlgoLeft: AlgorithmId;
  compareAlgoRight: AlgorithmId;
  compareStepsLeft: AlgorithmStep[];
  compareStepsRight: AlgorithmStep[];
  compareIndexLeft: number;
  compareIndexRight: number;
  compareStatusLeft: PlaybackStatus;
  compareStatusRight: PlaybackStatus;

  setAlgo: (id: AlgorithmId) => void;
  setHeuristic: (id: HeuristicId) => void;
  setStatus: (s: PlaybackStatus) => void;
  setSteps: (steps: AlgorithmStep[]) => void;
  setStepIndex: (idx: number) => void;
  setSpeed: (ms: number) => void;
  setPathLength: (n: number) => void;
  setVisitedCount: (n: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  addMetrics: (m: RunMetrics) => void;
  reset: () => void;
  setCompareAlgoLeft: (id: AlgorithmId) => void;
  setCompareAlgoRight: (id: AlgorithmId) => void;
  setCompareSteps: (left: AlgorithmStep[], right: AlgorithmStep[]) => void;
  setCompareIndex: (left: number, right: number) => void;
  setCompareStatus: (left: PlaybackStatus, right: PlaybackStatus) => void;
}

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
  selectedAlgo: 'astar',
  heuristic: 'manhattan',
  status: 'idle',
  steps: [],
  stepIndex: -1,
  speed: 50,
  metricsHistory: [],
  pathLength: 0,
  visitedCount: 0,
  wallTime: 0,
  runStartTime: 0,
  compareAlgoLeft: 'astar',
  compareAlgoRight: 'dijkstra',
  compareStepsLeft: [],
  compareStepsRight: [],
  compareIndexLeft: -1,
  compareIndexRight: -1,
  compareStatusLeft: 'idle',
  compareStatusRight: 'idle',

  setAlgo: (id) => set({ selectedAlgo: id }),
  setHeuristic: (id) => set({ heuristic: id }),
  setStatus: (s) => set({ status: s }),
  setSteps: (steps) => set({ steps }),
  setStepIndex: (idx) => set({ stepIndex: idx }),
  setSpeed: (ms) => set({ speed: ms }),
  setPathLength: (n) => set({ pathLength: n }),
  setVisitedCount: (n) => set({ visitedCount: n }),
  startTimer: () => set({ runStartTime: Date.now(), wallTime: 0 }),
  stopTimer: () => set({ wallTime: Date.now() - get().runStartTime }),

  addMetrics: (m) =>
    set(state => ({
      metricsHistory: [...state.metricsHistory.slice(-9), m],
    })),

  reset: () =>
    set({
      status: 'idle',
      steps: [],
      stepIndex: -1,
      pathLength: 0,
      visitedCount: 0,
      wallTime: 0,
      runStartTime: 0,
    }),

  setCompareAlgoLeft: (id) => set({ compareAlgoLeft: id }),
  setCompareAlgoRight: (id) => set({ compareAlgoRight: id }),
  setCompareSteps: (left, right) =>
    set({ compareStepsLeft: left, compareStepsRight: right, compareIndexLeft: -1, compareIndexRight: -1 }),
  setCompareIndex: (left, right) =>
    set({ compareIndexLeft: left, compareIndexRight: right }),
  setCompareStatus: (left, right) =>
    set({ compareStatusLeft: left, compareStatusRight: right }),
}));
