import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import { usePlayback } from './hooks/usePlayback';
import { useAlgorithmStore } from './store/algorithmStore';
import { useGridStore } from './store/gridStore';
import { useUIStore } from './store/uiStore';
import type { Theme } from './styles/theme';
import { AlgorithmPanel } from './components/algorithm/AlgorithmPanel';
import { AlgorithmState } from './components/algorithm/AlgorithmState';
import { PseudocodePanel } from './components/algorithm/PseudocodePanel';
import { StepController } from './components/algorithm/StepController';
import { CompareMode } from './components/comparison/CompareMode';
import { AutoSizedGrid } from './components/grid/Grid';
import { GridControls } from './components/grid/GridControls';
import { InfoPanel } from './components/learn/InfoPanel';
import { MetricsBar } from './components/metrics/MetricsBar';
import { StatsDrawer } from './components/metrics/StatsDrawer';
import { NavBar } from './components/ui/NavBar';
import { Kbd } from './components/ui/Primitives';
import { Icons } from './components/ui/Icons';
import { MobileBar } from './components/ui/MobileBar';
import { Drawer } from './components/ui/Drawer';
import {
  AppBody,
  AppRoot,
  CenterStage,
  CompareModeBody,
  CompareModeShell,
  GridCenter,
  GridViewport,
  HeatmapBtn,
  HeatmapDot,
  HeuristicAdmissible,
  HeuristicBtn,
  HeuristicBtnGroup,
  HeuristicCardHeader,
  HeuristicCardLabel,
  HeuristicCardRoot,
  HeuristicFormula,
  HeuristicFormulaValue,
  HudCloseBtn,
  HudKbdRow,
  HudRoot,
  HudTitle,
  HudTitleRow,
  InfoWrapper,
  LeftPanel,
  LeftPanelScroll,
  LegendRoot,
  LegendSwatch,
  LegendTitle,
  PseudocodeWrapper,
  RightPanel,
  StageHeaderGrid,
  StageHeaderHint,
  StageHeaderLeft,
  StageHeaderRight,
  StageHeaderRoot,
  StageHeaderStep,
} from './App.styled';

const KeyboardHud: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <HudRoot>
    <HudTitleRow>
      <HudTitle>KEYBOARD SHORTCUTS</HudTitle>
      <HudCloseBtn onClick={onClose}>{Icons.x}</HudCloseBtn>
    </HudTitleRow>
    <Kbd w={36}>Space</Kbd><span>play / pause</span>
    <HudKbdRow><Kbd>←</Kbd><Kbd>→</Kbd></HudKbdRow><span>step back / forward</span>
    <Kbd>R</Kbd><span>reset visualization</span>
    <Kbd>C</Kbd><span>clear grid</span>
    <Kbd>M</Kbd><span>generate maze</span>
    <Kbd w={36}>Enter</Kbd><span>run algorithm</span>
    <Kbd>1–9</Kbd><span>set weight brush</span>
  </HudRoot>
);

const HeuristicCard: React.FC = () => {
  const { heuristic, setHeuristic } = useAlgorithmStore();
  const opts = [
    { id: 'manhattan', label: 'Manhattan', formula: '|Δr| + |Δc|' },
    { id: 'euclidean', label: 'Euclidean', formula: '√(Δr² + Δc²)' },
    { id: 'chebyshev', label: 'Chebyshev', formula: 'max(|Δr|, |Δc|)' },
  ] as const;
  const current = opts.find(o => o.id === heuristic) ?? opts[0]!;

  return (
    <HeuristicCardRoot>
      <HeuristicCardHeader>
        <HeuristicCardLabel>Heuristic</HeuristicCardLabel>
        <HeuristicAdmissible>admissible ✓</HeuristicAdmissible>
      </HeuristicCardHeader>
      <HeuristicBtnGroup>
        {opts.map(h => (
          <HeuristicBtn key={h.id} $active={heuristic === h.id} onClick={() => setHeuristic(h.id)}>
            {h.label}
          </HeuristicBtn>
        ))}
      </HeuristicBtnGroup>
      <HeuristicFormula>
        h(n) = <HeuristicFormulaValue>{current.formula}</HeuristicFormulaValue>
      </HeuristicFormula>
    </HeuristicCardRoot>
  );
};

const StageHeader: React.FC<{ showHeatmap: boolean; onToggleHeatmap: () => void }> = ({ showHeatmap, onToggleHeatmap }) => {
  const { selectedAlgo } = useAlgorithmStore();
  const { rows, cols } = useGridStore();
  const { stepIndex, steps } = useAlgorithmStore();

  return (
    <StageHeaderRoot>
      <StageHeaderLeft>
        <StageHeaderGrid>GRID · {cols} × {rows}</StageHeaderGrid>
        {steps.length > 0 && (
          <StageHeaderStep>· step {Math.max(0, stepIndex + 1)} / {steps.length}</StageHeaderStep>
        )}
      </StageHeaderLeft>
      <StageHeaderRight>
        {(selectedAlgo === 'astar' || selectedAlgo === 'greedy') && (
          <HeatmapBtn $active={showHeatmap} onClick={onToggleHeatmap}>
            <HeatmapDot $active={showHeatmap} />
            heatmap h(n)
          </HeatmapBtn>
        )}
        <StageHeaderHint>L: walls · R: weights</StageHeaderHint>
      </StageHeaderRight>
    </StageHeaderRoot>
  );
};

const CellLegend: React.FC = () => {
  const t = useTheme() as Theme;
  const items = [
    { bg: t.accent, ring: t.text, label: 'start', char: 'S' },
    { bg: t.green, ring: t.text, label: 'goal', char: 'G' },
    { bg: t.cellVisited, label: 'visited' },
    { bg: t.cellFrontier, ring: t.cellFrontierEdge, label: 'frontier' },
    { bg: t.cellCurrent, label: 'current' },
    { bg: t.cellWall, label: 'wall' },
    { bg: t.cellPath, ring: t.green, label: 'path' },
  ];
  return (
    <LegendRoot>
      <LegendTitle>LEGEND</LegendTitle>
      {items.map(item => (
        <React.Fragment key={item.label}>
          <LegendSwatch $bg={item.bg} $ring={item.ring}>{item.char}</LegendSwatch>
          <span>{item.label}</span>
        </React.Fragment>
      ))}
    </LegendRoot>
  );
};

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 800, height: 600 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => {
      const e = entries[0];
      if (e) setSize({ width: e.contentRect.width, height: e.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export const App: React.FC = () => {
  const { compareMode, showInfoPanel, showDataPanel, showPseudocode, showKeyboardHud, toggleKeyboardHud, showMazeControls, toggleMazeControls, mobileDrawer, setMobileDrawer } = useUIStore();
  const { selectedAlgo } = useAlgorithmStore();
  const { run, pause, resume, stepForward, stepBack, reset } = usePlayback();
  const { status } = useAlgorithmStore();
  const { setBrushWeight } = useUIStore();
  const [showHeatmap, setShowHeatmap] = useState(false);

  const centerRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(centerRef);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case ' ': e.preventDefault();
          if (status === 'idle') run();
          else if (status === 'running') pause();
          else if (status === 'paused') resume();
          break;
        case 'ArrowRight': e.preventDefault(); stepForward(); break;
        case 'ArrowLeft': e.preventDefault(); stepBack(); break;
        case 'r': case 'R': reset(); break;
        case 'c': case 'C': useGridStore.getState().clearAll(); reset(); break;
        case 'm': case 'M': toggleMazeControls(); break;
        case 'Enter': if (status === 'idle' || status === 'done' || status === 'no-path') run(); break;
        case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
          setBrushWeight(parseInt(e.key));
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [status, run, pause, resume, stepForward, stepBack, reset, toggleMazeControls, setBrushWeight]);

  const needsHeuristic = selectedAlgo === 'astar' || selectedAlgo === 'greedy';
  const showRightPanel = showInfoPanel || showPseudocode;

  if (compareMode) {
    return (
      <CompareModeShell>
        <NavBar />
        <CompareModeBody>
          <CompareMode />
        </CompareModeBody>
      </CompareModeShell>
    );
  }

  return (
    <AppRoot>
      <NavBar />

      <AppBody>
        <LeftPanel>
          <AlgorithmPanel />
          <StepController />
          <LeftPanelScroll>
            {showDataPanel && <AlgorithmState />}
          </LeftPanelScroll>
        </LeftPanel>

        <CenterStage>
          <StageHeader showHeatmap={showHeatmap} onToggleHeatmap={() => setShowHeatmap(h => !h)} />
          <GridViewport ref={centerRef}>
            <GridCenter>
              <AutoSizedGrid
                containerWidth={containerSize.width}
                containerHeight={containerSize.height}
                showHeatmap={showHeatmap}
              />
            </GridCenter>
            <CellLegend />
            <StatsDrawer />
            {showMazeControls && <GridControls onClose={toggleMazeControls} />}
            {showKeyboardHud && <KeyboardHud onClose={toggleKeyboardHud} />}
          </GridViewport>
          <MobileBar />
        </CenterStage>

        {showRightPanel && (
          <RightPanel>
            {needsHeuristic && <HeuristicCard />}
            {showPseudocode && (
              <PseudocodeWrapper>
                <PseudocodePanel />
              </PseudocodeWrapper>
            )}
            {showInfoPanel && (
              <InfoWrapper>
                <InfoPanel />
              </InfoWrapper>
            )}
          </RightPanel>
        )}
      </AppBody>

      <MetricsBar />

      {/* Mobile drawers — rendered outside panel hierarchy */}
      <Drawer open={mobileDrawer === 'controls'} title="Controls" onClose={() => setMobileDrawer(null)}>
        <AlgorithmPanel />
        <StepController />
        {showDataPanel && <AlgorithmState />}
      </Drawer>
      <Drawer open={mobileDrawer === 'info'} title="Learn" onClose={() => setMobileDrawer(null)}>
        {needsHeuristic && <HeuristicCard />}
        {showPseudocode && <PseudocodePanel />}
        {showInfoPanel && <InfoPanel />}
      </Drawer>
    </AppRoot>
  );
};
