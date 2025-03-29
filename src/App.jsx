import { Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Controls from './components/Controls';
import Grid from './components/Grid';
import AlgorithmInfo from './components/Information';
import Visualization from './components/Visualization';
import { ShootingStars } from './components/ui/shooting-stars';
import { StarsBackground } from './components/ui/stars-background';
import { bfs, dijkstra } from './utils/pathFindingAlgorithms';

const App = () => {
  const getInitialDimensions = () => {
    const width = window.innerWidth;
    if (width < 640) return { rows: 8, cols: 12 };
    if (width < 1024) return { rows: 9, cols: 18 };
    return { rows: 15, cols: 30 };
  };

  const [dimensions, setDimensions] = useState(getInitialDimensions);
  const [grid, setGrid] = useState(() =>
    Array(dimensions.rows)
      .fill()
      .map(() => Array(dimensions.cols).fill(0))
  );
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [obstacleMode, setObstacleMode] = useState(false);
  const [path, setPath] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const newDimensions = getInitialDimensions();
      setDimensions(newDimensions);
      setGrid(
        Array(newDimensions.rows)
          .fill()
          .map(() => Array(newDimensions.cols).fill(0))
      );
      setStart(null);
      setEnd(null);
      setPath([]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(err => console.log('Audio play error:', err));
        setIsMusicPlaying(true);
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(err => console.log('Audio play error:', err));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isMusicPlaying]);

  const handleMouseDown = (r, c) => {
    setIsDragging(true);
    handleCellClick(r, c);
  };

  const handleMouseEnter = (r, c) => {
    if (isDragging) {
      handleCellClick(r, c, true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCellClick = (r, c, isDragging = false) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      if (!isDragging) {
        if (!start) {
          newGrid[r][c] = 2;
          setStart([r, c]);
        } else if (!end && (r !== start[0] || c !== start[1])) {
          newGrid[r][c] = 1;
          setEnd([r, c]);
        } else if (
          obstacleMode &&
          (r !== start?.[0] || c !== start?.[1]) &&
          (r !== end?.[0] || c !== end?.[1])
        ) {
          newGrid[r][c] = newGrid[r][c] === -1 ? 0 : -1;
        }
      } else {
        if (
          obstacleMode &&
          (r !== start?.[0] || c !== start?.[1]) &&
          (r !== end?.[0] || c !== end?.[1])
        ) {
          newGrid[r][c] = -1;
        }
      }
      return newGrid;
    });
  };

  const resetGrid = () => {
    setGrid(
      Array(dimensions.rows)
        .fill()
        .map(() => Array(dimensions.cols).fill(0))
    );
    setStart(null);
    setEnd(null);
    setPath([]);
    setObstacleMode(false);
  };

  const findPath = algorithm => {
    if (!start || !end) {
      alert('Please set both start and end points!');
      return;
    }

    const result = algorithm === 'bfs' ? bfs(grid, start, end) : dijkstra(grid, start, end);
    setPath(result);
  };

  const toggleMusic = () => {
    setIsMusicPlaying(prev => !prev);
  };

  return (
    <div className='min-h-screen bg-gray-900 flex flex-col items-center p-4 relative overflow-hidden'>
      <StarsBackground
        starDensity={0.0005}
        allStarsTwinkle={false}
        twinkleProbability={0.8}
        minTwinkleSpeed={1}
      />
      <ShootingStars starWidth={20} starHeight={2} />
      <audio ref={audioRef} src='/space.mp3' loop autoPlay />
      <button
        onClick={toggleMusic}
        className='fixed top-4 right-4 z-20 p-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 shadow-lg text-white hover:bg-gray-700/50 transition-all duration-300'
      >
        {isMusicPlaying ? <Volume2 className='w-6 h-6' /> : <VolumeX className='w-6 h-6' />}
      </button>
      <div className='relative z-10 w-full max-w-7xl'>
        <h1 className='text-3xl font-bold text-white mb-6 text-center'>Shortest Path Visualizer</h1>
        <div className='flex flex-col items-center gap-4'>
          <Grid
            grid={grid}
            handleCellClick={handleCellClick}
            handleMouseDown={handleMouseDown}
            handleMouseEnter={handleMouseEnter}
            handleMouseUp={handleMouseUp}
          />
          <Controls
            findPath={findPath}
            obstacleMode={obstacleMode}
            setObstacleMode={setObstacleMode}
            resetGrid={resetGrid}
          />
          <Visualization path={path} grid={grid} setGrid={setGrid} start={start} end={end} />
          <AlgorithmInfo />
        </div>
      </div>
    </div>
  );
};

export default App;
