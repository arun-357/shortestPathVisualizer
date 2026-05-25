import type { AlgorithmStep } from '../algorithms/types';

export function* recursiveDivision(
  rows: number,
  cols: number,
  start: [number, number],
  end: [number, number],
): Generator<AlgorithmStep> {
  // Start with open grid, then add walls by division
  function* divide(
    r1: number, c1: number, r2: number, c2: number,
  ): Generator<AlgorithmStep> {
    const height = r2 - r1;
    const width = c2 - c1;
    if (height < 2 || width < 2) return;

    const horizontal = height > width ? true : width > height ? false : Math.random() < 0.5;

    if (horizontal) {
      // Draw a horizontal wall with one passage
      const wallRow = r1 + 1 + Math.floor(Math.random() * (height - 1));
      const passageCol = c1 + Math.floor(Math.random() * width);
      for (let c = c1; c <= c2; c++) {
        if (c !== passageCol) {
          yield { type: 'add-wall', cell: [wallRow, c] };
        }
      }
      yield* divide(r1, c1, wallRow - 1, c2);
      yield* divide(wallRow + 1, c1, r2, c2);
    } else {
      // Draw a vertical wall with one passage
      const wallCol = c1 + 1 + Math.floor(Math.random() * (width - 1));
      const passageRow = r1 + Math.floor(Math.random() * height);
      for (let r = r1; r <= r2; r++) {
        if (r !== passageRow) {
          yield { type: 'add-wall', cell: [r, wallCol] };
        }
      }
      yield* divide(r1, c1, r2, wallCol - 1);
      yield* divide(r1, wallCol + 1, r2, c2);
    }
  }

  // Add border walls
  for (let c = 0; c < cols; c++) {
    yield { type: 'add-wall', cell: [0, c] };
    yield { type: 'add-wall', cell: [rows - 1, c] };
  }
  for (let r = 0; r < rows; r++) {
    yield { type: 'add-wall', cell: [r, 0] };
    yield { type: 'add-wall', cell: [r, cols - 1] };
  }

  yield* divide(1, 1, rows - 2, cols - 2);

  // Ensure start/end are clear
  yield { type: 'remove-wall', cell: start };
  yield { type: 'remove-wall', cell: end };
  yield { type: 'done', cell: start };
}
