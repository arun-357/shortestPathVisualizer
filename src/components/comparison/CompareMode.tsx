import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import { bfs } from '../../algorithms/bfs';
import { bidirectionalBfs } from '../../algorithms/bidirectionalBfs';
import { dfs } from '../../algorithms/dfs';
import { dijkstra } from '../../algorithms/dijkstra';
import { greedyBestFirst } from '../../algorithms/greedyBestFirst';
import { aStar } from '../../algorithms/aStar';
import { heuristics } from '../../algorithms/heuristics';
import type { AlgorithmId, AlgorithmStep } from '../../algorithms/types';
import { ALGORITHM_REGISTRY } from '../../constants/algorithms';
import { applyStep, useGridStore } from '../../store/gridStore';
import { useAlgorithmStore } from '../../store/algorithmStore';
import type { Theme } from '../../styles/theme';
import { Icons } from '../ui/Icons';
import { StatusPill } from '../ui/Primitives';
import { CtrlBtn } from '../ui/Primitives.styled';
import {
  AlgoBadge,
  AlgoComplexity,
  AlgoSelectEl,
  CompareAlgoBadge,
  CompareCellDiv,
  CompareCellLabel,
  CompareGridArea,
  CompareGridInner,
  CompareModeRoot,
  ComparePanelHeader,
  ComparePanelHeaderLeft,
  ComparePanelRoot,
  CompareStatsRoot,
  CompareStatsTable,
  MiniMetricItem,
  MiniMetricLabel,
  MiniMetricValue,
  MiniMetrics,
  PanelDivider,
  PlayBtnAccent,
  SplitBody,
  StatsCell,
  StatsCellLabel,
  StatsHeaderCell,
  StatsWinIcon,
  SyncBanner,
  SyncBannerHint,
  SyncBannerLeft,
  SyncBannerRight,
  SyncModeBadge,
  SyncModeDot,
  SyncTickLabel,
} from './CompareMode.styled';

function runAlgo(
  id: AlgorithmId,
  grid: ReturnType<typeof useGridStore.getState>['baseGrid'],
  start: [number, number],
  end: [number, number],
): AlgorithmStep[] {
  const h = heuristics.manhattan;
  let gen: Generator<AlgorithmStep>;
  switch (id) {
    case 'bfs':      gen = bfs(grid, start, end); break;
    case 'dfs':      gen = dfs(grid, start, end); break;
    case 'dijkstra': gen = dijkstra(grid, start, end); break;
    case 'astar':    gen = aStar(grid, start, end, { heuristic: h }); break;
    case 'greedy':   gen = greedyBestFirst(grid, start, end, { heuristic: h }); break;
    case 'bidirBfs': gen = bidirectionalBfs(grid, start, end); break;
    default:         gen = bfs(grid, start, end);
  }
  const steps: AlgorithmStep[] = [];
  let r = gen.next();
  while (!r.done) { steps.push(r.value); r = gen.next(); }
  return steps;
}

const AlgoSelect: React.FC<{ value: AlgorithmId; onChange: (id: AlgorithmId) => void; accent: string }> = ({ value, onChange, accent }) => (
  <AlgoSelectEl $accent={accent} value={value} onChange={e => onChange(e.target.value as AlgorithmId)}>
    {(['bfs','dfs','bidirBfs','dijkstra','astar','greedy'] as AlgorithmId[]).map(id => (
      <option key={id} value={id}>{ALGORITHM_REGISTRY[id].name}</option>
    ))}
  </AlgoSelectEl>
);

const ComparePanel: React.FC<{
  algoId: AlgorithmId;
  steps: AlgorithmStep[];
  stepIdx: number;
  baseGrid: ReturnType<typeof useGridStore.getState>['baseGrid'];
  rows: number;
  cols: number;
  start: [number, number];
  end: [number, number];
  status: 'idle' | 'running' | 'done' | 'no-path';
  onAlgoChange: (id: AlgorithmId) => void;
}> = ({ algoId, steps, stepIdx, baseGrid, rows, cols, start, end, status, onAlgoChange }) => {
  const t = useTheme() as Theme;
  const meta = ALGORITHM_REGISTRY[algoId];
  const accent = meta.color === 'amber' ? t.amber : meta.color === 'pink' ? t.pink : t.accent;

  const visualGrid = React.useMemo(() => {
    let grid = baseGrid.map(row => row.map(c => ({ ...c })));
    for (let i = 0; i <= stepIdx && i < steps.length; i++) {
      grid = applyStep(grid, steps[i]!);
    }
    return grid;
  }, [baseGrid, steps, stepIdx]);

  const visitedCount = React.useMemo(() =>
    visualGrid.flat().filter(c => c.state === 'visited' || c.state === 'current').length,
    [visualGrid]);
  const pathCount = React.useMemo(() =>
    visualGrid.flat().filter(c => c.state === 'path').length,
    [visualGrid]);
  const frontierCount = React.useMemo(() =>
    visualGrid.flat().filter(c => c.state === 'frontier').length,
    [visualGrid]);

  const padding = 24;
  const cellSize = Math.max(12, Math.min(22, Math.floor((400 - padding * 2) / cols)));

  return (
    <ComparePanelRoot>
      <ComparePanelHeader>
        <ComparePanelHeaderLeft>
          <AlgoBadge $accent={accent}>{meta.short.slice(0, 2)}</AlgoBadge>
          <AlgoSelect value={algoId} onChange={onAlgoChange} accent={accent} />
          <AlgoComplexity>· {meta.complexity.time}</AlgoComplexity>
        </ComparePanelHeaderLeft>
        <StatusPill kind={status === 'done' ? 'done' : status === 'running' ? 'running' : 'paused'}>
          {status === 'done' ? 'done' : status === 'no-path' ? 'no path' : status}
        </StatusPill>
      </ComparePanelHeader>

      <MiniMetrics>
        {[
          { label: 'visited', v: visitedCount, ac: accent },
          { label: 'frontier', v: frontierCount },
          { label: 'path', v: pathCount, ac: t.green },
        ].map(({ label, v, ac }) => (
          <MiniMetricItem key={label}>
            <MiniMetricLabel>{label}</MiniMetricLabel>
            <MiniMetricValue $accent={ac}>{v}</MiniMetricValue>
          </MiniMetricItem>
        ))}
      </MiniMetrics>

      <CompareGridArea>
        <CompareGridInner $cols={cols} $rows={rows} $cellSize={cellSize}>
          {visualGrid.flat().map(cell => {
            const bg =
              cell.state === 'wall'     ? t.cellWall :
              cell.state === 'frontier' ? t.cellFrontier :
              cell.state === 'visited'  ? t.cellVisited :
              cell.state === 'current'  ? t.cellCurrent :
              cell.state === 'path'     ? t.cellPath :
              cell.state === 'start'    ? t.accent :
              cell.state === 'end'      ? t.green :
              'transparent';
            return (
              <CompareCellDiv key={`${cell.row}-${cell.col}`} $cellSize={cellSize} $bg={bg}>
                {cell.state === 'start' && <CompareCellLabel $size={cellSize}>S</CompareCellLabel>}
                {cell.state === 'end'   && <CompareCellLabel $size={cellSize}>G</CompareCellLabel>}
              </CompareCellDiv>
            );
          })}
        </CompareGridInner>
        <CompareAlgoBadge $accent={accent}>{meta.short}</CompareAlgoBadge>
      </CompareGridArea>
    </ComparePanelRoot>
  );
};

const CompareStats: React.FC<{
  leftSteps: AlgorithmStep[];
  rightSteps: AlgorithmStep[];
  leftAlgo: AlgorithmId;
  rightAlgo: AlgorithmId;
}> = ({ leftSteps, rightSteps, leftAlgo, rightAlgo }) => {
  const t = useTheme() as Theme;
  const lVisited = leftSteps.filter(s => s.type === 'visit').length;
  const rVisited = rightSteps.filter(s => s.type === 'visit').length;
  const lPath = leftSteps.filter(s => s.type === 'path').length;
  const rPath = rightSteps.filter(s => s.type === 'path').length;

  const rows = [
    { label: 'Nodes visited', l: lVisited, r: rVisited, lower: true },
    { label: 'Path length', l: lPath, r: rPath, lower: false, equal: lPath === rPath },
    { label: 'Steps total', l: leftSteps.length, r: rightSteps.length, lower: true },
    { label: 'Optimal?', l: ALGORITHM_REGISTRY[leftAlgo].optimal ? '✓' : '✗', r: ALGORITHM_REGISTRY[rightAlgo].optimal ? '✓' : '✗' },
  ];

  return (
    <CompareStatsRoot>
      <CompareStatsTable>
        <StatsHeaderCell>METRIC</StatsHeaderCell>
        <StatsHeaderCell $accent={t.amber}>{ALGORITHM_REGISTRY[leftAlgo].short}</StatsHeaderCell>
        <StatsHeaderCell $accent={t.accent}>{ALGORITHM_REGISTRY[rightAlgo].short}</StatsHeaderCell>
        {rows.map((row, i) => {
          const lBetter = row.lower && typeof row.l === 'number' && typeof row.r === 'number' && row.l < row.r;
          const rBetter = row.lower && typeof row.l === 'number' && typeof row.r === 'number' && row.r < row.l;
          return (
            <React.Fragment key={i}>
              <StatsCellLabel>{row.label}</StatsCellLabel>
              <StatsCell $right $highlight={lBetter}>
                {lBetter && <StatsWinIcon>{Icons.check}</StatsWinIcon>}
                {row.l}
              </StatsCell>
              <StatsCell $right $highlight={rBetter}>
                {rBetter && <StatsWinIcon>{Icons.check}</StatsWinIcon>}
                {row.r}
              </StatsCell>
            </React.Fragment>
          );
        })}
      </CompareStatsTable>
    </CompareStatsRoot>
  );
};

export const CompareMode: React.FC = () => {
  const { baseGrid, rows, cols, start, end } = useGridStore();
  const algoStore = useAlgorithmStore();
  const [leftAlgo, setLeftAlgo] = useState<AlgorithmId>('astar');
  const [rightAlgo, setRightAlgo] = useState<AlgorithmId>('dijkstra');
  const [leftSteps, setLeftSteps] = useState<AlgorithmStep[]>([]);
  const [rightSteps, setRightSteps] = useState<AlgorithmStep[]>([]);
  const [tick, setTick] = useState(0);
  const [totalTicks, setTotalTicks] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const [speed] = useState(30);

  const stopInterval = () => {
    if (intervalRef.current !== null) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const runBoth = useCallback(() => {
    const ls = runAlgo(leftAlgo, baseGrid, start, end);
    const rs = runAlgo(rightAlgo, baseGrid, start, end);
    setLeftSteps(ls);
    setRightSteps(rs);
    setTick(0);
    setTotalTicks(Math.max(ls.length, rs.length));
    setDone(false);
    setRunning(true);

    stopInterval();
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setTick(i);
      if (i >= Math.max(ls.length, rs.length)) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setRunning(false);
        setDone(true);
      }
    }, speed) as unknown as number;
  }, [leftAlgo, rightAlgo, baseGrid, start, end, speed]);

  useEffect(() => () => stopInterval(), []);

  const leftIdx = Math.min(tick - 1, leftSteps.length - 1);
  const rightIdx = Math.min(tick - 1, rightSteps.length - 1);
  const leftStatus = leftIdx >= leftSteps.length - 1 ? (leftSteps.some(s => s.type === 'no-path') ? 'no-path' : 'done') :
    running ? 'running' : 'idle';
  const rightStatus = rightIdx >= rightSteps.length - 1 ? (rightSteps.some(s => s.type === 'no-path') ? 'no-path' : 'done') :
    running ? 'running' : 'idle';

  return (
    <CompareModeRoot>
      <SyncBanner>
        <SyncBannerLeft>
          <SyncModeBadge>
            <SyncModeDot />
            COMPARE MODE
          </SyncModeBadge>
          <SyncBannerHint>same grid · same start/goal · synced playback</SyncBannerHint>
        </SyncBannerLeft>
        <SyncBannerRight>
          <CtrlBtn onClick={() => { setTick(0); setDone(false); stopInterval(); setRunning(false); }} title="Reset">
            {Icons.reset}
          </CtrlBtn>
          <PlayBtnAccent onClick={runBoth}>
            {running ? Icons.pause : Icons.play}
          </PlayBtnAccent>
          <SyncTickLabel>tick {Math.max(0, tick)} / {totalTicks}</SyncTickLabel>
        </SyncBannerRight>
      </SyncBanner>

      <SplitBody>
        <ComparePanel
          algoId={leftAlgo}
          steps={leftSteps}
          stepIdx={leftIdx}
          baseGrid={baseGrid}
          rows={rows} cols={cols} start={start} end={end}
          status={leftStatus as 'idle' | 'running' | 'done' | 'no-path'}
          onAlgoChange={id => { setLeftAlgo(id); setTick(0); setDone(false); }}
        />
        <PanelDivider />
        <ComparePanel
          algoId={rightAlgo}
          steps={rightSteps}
          stepIdx={rightIdx}
          baseGrid={baseGrid}
          rows={rows} cols={cols} start={start} end={end}
          status={rightStatus as 'idle' | 'running' | 'done' | 'no-path'}
          onAlgoChange={id => { setRightAlgo(id); setTick(0); setDone(false); }}
        />
      </SplitBody>

      {done && leftSteps.length > 0 && (
        <CompareStats leftSteps={leftSteps} rightSteps={rightSteps} leftAlgo={leftAlgo} rightAlgo={rightAlgo} />
      )}
    </CompareModeRoot>
  );
};
