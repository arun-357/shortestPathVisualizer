import React from 'react';
import { useTheme } from 'styled-components';
import { ALGORITHM_REGISTRY } from '../../constants/algorithms';
import { useAlgorithmStore } from '../../store/algorithmStore';
import { useGridStore } from '../../store/gridStore';
import type { Theme } from '../../styles/theme';
import { Icons } from '../ui/Icons';
import { SectionLabel, Stat } from '../ui/Primitives';
import {
  AlgoStateRoot,
  FrontierTable,
  RelaxAccent,
  RelaxDim,
  RelaxEntry,
  RelaxLogWrapper,
  RelaxText,
  StatGrid,
  StatGridInner,
  StepMessage,
  StepMessagePrefix,
  TableEmpty,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowArrow,
  TableRowCell,
  TableRowLabel,
  TableWrapper,
} from './AlgorithmState.styled';

export const AlgorithmState: React.FC = () => {
  const t = useTheme() as Theme;
  const { selectedAlgo, stepIndex, steps } = useAlgorithmStore();
  const { visualGrid, rows, cols, end } = useGridStore();
  const meta = ALGORITHM_REGISTRY[selectedAlgo];
  const accent =
    meta.color === 'amber' ? t.amber :
    meta.color === 'pink'  ? t.pink  :
    t.accent;

  const frontierCells: Array<{ r: number; c: number; g: number; h: number; f: number }> = [];
  const visitedCells: Array<{ r: number; c: number; g: number }> = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = visualGrid[r]?.[c];
      if (!cell) continue;
      if (cell.state === 'frontier') {
        const h = Math.abs(r - end[0]) + Math.abs(c - end[1]);
        frontierCells.push({ r, c, g: cell.gScore === Infinity ? 0 : cell.gScore, h, f: cell.fScore === Infinity ? h : cell.fScore });
      } else if (cell.state === 'visited') {
        visitedCells.push({ r, c, g: cell.gScore });
      }
    }
  }

  frontierCells.sort((a, b) => a.f - b.f || a.g - b.g);
  visitedCells.sort((a, b) => b.g - a.g);

  const topFrontier = frontierCells.slice(0, 7);
  const lastVisited = visitedCells.slice(0, 4);

  const showScores = selectedAlgo === 'astar' || selectedAlgo === 'greedy';
  const showDist = selectedAlgo === 'dijkstra';
  const label = selectedAlgo === 'bfs' ? 'Queue (FIFO)' :
                selectedAlgo === 'dfs' ? 'Stack (LIFO)' :
                selectedAlgo === 'astar' || selectedAlgo === 'greedy' ? 'Open set' :
                'Priority queue';

  const currentStep = steps[stepIndex];

  return (
    <AlgoStateRoot>
      <SectionLabel right={`${frontierCells.length} open`}>
        <span>{Icons.layers}</span> {label}
      </SectionLabel>

      <TableWrapper>
        <FrontierTable>
          <TableHeader $showScores={showScores}>
            <TableHeaderCell>NODE</TableHeaderCell>
            {showScores ? (
              <>
                <TableHeaderCell $right>g</TableHeaderCell>
                <TableHeaderCell $right>h</TableHeaderCell>
                <TableHeaderCell $right>f</TableHeaderCell>
              </>
            ) : (
              <TableHeaderCell $right>{showDist ? 'dist' : 'depth'}</TableHeaderCell>
            )}
          </TableHeader>

          {topFrontier.length === 0 && <TableEmpty>— empty —</TableEmpty>}

          {topFrontier.map((e, i) => (
            <TableRow key={`${e.r},${e.c}`} $showScores={showScores} $isFirst={i === 0}>
              <TableRowLabel>
                {i === 0 && <TableRowArrow $accent={accent}>▸</TableRowArrow>}
                <span>({e.r.toString().padStart(2, '0')},{e.c.toString().padStart(2, '0')})</span>
              </TableRowLabel>
              {showScores ? (
                <>
                  <TableRowCell $right>{e.g === Infinity ? '∞' : Math.round(e.g)}</TableRowCell>
                  <TableRowCell $right $dimmed>{e.h}</TableRowCell>
                  <TableRowCell $right $accent={i === 0 ? accent : undefined} $bold>
                    {e.f === Infinity ? '∞' : e.f.toFixed(1)}
                  </TableRowCell>
                </>
              ) : (
                <TableRowCell $right $accent={i === 0 ? accent : undefined} $bold={i === 0}>
                  {e.g === Infinity ? '∞' : Math.round(e.g)}
                </TableRowCell>
              )}
            </TableRow>
          ))}
        </FrontierTable>
      </TableWrapper>

      {(showScores || showDist) && lastVisited.length > 0 && (
        <>
          <SectionLabel right={`last ${lastVisited.length}`}>
            <span>{Icons.spark}</span> Relaxation log
          </SectionLabel>
          <RelaxLogWrapper>
            {lastVisited.map((e, i) => {
              const g = Math.round(e.g);
              const w = 1 + (i % 3);
              const prev = Math.max(0, g - w);
              return (
                <RelaxEntry key={`${e.r},${e.c}`} $opacity={0.3 + i * 0.2}>
                  <span>
                    <RelaxDim>d[</RelaxDim>
                    <RelaxText>({e.r},{e.c})</RelaxText>
                    <RelaxDim>] ← </RelaxDim>
                    <RelaxText>{prev}</RelaxText>
                    <RelaxDim> + </RelaxDim>
                    <RelaxText>{w}</RelaxText>
                    <RelaxDim> = </RelaxDim>
                    <RelaxAccent $accent={accent}>{g}</RelaxAccent>
                  </span>
                </RelaxEntry>
              );
            })}
          </RelaxLogWrapper>
        </>
      )}

      <SectionLabel right={`${visitedCells.length} cells`}>
        <span>{Icons.dot}</span> Visited set
      </SectionLabel>
      <StatGrid>
        <StatGridInner>
          <Stat label="frontier" v={frontierCells.length} />
          <Stat label="visited" v={visitedCells.length} />
          <Stat label="total" v={frontierCells.length + visitedCells.length} accent={accent} />
          <Stat label="step" v={Math.max(0, stepIndex + 1)} />
        </StatGridInner>
      </StatGrid>

      {currentStep?.message && (
        <StepMessage>
          <StepMessagePrefix>STEP · </StepMessagePrefix>
          {currentStep.message}
        </StepMessage>
      )}
    </AlgoStateRoot>
  );
};
