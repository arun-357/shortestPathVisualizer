import React from 'react';
const Controls = ({ findPath, obstacleMode, setObstacleMode, resetGrid }) => {
  return (
    <div className='flex flex-wrap gap-4'>
      <button
        onClick={() => setObstacleMode(!obstacleMode)}
        className={`px-4 py-2 rounded text-white ${
          obstacleMode ? 'bg-blue-600' : 'bg-blue-500'
        } hover:bg-blue-700`}
      >
        {obstacleMode ? 'Obstacle: ON' : 'Obstacle: OFF'}
      </button>
      <button
        onClick={() => findPath('bfs')}
        className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
      >
        Run BFS
      </button>
      <button
        onClick={() => findPath('dijkstra')}
        className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
      >
        Run Dijkstra
      </button>
      <button
        onClick={resetGrid}
        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Reset
      </button>
    </div>
  );
};

export default Controls;
