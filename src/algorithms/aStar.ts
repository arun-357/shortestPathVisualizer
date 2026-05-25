import type { AlgorithmOptions, AlgorithmStep, GridState } from './types';
import { manhattan } from './heuristics';

const DIRS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function* aStar(
  grid: GridState,
  start: [number, number],
  end: [number, number],
  options?: AlgorithmOptions,
): Generator<AlgorithmStep> {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const h = options?.heuristic ?? manhattan;

  const gScore: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const fScore: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  gScore[start[0]]![start[1]] = 0;
  fScore[start[0]]![start[1]] = h(start, end);

  const parent = new Map<string, [number, number] | null>();
  parent.set(`${start[0]},${start[1]}`, null);

  // [f, g, row, col]
  const open: [number, number, number, number][] = [[fScore[start[0]]![start[1]]!, 0, start[0], start[1]]];
  const closed = new Set<string>();
  const inOpen = new Set<string>([`${start[0]},${start[1]}`]);

  yield {
    type: 'enqueue',
    cell: start,
    gScore: 0,
    hScore: h(start, end),
    fScore: fScore[start[0]]![start[1]],
    visitedCount: 0,
    message: 'Initialize: g[start]=0, f[start]=h(start)',
    pseudocodeLine: 0,
    queueSnapshot: [start],
  };

  while (open.length > 0) {
    open.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const top = open.shift()!;
    const [, , r, c] = top;
    const key = `${r},${c}`;
    inOpen.delete(key);

    if (closed.has(key)) continue;
    closed.add(key);

    const g = gScore[r]![c]!;
    const f = fScore[r]![c]!;

    yield {
      type: 'dequeue',
      cell: [r, c],
      gScore: g,
      hScore: h([r, c], end),
      fScore: f,
      visitedCount: closed.size,
      message: `Pop min-f: (${r},${c}) f=${f.toFixed(1)}`,
      pseudocodeLine: 5,
      queueSnapshot: open.map(([, , hr, hc]) => [hr, hc] as [number, number]),
    };

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end);
      for (const cell of path) {
        yield {
          type: 'path',
          cell,
          visitedCount: closed.size,
          gScore: gScore[cell[0]]?.[cell[1]],
          message: 'Path cell',
          pseudocodeLine: 6,
        };
      }
      yield { type: 'done', cell: end, visitedCount: closed.size, message: 'Goal reached!' };
      return;
    }

    yield {
      type: 'visit',
      cell: [r, c],
      gScore: g,
      fScore: f,
      visitedCount: closed.size,
      message: `Close (${r},${c}) f=${f.toFixed(1)}`,
      pseudocodeLine: 7,
    };

    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const cell = grid[nr]?.[nc];
      if (!cell || cell.state === 'wall') continue;
      const nkey = `${nr},${nc}`;
      if (closed.has(nkey)) continue;

      const w = cell.weight > 1 ? cell.weight : 1;
      const tentG = g + w;
      const oldG = gScore[nr]?.[nc] ?? Infinity;

      if (tentG < oldG) {
        gScore[nr]![nc] = tentG;
        const hVal = h([nr, nc], end);
        const fVal = tentG + hVal;
        fScore[nr]![nc] = fVal;
        parent.set(nkey, [r, c]);

        if (!inOpen.has(nkey)) {
          inOpen.add(nkey);
        }
        open.push([fVal, tentG, nr, nc]);

        yield {
          type: 'relax',
          cell: [nr, nc],
          from: [r, c],
          gScore: tentG,
          hScore: hVal,
          fScore: fVal,
          visitedCount: closed.size,
          message: `Update (${nr},${nc}): g=${tentG} h=${hVal.toFixed(1)} f=${fVal.toFixed(1)}`,
          pseudocodeLine: 13,
          queueSnapshot: open.map(([, , hr, hc]) => [hr, hc] as [number, number]),
        };
      }
    }
  }

  yield { type: 'no-path', cell: start, visitedCount: closed.size, message: 'No path found' };
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
