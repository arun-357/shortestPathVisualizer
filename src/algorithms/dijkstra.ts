import type { AlgorithmStep, GridState } from './types';

const DIRS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function* dijkstra(
  grid: GridState,
  start: [number, number],
  end: [number, number],
): Generator<AlgorithmStep> {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const dist: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  dist[start[0]]![start[1]] = 0;

  const parent = new Map<string, [number, number] | null>();
  parent.set(`${start[0]},${start[1]}`, null);

  // [dist, row, col]
  const heap: [number, number, number][] = [[0, start[0], start[1]]];
  const settled = new Set<string>();

  yield {
    type: 'enqueue',
    cell: start,
    gScore: 0,
    visitedCount: 0,
    message: 'Initialize: d[start] = 0',
    pseudocodeLine: 2,
    queueSnapshot: [start],
  };

  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]);
    const top = heap.shift()!;
    const [d, r, c] = top;
    const key = `${r},${c}`;

    if (settled.has(key)) continue;
    settled.add(key);

    yield {
      type: 'dequeue',
      cell: [r, c],
      gScore: d,
      visitedCount: settled.size,
      message: `Pop min: (${r},${c}) d=${d}`,
      pseudocodeLine: 5,
      queueSnapshot: heap.map(([, hr, hc]) => [hr, hc] as [number, number]),
    };

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end);
      for (const cell of path) {
        yield { type: 'path', cell, visitedCount: settled.size, gScore: dist[cell[0]]?.[cell[1]], message: 'Path cell', pseudocodeLine: 6 };
      }
      yield { type: 'done', cell: end, visitedCount: settled.size, message: 'Goal reached!' };
      return;
    }

    yield {
      type: 'visit',
      cell: [r, c],
      gScore: d,
      visitedCount: settled.size,
      message: `Settle (${r},${c}) d=${d}`,
      pseudocodeLine: 7,
    };

    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const cell = grid[nr]?.[nc];
      if (!cell || cell.state === 'wall') continue;
      const nkey = `${nr},${nc}`;
      if (settled.has(nkey)) continue;

      const w = cell.weight > 1 ? cell.weight : 1;
      const alt = d + w;
      if (alt < (dist[nr]?.[nc] ?? Infinity)) {
        dist[nr]![nc] = alt;
        parent.set(nkey, [r, c]);
        heap.push([alt, nr, nc]);

        yield {
          type: 'relax',
          cell: [nr, nc],
          from: [r, c],
          gScore: alt,
          visitedCount: settled.size,
          message: `Relax (${nr},${nc}): d=${alt}`,
          pseudocodeLine: 10,
          queueSnapshot: heap.map(([, hr, hc]) => [hr, hc] as [number, number]),
        };
      }
    }
  }

  yield { type: 'no-path', cell: start, visitedCount: settled.size, message: 'No path found' };
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
