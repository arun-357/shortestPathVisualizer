import { useCallback, useRef } from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';
import { useGridStore } from '../store/gridStore';
import { useUIStore } from '../store/uiStore';

type DragMode = 'wall' | 'erase' | 'weight' | 'start' | 'end' | null;

export function useGridInteraction() {
  const dragMode = useRef<DragMode>(null);
  const gridStore = useGridStore();
  const algoStatus = useAlgorithmStore(s => s.status);
  const brushWeight = useUIStore(s => s.brushWeight);

  const clearVisualizationIfNeeded = useCallback(() => {
    if (algoStatus !== 'idle') {
      useAlgorithmStore.getState().reset();
      gridStore.clearVisualization();
      useUIStore.getState().setShowStatsDrawer(false);
    }
  }, [algoStatus, gridStore]);

  const onMouseDown = useCallback((r: number, c: number, button: number, isShift: boolean) => {
    const cell = gridStore.visualGrid[r]?.[c];
    if (!cell) return;

    clearVisualizationIfNeeded();

    if (cell.state === 'start') {
      dragMode.current = 'start';
      return;
    }
    if (cell.state === 'end') {
      dragMode.current = 'end';
      return;
    }

    if (button === 2 || isShift) {
      // Right click or shift = weight
      dragMode.current = 'weight';
      gridStore.setWeight(r, c, brushWeight);
      return;
    }

    // Left click
    if (cell.state === 'wall') {
      dragMode.current = 'erase';
      gridStore.setWall(r, c, false);
    } else {
      dragMode.current = 'wall';
      gridStore.setWall(r, c, true);
    }
  }, [gridStore, brushWeight, clearVisualizationIfNeeded]);

  const onMouseEnter = useCallback((r: number, c: number) => {
    const mode = dragMode.current;
    if (!mode) return;
    const cell = gridStore.baseGrid[r]?.[c];
    if (!cell) return;

    if (mode === 'start') {
      gridStore.setStart([r, c]);
    } else if (mode === 'end') {
      gridStore.setEnd([r, c]);
    } else if (mode === 'wall' && cell.state !== 'start' && cell.state !== 'end') {
      gridStore.setWall(r, c, true);
    } else if (mode === 'erase' && cell.state !== 'start' && cell.state !== 'end') {
      gridStore.setWall(r, c, false);
    } else if (mode === 'weight' && cell.state !== 'start' && cell.state !== 'end' && cell.state !== 'wall') {
      gridStore.setWeight(r, c, brushWeight);
    }
  }, [gridStore, brushWeight]);

  const onMouseUp = useCallback(() => {
    dragMode.current = null;
  }, []);

  return { onMouseDown, onMouseEnter, onMouseUp };
}
