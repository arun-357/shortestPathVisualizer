import React, { useCallback, useRef } from 'react';
import { useAlgorithmStore } from '../../store/algorithmStore';
import { useGridStore } from '../../store/gridStore';
import { useUIStore } from '../../store/uiStore';
import { Icons } from '../ui/Icons';
import { SectionLabel } from '../ui/Primitives';
import { recursiveBacktracking } from '../../maze/recursiveBacktracking';
import { primsAlgorithm } from '../../maze/primsAlgorithm';
import { recursiveDivision } from '../../maze/recursiveDivision';
import type { MazeAlgoId } from '../../algorithms/types';
import {
  ClearMazeBtn,
  GenerateMazeBtn,
  PillEl,
  PillGroup,
  PopoverBody,
  PopoverCloseBtn,
  PopoverHeader,
  PopoverHeaderLabel,
  PopoverRoot,
  WeightHeader,
  WeightHint,
  WeightSection,
  WeightSlider,
  WeightValue,
} from './GridControls.styled';

export const GridControls: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { mazeAlgo, setMazeAlgo, brushWeight, setBrushWeight } = useUIStore();
  const gridStore = useGridStore();
  const algoStore = useAlgorithmStore();
  const isGenerating = useRef(false);

  const generateMaze = useCallback(async () => {
    if (isGenerating.current) return;
    isGenerating.current = true;

    gridStore.clearAll();
    algoStore.reset();

    const { rows, cols, start, end } = gridStore;
    let gen: Generator<import('../../algorithms/types').AlgorithmStep>;

    if (mazeAlgo === 'backtracking') gen = recursiveBacktracking(rows, cols, start, end);
    else if (mazeAlgo === 'prims') gen = primsAlgorithm(rows, cols, start, end);
    else if (mazeAlgo === 'division') gen = recursiveDivision(rows, cols, start, end);
    else {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) continue;
          if (Math.random() < 0.32) gridStore.setWall(r, c, true);
        }
      }
      isGenerating.current = false;
      return;
    }

    const steps: import('../../algorithms/types').AlgorithmStep[] = [];
    let result = gen.next();
    while (!result.done) {
      steps.push(result.value);
      result = gen.next();
    }

    for (const step of steps) {
      gridStore.applyMazeStep(step);
      await new Promise(r => setTimeout(r, 4));
    }

    isGenerating.current = false;
  }, [mazeAlgo, gridStore, algoStore]);

  const mazeOptions: { id: MazeAlgoId; label: string }[] = [
    { id: 'backtracking', label: 'Backtracking' },
    { id: 'prims', label: "Prim's" },
    { id: 'division', label: 'Division' },
    { id: 'random', label: 'Random' },
  ];

  return (
    <PopoverRoot>
      <PopoverHeader>
        <PopoverHeaderLabel>Maze generation</PopoverHeaderLabel>
        <PopoverCloseBtn onClick={onClose}>{Icons.x}</PopoverCloseBtn>
      </PopoverHeader>

      <PopoverBody>
        <PillGroup>
          {mazeOptions.map(o => (
            <PillEl key={o.id} $active={mazeAlgo === o.id} onClick={() => setMazeAlgo(o.id)}>
              {o.label}
            </PillEl>
          ))}
        </PillGroup>

        <GenerateMazeBtn onClick={generateMaze}>Generate Maze</GenerateMazeBtn>
        <ClearMazeBtn onClick={() => { gridStore.clearWalls(); algoStore.reset(); }}>
          Clear Maze
        </ClearMazeBtn>

        <WeightSection>
          <WeightHeader>
            <span>Weight brush</span>
            <WeightValue>{brushWeight}</WeightValue>
          </WeightHeader>
          <WeightSlider
            type="range" min={2} max={9} value={brushWeight}
            onChange={e => setBrushWeight(Number(e.target.value))}
          />
          <WeightHint>Right-click or Shift+drag to paint weights</WeightHint>
        </WeightSection>
      </PopoverBody>
    </PopoverRoot>
  );
};
