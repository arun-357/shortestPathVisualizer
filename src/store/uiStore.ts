import { create } from 'zustand';
import type { MazeAlgoId } from '../algorithms/types';

interface UIStore {
  theme: 'dark' | 'light';
  compareMode: boolean;
  showInfoPanel: boolean;
  showDataPanel: boolean;
  showPseudocode: boolean;
  showStatsDrawer: boolean;
  showMazeControls: boolean;
  showKeyboardHud: boolean;
  mazeAlgo: MazeAlgoId;
  brushWeight: number;
  draggingWhat: 'start' | 'end' | 'wall' | 'erase' | 'weight' | null;
  mobileDrawer: null | 'controls' | 'info';

  toggleTheme: () => void;
  setCompareMode: (v: boolean) => void;
  toggleInfoPanel: () => void;
  toggleDataPanel: () => void;
  togglePseudocode: () => void;
  setShowStatsDrawer: (v: boolean) => void;
  toggleMazeControls: () => void;
  toggleKeyboardHud: () => void;
  setMazeAlgo: (id: MazeAlgoId) => void;
  setBrushWeight: (w: number) => void;
  setDraggingWhat: (what: UIStore['draggingWhat']) => void;
  setMobileDrawer: (d: null | 'controls' | 'info') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'dark',
  compareMode: false,
  showInfoPanel: true,
  showDataPanel: true,
  showPseudocode: true,
  showStatsDrawer: false,
  showMazeControls: false,
  showKeyboardHud: false,
  mazeAlgo: 'backtracking',
  brushWeight: 3,
  draggingWhat: null,
  mobileDrawer: null,

  toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setCompareMode: (v) => set({ compareMode: v }),
  toggleInfoPanel: () => set(s => ({ showInfoPanel: !s.showInfoPanel })),
  toggleDataPanel: () => set(s => ({ showDataPanel: !s.showDataPanel })),
  togglePseudocode: () => set(s => ({ showPseudocode: !s.showPseudocode })),
  setShowStatsDrawer: (v) => set({ showStatsDrawer: v }),
  toggleMazeControls: () => set(s => ({ showMazeControls: !s.showMazeControls })),
  toggleKeyboardHud: () => set(s => ({ showKeyboardHud: !s.showKeyboardHud })),
  setMazeAlgo: (id) => set({ mazeAlgo: id }),
  setBrushWeight: (w) => set({ brushWeight: w }),
  setDraggingWhat: (what) => set({ draggingWhat: what }),
  setMobileDrawer: (d) => set({ mobileDrawer: d }),
}));
