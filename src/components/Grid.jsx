import React from 'react';

const Grid = ({ grid, handleMouseDown, handleMouseEnter, handleMouseUp }) => {
  const cellSize = `min(2rem, calc(100vw / ${grid[0].length} - 0.5rem))`;

  return (
    <div className='grid gap-1 p-2 rounded-lg w-full bg-transparent shadow-lg'>
      {grid.map((row, r) => (
        <div key={r} className='flex gap-1 justify-center'>
          {row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
              onMouseUp={handleMouseUp}
              className={`border border-gray-500/20 cursor-pointer transition-all duration-300
              ${
                cell === 2
                  ? 'bg-green-500/70 shadow-[0_0_10px_#00ff00] hover:shadow-[0_0_15px_#00ff00]'
                  : cell === 1
                  ? 'bg-red-500/70 shadow-[0_0_10px_#ff0000] hover:shadow-[0_0_15px_#ff0000]'
                  : cell === -1
                  ? 'bg-gray-500/50 shadow-[0_0_5px_#ffffff] hover:shadow-[0_0_10px_#ffffff]'
                  : cell === 3
                  ? 'bg-purple-500/70 shadow-[0_0_10px_#800080] hover:shadow-[0_0_15px_#800080]'
                  : 'bg-transparent hover:bg-gray-700/20'
              } shadow-[0_0_5px_#ffffff40] hover:shadow-[0_0_8px_#ffffff80]`}
              style={{
                width: cellSize,
                height: cellSize,
                minWidth: '1rem',
                minHeight: '1rem',
                borderRadius: '4px',
              }}
            >
              {cell === 2 && (
                <img src='/start.png' alt='Start' className='w-8 h-8 sm:w-6 sm:h-6 xs:w-4 xs:h-4' />
              )}
              {cell === 1 && (
                <img src='/end.png' alt='End' className='w-8 h-8 sm:w-6 sm:h-6 xs:w-5 xs:h-5' />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
