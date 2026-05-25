import type { AlgorithmStep, GridState } from './types';

const DIRS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function* bidirectionalBfs(
  grid: GridState,
  start: [number, number],
  end: [number, number],
): Generator<AlgorithmStep> {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const fQueue: [number, number][] = [start];
  const bQueue: [number, number][] = [end];

  const fVisited = new Set<string>([`${start[0]},${start[1]}`]);
  const bVisited = new Set<string>([`${end[0]},${end[1]}`]);

  const fParent = new Map<string, [number, number] | null>();
  const bParent = new Map<string, [number, number] | null>();
  fParent.set(`${start[0]},${start[1]}`, null);
  bParent.set(`${end[0]},${end[1]}`, null);

  yield {
    type: 'enqueue',
    cell: start,
    visitedCount: 0,
    message: 'Initialize forward frontier from start',
    pseudocodeLine: 0,
  };

  let meetingPoint: [number, number] | null = null;

  while (fQueue.length > 0 || bQueue.length > 0) {
    if (fQueue.length > 0) {
      const curr = fQueue.shift()!;
      const [r, c] = curr;
      const key = `${r},${c}`;

      yield {
        type: 'dequeue',
        cell: curr,
        visitedCount: fVisited.size + bVisited.size,
        message: `Forward: dequeue (${r},${c})`,
        pseudocodeLine: 3,
      };

      yield {
        type: 'visit',
        cell: curr,
        visitedCount: fVisited.size + bVisited.size,
        message: `Forward: visit (${r},${c})`,
        pseudocodeLine: 4,
      };

      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const cell = grid[nr]?.[nc];
        if (!cell || cell.state === 'wall') continue;
        const nkey = `${nr},${nc}`;
        if (fVisited.has(nkey)) continue;

        fVisited.add(nkey);
        fParent.set(nkey, curr);
        fQueue.push([nr, nc]);

        yield {
          type: 'enqueue',
          cell: [nr, nc],
          from: curr,
          visitedCount: fVisited.size + bVisited.size,
          message: `Forward: enqueue (${nr},${nc})`,
          pseudocodeLine: 7,
        };

        if (bVisited.has(nkey)) {
          meetingPoint = [nr, nc];
          break;
        }
      }

      if (meetingPoint) break;

      if (bVisited.has(key)) {
        meetingPoint = curr;
        break;
      }
    }

    if (meetingPoint) break;

    if (bQueue.length > 0) {
      const curr = bQueue.shift()!;
      const [r, c] = curr;
      const key = `${r},${c}`;

      yield {
        type: 'dequeue',
        cell: curr,
        visitedCount: fVisited.size + bVisited.size,
        message: `Backward: dequeue (${r},${c})`,
        pseudocodeLine: 3,
      };

      yield {
        type: 'visit',
        cell: curr,
        visitedCount: fVisited.size + bVisited.size,
        message: `Backward: visit (${r},${c})`,
        pseudocodeLine: 4,
      };

      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const cell = grid[nr]?.[nc];
        if (!cell || cell.state === 'wall') continue;
        const nkey = `${nr},${nc}`;
        if (bVisited.has(nkey)) continue;

        bVisited.add(nkey);
        bParent.set(nkey, curr);
        bQueue.push([nr, nc]);

        yield {
          type: 'enqueue',
          cell: [nr, nc],
          from: curr,
          visitedCount: fVisited.size + bVisited.size,
          message: `Backward: enqueue (${nr},${nc})`,
          pseudocodeLine: 7,
        };

        if (fVisited.has(nkey)) {
          meetingPoint = [nr, nc];
          break;
        }
      }

      if (meetingPoint) break;

      if (fVisited.has(key)) {
        meetingPoint = curr;
        break;
      }
    }
  }

  if (meetingPoint) {
    const fPath: [number, number][] = [];
    let cur: [number, number] | null = meetingPoint;
    while (cur !== null) {
      fPath.unshift(cur);
      cur = fParent.get(`${cur[0]},${cur[1]}`) ?? null;
    }

    const bPath: [number, number][] = [];
    let bcur: [number, number] | null = fParent.has(`${meetingPoint[0]},${meetingPoint[1]}`)
      ? (bParent.get(`${meetingPoint[0]},${meetingPoint[1]}`) ?? null)
      : meetingPoint;
    while (bcur !== null) {
      bPath.push(bcur);
      bcur = bParent.get(`${bcur[0]},${bcur[1]}`) ?? null;
    }

    const fullPath = [...fPath, ...bPath];
    for (const cell of fullPath) {
      yield { type: 'path', cell, visitedCount: fVisited.size + bVisited.size, message: 'Path cell' };
    }
    yield { type: 'done', cell: end, visitedCount: fVisited.size + bVisited.size, message: 'Frontiers met!' };
  } else {
    yield { type: 'no-path', cell: start, visitedCount: fVisited.size + bVisited.size, message: 'No path found' };
  }
}
