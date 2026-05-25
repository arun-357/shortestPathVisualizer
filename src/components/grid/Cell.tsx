import React, { memo } from 'react';
import { useTheme } from 'styled-components';
import type { CellData } from '../../algorithms/types';
import type { Theme } from '../../styles/theme';
import { CellDiv, CellLabel, CellWeightLabel, CellGScoreLabel } from './Cell.styled';

interface CellProps {
  cell: CellData;
  cellSize: number;
  showHeatmap?: boolean;
  hValue?: number;
  maxH?: number;
  onMouseDown: (r: number, c: number, button: number, shift: boolean) => void;
  onMouseEnter: (r: number, c: number) => void;
  onMouseUp: () => void;
}

function getCellBg(cell: CellData, t: Theme, showHeatmap: boolean, hValue: number, maxH: number): string {
  switch (cell.state) {
    case 'wall':       return t.cellWall;
    case 'frontier':   return t.cellFrontier;
    case 'visited':    return t.cellVisited;
    case 'current':    return t.cellCurrent;
    case 'path':       return t.cellPath;
    case 'start':      return t.accent;
    case 'end':        return t.green;
    case 'weight':     return t.isDark ? '#1a2438' : '#e8e5dc';
    default:
      if (showHeatmap && maxH > 0) {
        const norm = 1 - hValue / maxH;
        return `color-mix(in oklch, oklch(0.45 0.12 ${220 - norm * 160}) 30%, transparent)`;
      }
      return t.cellUnvisited;
  }
}

function getCellBoxShadow(cell: CellData, t: Theme): string {
  switch (cell.state) {
    case 'current':  return `inset 0 0 0 1.5px ${t.amber}, 0 0 12px 2px ${t.amberSoft}`;
    case 'frontier': return `inset 0 0 0 1px ${t.cellFrontierEdge}`;
    case 'path':     return `inset 0 0 0 1px ${t.green}`;
    case 'start':    return `inset 0 0 0 1.5px ${t.text}`;
    case 'end':      return `inset 0 0 0 1.5px ${t.text}`;
    default:         return 'none';
  }
}

function getCellAnimation(cell: CellData): string {
  if (cell.state === 'current') return 'current-glow 1.6s ease-in-out infinite';
  if (cell.state === 'path')    return 'path-appear 0.2s ease-out backwards';
  return 'none';
}

const CellInner = memo(function CellInner({
  cell, cellSize, showHeatmap = false, hValue = 0, maxH = 1,
  onMouseDown, onMouseEnter, onMouseUp,
}: CellProps) {
  const t = useTheme() as Theme;
  const bg = getCellBg(cell, t, showHeatmap, hValue, maxH);
  const boxShadow = getCellBoxShadow(cell, t);
  const animation = getCellAnimation(cell);
  const isFrontier = cell.state === 'frontier';

  return (
    <CellDiv
      $cellSize={cellSize}
      $bg={bg}
      $boxShadow={boxShadow}
      $animation={animation}
      $fe={isFrontier ? t.cellFrontierEdge : 'transparent'}
      $c={cell.state === 'current' ? t.amber : 'transparent'}
      $cSoft={cell.state === 'current' ? t.amberSoft : 'transparent'}
      onMouseDown={e => { e.preventDefault(); onMouseDown(cell.row, cell.col, e.button, e.shiftKey); }}
      onMouseEnter={() => onMouseEnter(cell.row, cell.col)}
      onMouseUp={onMouseUp}
      onContextMenu={e => e.preventDefault()}
    >
      {(cell.state === 'start' || cell.state === 'end') && (
        <CellLabel $cellSize={cellSize}>
          {cell.state === 'start' ? 'S' : 'G'}
        </CellLabel>
      )}
      {cell.state === 'weight' && cellSize >= 14 && (
        <CellWeightLabel $cellSize={cellSize}>{cell.weight}</CellWeightLabel>
      )}
      {cell.state === 'visited' && cell.gScore !== Infinity && cell.gScore > 0 && cellSize >= 22 && (
        <CellGScoreLabel $cellSize={cellSize}>{Math.round(cell.gScore)}</CellGScoreLabel>
      )}
    </CellDiv>
  );
});

export const Cell = CellInner;
