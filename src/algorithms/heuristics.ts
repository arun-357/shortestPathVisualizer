import type { HeuristicFn, HeuristicId } from './types';

export const manhattan: HeuristicFn = ([r1, c1], [r2, c2]) =>
  Math.abs(r1 - r2) + Math.abs(c1 - c2);

export const euclidean: HeuristicFn = ([r1, c1], [r2, c2]) =>
  Math.sqrt((r1 - r2) ** 2 + (c1 - c2) ** 2);

export const chebyshev: HeuristicFn = ([r1, c1], [r2, c2]) =>
  Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));

export const heuristics: Record<HeuristicId, HeuristicFn> = {
  manhattan,
  euclidean,
  chebyshev,
};
