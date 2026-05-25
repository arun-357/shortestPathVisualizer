import type { AlgorithmStep } from '../algorithms/types';

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

export function* recursiveBacktracking(
  rows: number,
  cols: number,
  start: [number, number],
  end: [number, number],
): Generator<AlgorithmStep> {
  // Fill everything with walls first
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r % 2 === 0 || c % 2 === 0) {
        yield { type: 'add-wall', cell: [r, c] };
      }
    }
  }

  // Carve passages via DFS
  const cellRows = Math.floor(rows / 2);
  const cellCols = Math.floor(cols / 2);
  const visited = new Set<string>();

  function* carve(cr: number, cc: number): Generator<AlgorithmStep> {
    const r = cr * 2 + 1;
    const c = cc * 2 + 1;
    visited.add(`${cr},${cc}`);
    yield { type: 'remove-wall', cell: [r, c] };

    const dirs = shuffle([[0, 1], [0, -1], [1, 0], [-1, 0]] as [number, number][]);
    for (const [dr, dc] of dirs) {
      const ncr = cr + dr;
      const ncc = cc + dc;
      if (ncr < 0 || ncr >= cellRows || ncc < 0 || ncc >= cellCols) continue;
      if (visited.has(`${ncr},${ncc}`)) continue;

      const wallR = r + dr;
      const wallC = c + dc;
      yield { type: 'remove-wall', cell: [wallR, wallC] };
      yield* carve(ncr, ncc);
    }
  }

  const startCR = Math.min(Math.floor(cellRows / 2), cellRows - 1);
  const startCC = Math.min(1, cellCols - 1);
  yield* carve(startCR, startCC);

  // Ensure start and end are open
  yield { type: 'remove-wall', cell: start };
  yield { type: 'remove-wall', cell: end };

  yield { type: 'done', cell: start };
}
