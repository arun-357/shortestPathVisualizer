import type { AlgorithmOptions, AlgorithmStep, GridState } from './types';
import { manhattan } from './heuristics';

const DIRS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function* greedyBestFirst(
  grid: GridState,
  start: [number, number],
  end: [number, number],
  options?: AlgorithmOptions,
): Generator<AlgorithmStep> {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const h = options?.heuristic ?? manhattan;

  const parent = new Map<string, [number, number] | null>();
  parent.set(`${start[0]},${start[1]}`, null);

  const open: [number, number, number][] = [[h(start, end), start[0], start[1]]];
  const visited = new Set<string>([`${start[0]},${start[1]}`]);

  yield {
    type: 'enqueue',
    cell: start,
    hScore: h(start, end),
    fScore: h(start, end),
    visitedCount: 0,
    message: 'Initialize: enqueue start by h(start)',
    pseudocodeLine: 0,
    queueSnapshot: [start],
  };

  while (open.length > 0) {
    open.sort((a, b) => a[0] - b[0]);
    const top = open.shift()!;
    const [hVal, r, c] = top;
    const key = `${r},${c}`;

    yield {
      type: 'dequeue',
      cell: [r, c],
      hScore: hVal,
      visitedCount: visited.size,
      message: `Pop min-h: (${r},${c}) h=${hVal.toFixed(1)}`,
      pseudocodeLine: 3,
      queueSnapshot: open.map(([, hr, hc]) => [hr, hc] as [number, number]),
    };

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end);
      for (const cell of path) {
        yield { type: 'path', cell, visitedCount: visited.size, message: 'Path cell', pseudocodeLine: 4 };
      }
      yield { type: 'done', cell: end, visitedCount: visited.size, message: 'Goal reached! (may not be optimal)' };
      return;
    }

    yield {
      type: 'visit',
      cell: [r, c],
      hScore: hVal,
      visitedCount: visited.size,
      message: `Visit (${r},${c})`,
      pseudocodeLine: 5,
    };

    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const cell = grid[nr]?.[nc];
      if (!cell || cell.state === 'wall') continue;
      const nkey = `${nr},${nc}`;
      if (visited.has(nkey)) continue;

      visited.add(nkey);
      parent.set(nkey, [r, c]);
      const nh = h([nr, nc], end);
      open.push([nh, nr, nc]);

      yield {
        type: 'relax',
        cell: [nr, nc],
        from: [r, c],
        hScore: nh,
        visitedCount: visited.size,
        message: `Enqueue (${nr},${nc}) h=${nh.toFixed(1)}`,
        pseudocodeLine: 8,
        queueSnapshot: open.map(([, hr, hc]) => [hr, hc] as [number, number]),
      };
    }
  }

  yield { type: 'no-path', cell: start, visitedCount: visited.size, message: 'No path found' };
}

function reconstructPath(
  parent: Map<string, [number, number] | null>,
  end: [number, number],
): [number, number][] {
  const path: [number, number][] = [];
  let cur: [number, number] | null = end;
  while (cur !== null) {
    path.unshift(cur);
    cur = parent.get(`${cur[0]},${cur[1]}`) ?? null;
  }
  return path;
}
