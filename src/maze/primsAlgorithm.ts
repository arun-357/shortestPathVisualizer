import type { AlgorithmStep } from '../algorithms/types';

export function* primsAlgorithm(
  rows: number,
  cols: number,
  start: [number, number],
  end: [number, number],
): Generator<AlgorithmStep> {
  // Fill with walls
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      yield { type: 'add-wall', cell: [r, c] };
    }
  }

  const cellRows = Math.floor(rows / 2);
  const cellCols = Math.floor(cols / 2);
  const inMaze = new Set<string>();
  const frontier: [number, number, number, number][] = []; // [cellR, cellC, wallR, wallC]

  function addFrontier(cr: number, cc: number) {
    const dirs: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of dirs) {
      const ncr = cr + dr;
      const ncc = cc + dc;
      if (ncr < 0 || ncr >= cellRows || ncc < 0 || ncc >= cellCols) continue;
      if (!inMaze.has(`${ncr},${ncc}`)) {
        frontier.push([ncr, ncc, cr + dr, cc + dc]);
      }
    }
  }

  const startCR = Math.floor(cellRows / 2);
  const startCC = Math.floor(cellCols / 2);

  inMaze.add(`${startCR},${startCC}`);
  yield { type: 'remove-wall', cell: [startCR * 2 + 1, startCC * 2 + 1] };
  addFrontier(startCR, startCC);

  while (frontier.length > 0) {
    const idx = Math.floor(Math.random() * frontier.length);
    const entry = frontier.splice(idx, 1)[0]!;
    const [cr, cc] = entry;
    const key = `${cr},${cc}`;

    if (inMaze.has(key)) continue;

    // Find a neighbor that is in the maze
    const dirs: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const inMazeNeighbors = dirs
      .map(([dr, dc]) => [cr + dr, cc + dc] as [number, number])
      .filter(([nr, nc]) => nr >= 0 && nr < cellRows && nc >= 0 && nc < cellCols && inMaze.has(`${nr},${nc}`));

    if (inMazeNeighbors.length === 0) continue;

    const [nr, nc] = inMazeNeighbors[Math.floor(Math.random() * inMazeNeighbors.length)]!;

    inMaze.add(key);
    yield { type: 'remove-wall', cell: [cr * 2 + 1, cc * 2 + 1] };
    // Remove wall between cr,cc and nr,nc
    const wallR = cr + nr;
    const wallC = cc + nc;
    yield { type: 'remove-wall', cell: [wallR, wallC] };

    addFrontier(cr, cc);
  }

  yield { type: 'remove-wall', cell: start };
  yield { type: 'remove-wall', cell: end };
  yield { type: 'done', cell: start };
}
