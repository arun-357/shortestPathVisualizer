import type { AlgorithmStep, GridState } from './types';

const DIRS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function* bfs(
  grid: GridState,
  start: [number, number],
  end: [number, number],
): Generator<AlgorithmStep> {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const queue: [number, number][] = [start];
  const visited = new Set<string>([`${start[0]},${start[1]}`]);
  const parent = new Map<string, [number, number] | null>();
  parent.set(`${start[0]},${start[1]}`, null);

  yield {
    type: 'enqueue',
    cell: start,
    visitedCount: 0,
    message: 'Initialize: enqueue start',
    pseudocodeLine: 1,
    queueSnapshot: [start],
  };

  while (queue.length > 0) {
    const current = queue.shift()!;
    const [r, c] = current;
    const currentKey = `${r},${c}`;

    yield {
      type: 'dequeue',
      cell: current,
      visitedCount: visited.size,
      message: `Dequeue (${r}, ${c})`,
      pseudocodeLine: 5,
      queueSnapshot: [...queue],
    };

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end);
      for (const cell of path) {
        yield { type: 'path', cell, visitedCount: visited.size, message: 'Path cell', pseudocodeLine: 6 };
      }
      yield { type: 'done', cell: end, visitedCount: visited.size, message: 'Goal reached!' };
      return;
    }

    yield {
      type: 'visit',
      cell: current,
      visitedCount: visited.size,
      message: `Visit (${r}, ${c})`,
      pseudocodeLine: 7,
    };

    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const cell = grid[nr]?.[nc];
      if (!cell || cell.state === 'wall') continue;
      const key = `${nr},${nc}`;
      if (visited.has(key)) continue;

      visited.add(key);
      parent.set(key, current);
      queue.push([nr, nc]);

      yield {
        type: 'enqueue',
        cell: [nr, nc],
        from: current,
        visitedCount: visited.size,
        message: `Enqueue (${nr}, ${nc})`,
        pseudocodeLine: 10,
        queueSnapshot: [...queue],
      };
    }
    void currentKey;
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
    const key = `${cur[0]},${cur[1]}`;
    cur = parent.get(key) ?? null;
  }
  return path;
}
