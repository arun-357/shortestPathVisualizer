export const bfs = (grid, start, end) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const queue = [[...start, []]];
  const visited = new Set();

  while (queue.length > 0) {
    const [r, c, path] = queue.shift();

    if (r === end[0] && c === end[1]) {
      return path;
    }

    for (const [dr, dc] of directions) {
      const newRow = r + dr;
      const newCol = c + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] !== -1 &&
        !visited.has(`${newRow}-${newCol}`)
      ) {
        visited.add(`${newRow}-${newCol}`);
        queue.push([newRow, newCol, [...path, [newRow, newCol]]]);
      }
    }
  }
  return [];
};

export const dijkstra = (grid, start, end) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const distances = Array(rows)
    .fill()
    .map(() => Array(cols).fill(Infinity));

  const priorityQueue = [[...start, 0, []]];
  distances[start[0]][start[1]] = 0;

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a[2] - b[2]);
    const [r, c, cost, path] = priorityQueue.shift();

    if (r === end[0] && c === end[1]) {
      return path;
    }

    for (const [dr, dc] of directions) {
      const newRow = r + dr;
      const newCol = c + dc;
      const newCost = cost + 1;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] !== -1 &&
        newCost < distances[newRow][newCol]
      ) {
        distances[newRow][newCol] = newCost;
        priorityQueue.push([newRow, newCol, newCost, [...path, [newRow, newCol]]]);
      }
    }
  }
  return [];
};
