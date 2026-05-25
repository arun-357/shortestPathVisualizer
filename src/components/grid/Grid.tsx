import React, { useCallback, useMemo, useRef } from 'react';
import { manhattan } from '../../algorithms/heuristics';
import { useGridInteraction } from '../../hooks/useGridInteraction';
import { useGridStore } from '../../store/gridStore';
import { Cell } from './Cell';
import { GridContainer, AutoSizedGridWrapper } from './Grid.styled';

interface GridProps {
  showHeatmap?: boolean;
  cellSizeOverride?: number;
  onMouseDown: (r: number, c: number, button: number, isShift: boolean) => void;
  onMouseEnter: (r: number, c: number) => void;
  onMouseUp: () => void;
}

export const Grid: React.FC<GridProps> = ({ showHeatmap = false, cellSizeOverride, onMouseDown, onMouseEnter, onMouseUp }) => {
  const { visualGrid, rows, cols, end } = useGridStore();

  const maxH = useMemo(() => {
    if (!showHeatmap) return 1;
    let m = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const h = manhattan([r, c], end);
        if (h > m) m = h;
      }
    }
    return m;
  }, [showHeatmap, rows, cols, end]);

  const cs = cellSizeOverride ?? 22;

  const cells = useMemo(() => {
    const out: React.ReactNode[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = visualGrid[r]?.[c];
        if (!cell) continue;
        const hValue = showHeatmap ? manhattan([r, c], end) : 0;
        out.push(
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            cellSize={cs}
            showHeatmap={showHeatmap && cell.state === 'unvisited'}
            hValue={hValue}
            maxH={maxH}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
          />
        );
      }
    }
    return out;
  }, [visualGrid, rows, cols, end, showHeatmap, maxH, cs, onMouseDown, onMouseEnter, onMouseUp]);

  return (
    <GridContainer
      $cols={cols}
      $rows={rows}
      $cellSize={cs}
      onMouseLeave={onMouseUp}
    >
      {cells}
    </GridContainer>
  );
};

// Compute which cell a client coordinate lands on, accounting for centered grid
function cellFromPoint(
  clientX: number,
  clientY: number,
  wrapperEl: HTMLDivElement,
  cellSize: number,
  rows: number,
  cols: number,
): [number, number] | null {
  const wrapRect = wrapperEl.getBoundingClientRect();
  const gridW = cols * cellSize;
  const gridH = rows * cellSize;
  const gridLeft = wrapRect.left + (wrapRect.width  - gridW) / 2;
  const gridTop  = wrapRect.top  + (wrapRect.height - gridH) / 2;
  const col = Math.floor((clientX - gridLeft) / cellSize);
  const row = Math.floor((clientY - gridTop)  / cellSize);
  if (row < 0 || row >= rows || col < 0 || col >= cols) return null;
  return [row, col];
}

interface AutoSizedGridProps {
  containerWidth: number;
  containerHeight: number;
  showHeatmap?: boolean;
}

export const AutoSizedGrid: React.FC<AutoSizedGridProps> = ({ containerWidth, containerHeight, showHeatmap = false }) => {
  const { rows, cols } = useGridStore();
  const { onMouseDown, onMouseEnter, onMouseUp } = useGridInteraction();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const padding = 32;
  const cellSize = Math.max(12, Math.min(
    28,
    Math.floor((containerWidth  - padding * 2) / cols),
    Math.floor((containerHeight - padding * 2) / rows),
  ));

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch || !wrapperRef.current) return;
    const cell = cellFromPoint(touch.clientX, touch.clientY, wrapperRef.current, cellSize, rows, cols);
    if (cell) onMouseDown(cell[0], cell[1], 0, false);
  }, [cellSize, rows, cols, onMouseDown]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch || !wrapperRef.current) return;
    const cell = cellFromPoint(touch.clientX, touch.clientY, wrapperRef.current, cellSize, rows, cols);
    if (cell) onMouseEnter(cell[0], cell[1]);
  }, [cellSize, rows, cols, onMouseEnter]);

  return (
    <AutoSizedGridWrapper
      ref={wrapperRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={onMouseUp}
    >
      <Grid
        cellSizeOverride={cellSize}
        showHeatmap={showHeatmap}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
      />
    </AutoSizedGridWrapper>
  );
};
