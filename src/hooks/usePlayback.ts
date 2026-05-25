import { useCallback, useEffect, useRef } from 'react';
import { bfs } from '../algorithms/bfs';
import { bidirectionalBfs } from '../algorithms/bidirectionalBfs';
import { dfs } from '../algorithms/dfs';
import { dijkstra } from '../algorithms/dijkstra';
import { greedyBestFirst } from '../algorithms/greedyBestFirst';
import { aStar } from '../algorithms/aStar';
import { heuristics } from '../algorithms/heuristics';
import type { AlgorithmId, AlgorithmStep } from '../algorithms/types';
import { ALGORITHM_REGISTRY } from '../constants/algorithms';
import { useAlgorithmStore } from '../store/algorithmStore';
import { applyStep, useGridStore } from '../store/gridStore';
import { useUIStore } from '../store/uiStore';

function runGenerator(
  algoId: AlgorithmId,
  grid: ReturnType<typeof useGridStore.getState>['baseGrid'],
  start: [number, number],
  end: [number, number],
  heuristicId: ReturnType<typeof useAlgorithmStore.getState>['heuristic'],
): AlgorithmStep[] {
  const h = heuristics[heuristicId];
  const steps: AlgorithmStep[] = [];
  let gen: Generator<AlgorithmStep>;

  switch (algoId) {
    case 'bfs':      gen = bfs(grid, start, end); break;
    case 'dfs':      gen = dfs(grid, start, end); break;
    case 'dijkstra': gen = dijkstra(grid, start, end); break;
    case 'astar':    gen = aStar(grid, start, end, { heuristic: h }); break;
    case 'greedy':   gen = greedyBestFirst(grid, start, end, { heuristic: h }); break;
    case 'bidirBfs': gen = bidirectionalBfs(grid, start, end); break;
    default:         gen = bfs(grid, start, end);
  }

  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

export function usePlayback() {
  const intervalRef = useRef<number | null>(null);
  const algoStore = useAlgorithmStore();
  const gridStore = useGridStore();
  const setShowStats = useUIStore(s => s.setShowStatsDrawer);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const finishRun = useCallback((steps: AlgorithmStep[]) => {
    const lastStep = steps[steps.length - 1];
    const isNoPath = lastStep?.type === 'no-path';
    const pathSteps = steps.filter(s => s.type === 'path');
    const visitedSteps = steps.filter(s => s.type === 'visit' || s.type === 'dequeue');

    algoStore.stopTimer();
    algoStore.setStatus(isNoPath ? 'no-path' : 'done');
    algoStore.setPathLength(pathSteps.length);
    algoStore.setVisitedCount(visitedSteps.length);

    const wallTime = Date.now() - algoStore.runStartTime;
    algoStore.addMetrics({
      id: Date.now(),
      algo: algoStore.selectedAlgo,
      visited: visitedSteps.length,
      pathLength: pathSteps.length,
      pathCost: pathSteps.reduce((sum, s) => {
        const cell = gridStore.baseGrid[s.cell[0]]?.[s.cell[1]];
        return sum + (cell?.weight ?? 1);
      }, 0),
      stepCount: steps.length,
      wallTime,
      optimal: ALGORITHM_REGISTRY[algoStore.selectedAlgo].optimal,
      timestamp: Date.now(),
    });

    if (!isNoPath) setShowStats(true);
  }, [algoStore, gridStore, setShowStats]);

  const run = useCallback(() => {
    clearInterval_();
    gridStore.clearVisualization();
    algoStore.reset();
    algoStore.startTimer();

    const steps = runGenerator(
      algoStore.selectedAlgo,
      gridStore.baseGrid,
      gridStore.start,
      gridStore.end,
      algoStore.heuristic,
    );
    algoStore.setSteps(steps);
    algoStore.setStatus('running');

    let idx = 0;
    gridStore.clearVisualization();

    intervalRef.current = setInterval(() => {
      if (idx >= steps.length) {
        clearInterval_();
        algoStore.setStepIndex(idx - 1);
        finishRun(steps);
        return;
      }
      const step = steps[idx];
      if (step) gridStore.stepForward(step);
      algoStore.setStepIndex(idx);

      // Update live counters
      if (step?.visitedCount !== undefined) algoStore.setVisitedCount(step.visitedCount);
      if (step?.type === 'path') algoStore.setPathLength(algoStore.pathLength + 1);

      idx++;
    }, algoStore.speed) as unknown as number;
  }, [algoStore, gridStore, clearInterval_, finishRun]);

  const pause = useCallback(() => {
    clearInterval_();
    algoStore.setStatus('paused');
  }, [algoStore, clearInterval_]);

  const resume = useCallback(() => {
    if (algoStore.status !== 'paused') return;
    algoStore.setStatus('running');

    let idx = algoStore.stepIndex + 1;
    const { steps } = algoStore;

    intervalRef.current = setInterval(() => {
      if (idx >= steps.length) {
        clearInterval_();
        algoStore.setStepIndex(idx - 1);
        finishRun(steps);
        return;
      }
      const step = steps[idx];
      if (step) gridStore.stepForward(step);
      algoStore.setStepIndex(idx);
      if (step?.visitedCount !== undefined) algoStore.setVisitedCount(step.visitedCount);
      idx++;
    }, algoStore.speed) as unknown as number;
  }, [algoStore, gridStore, clearInterval_, finishRun]);

  const stepForward = useCallback(() => {
    if (algoStore.status === 'running') return;
    const { steps, stepIndex } = algoStore;
    const nextIdx = stepIndex + 1;
    if (nextIdx >= steps.length) return;
    const step = steps[nextIdx];
    if (step) gridStore.stepForward(step);
    algoStore.setStepIndex(nextIdx);
    if (step?.visitedCount !== undefined) algoStore.setVisitedCount(step.visitedCount);
    if (nextIdx === steps.length - 1) finishRun(steps);
  }, [algoStore, gridStore, finishRun]);

  const stepBack = useCallback(() => {
    if (algoStore.status === 'running') return;
    const { steps, stepIndex } = algoStore;
    if (stepIndex <= 0) {
      gridStore.clearVisualization();
      algoStore.setStepIndex(-1);
      return;
    }
    const prevIdx = stepIndex - 1;
    gridStore.replayTo(steps, prevIdx);
    algoStore.setStepIndex(prevIdx);
    algoStore.setStatus('paused');
    useUIStore.getState().setShowStatsDrawer(false);
  }, [algoStore, gridStore]);

  const scrubTo = useCallback((idx: number) => {
    clearInterval_();
    algoStore.setStatus('paused');
    const { steps } = algoStore;
    const clamped = Math.max(-1, Math.min(idx, steps.length - 1));
    if (clamped < 0) {
      gridStore.clearVisualization();
    } else {
      gridStore.replayTo(steps, clamped);
    }
    algoStore.setStepIndex(clamped);
  }, [algoStore, gridStore, clearInterval_]);

  const reset = useCallback(() => {
    clearInterval_();
    algoStore.reset();
    gridStore.clearVisualization();
    useUIStore.getState().setShowStatsDrawer(false);
  }, [algoStore, gridStore, clearInterval_]);

  // Cleanup on unmount
  useEffect(() => () => clearInterval_(), [clearInterval_]);

  return { run, pause, resume, stepForward, stepBack, scrubTo, reset };
}

