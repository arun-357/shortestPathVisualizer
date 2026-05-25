import React from 'react';
import { useTheme } from 'styled-components';
import { ALGORITHM_REGISTRY } from '../../constants/algorithms';
import { useAlgorithmStore } from '../../store/algorithmStore';
import { useGridStore } from '../../store/gridStore';
import { useUIStore } from '../../store/uiStore';
import type { Theme } from '../../styles/theme';
import { FONT_MONO } from '../../styles/theme';
import { Icons } from '../ui/Icons';
import { StatusPill } from '../ui/Primitives';
import { BtnIcon } from '../ui/Primitives.styled';
import {
  BigStatLabel,
  BigStatRoot,
  BigStatUnit,
  BigStatValue,
  BigStatValueRow,
  ChartBar,
  ChartBarLabel,
  ChartGridLine,
  ChartLegend,
  ChartLegendDot,
  ChartLegendItem,
  ChartSvg,
  ChartWrapper,
  DrawerBody,
  DrawerColLabel,
  DrawerColLabelNoMb,
  DrawerHeader,
  DrawerHeaderAlgo,
  DrawerHeaderLeft,
  DrawerHeaderTitle,
  DrawerRoot,
  EfficiencyBox,
  EfficiencyLabel,
  EfficiencyValue,
  ExplanationBox,
  StatGrid2,
  SummaryNote,
  SummaryNoteAccent,
} from './StatsDrawer.styled';

const BigStat: React.FC<{ label: string; value: string | number; unit?: string; accent?: string }> = ({ label, value, unit, accent }) => (
  <BigStatRoot>
    <BigStatLabel>{label}</BigStatLabel>
    <BigStatValueRow>
      <BigStatValue $accent={accent}>{value}</BigStatValue>
      {unit && <BigStatUnit>{unit}</BigStatUnit>}
    </BigStatValueRow>
  </BigStatRoot>
);

const HistoryChart: React.FC = () => {
  const t = useTheme() as Theme;
  const { metricsHistory } = useAlgorithmStore();
  if (metricsHistory.length === 0) return null;

  const maxV = Math.max(...metricsHistory.map(r => r.visited), 1);
  const chartH = 80;

  return (
    <ChartWrapper>
      <ChartSvg width="100%" height={chartH + 30}>
        {[0.25, 0.5, 0.75, 1].map((g, i) => (
          <ChartGridLine key={i}
            x1="0" x2="100%"
            y1={chartH - chartH * g + 4} y2={chartH - chartH * g + 4}
            strokeDasharray="2 3" strokeWidth="1"
          />
        ))}
        {metricsHistory.map((run, i) => {
          const pct = i / Math.max(metricsHistory.length - 1, 1);
          const x = `${5 + pct * 85}%`;
          const hV = (run.visited / maxV) * chartH;
          const isCurrent = i === metricsHistory.length - 1;
          return (
            <g key={run.id}>
              <ChartBar $isCurrent={isCurrent}
                x={x} y={chartH - hV + 4} width="5%" height={hV} rx="2" />
              <ChartBarLabel $isCurrent={isCurrent}
                x={`${5 + pct * 85 + 2.5}%`} y={chartH + 18}
                textAnchor="middle" fontSize="9" fontFamily={FONT_MONO}>
                {ALGORITHM_REGISTRY[run.algo]?.short ?? run.algo}
              </ChartBarLabel>
            </g>
          );
        })}
      </ChartSvg>
      <ChartLegend>
        <ChartLegendItem>
          <ChartLegendDot $bg={t.amber} /> visited
        </ChartLegendItem>
      </ChartLegend>
    </ChartWrapper>
  );
};

export const StatsDrawer: React.FC = () => {
  const t = useTheme() as Theme;
  const { showStatsDrawer, setShowStatsDrawer } = useUIStore();
  const { selectedAlgo, status, visitedCount, pathLength, wallTime, metricsHistory } = useAlgorithmStore();
  const { rows, cols } = useGridStore();
  const meta = ALGORITHM_REGISTRY[selectedAlgo];
  const algoAccent =
    meta.color === 'amber' ? t.amber :
    meta.color === 'pink'  ? t.pink  :
    t.accent;

  if (!showStatsDrawer) return null;

  const totalCells = rows * cols;
  const coveragePct = totalCells > 0 ? ((visitedCount / totalCells) * 100).toFixed(0) : '0';

  const formatMs = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <DrawerRoot>
      <DrawerHeader>
        <DrawerHeaderLeft>
          <StatusPill kind={status === 'no-path' ? 'no-path' : 'done'}>
            {status === 'no-path' ? 'no path' : 'path found'}
          </StatusPill>
          <DrawerHeaderTitle>Run summary</DrawerHeaderTitle>
          <DrawerHeaderAlgo>· {meta.name}</DrawerHeaderAlgo>
        </DrawerHeaderLeft>
        <BtnIcon onClick={() => setShowStatsDrawer(false)}>{Icons.x}</BtnIcon>
      </DrawerHeader>

      <DrawerBody>
        {/* Col 1: Key stats */}
        <div>
          <DrawerColLabel>Result</DrawerColLabel>
          <StatGrid2>
            <BigStat label="path length"   value={pathLength > 0 ? pathLength : '—'} unit="cells" accent={t.green} />
            <BigStat label="nodes visited" value={visitedCount} unit={`of ${totalCells}`} accent={algoAccent} />
            <BigStat label="coverage"      value={`${coveragePct}%`} unit="grid" />
            <BigStat label="wall time"     value={formatMs(wallTime)} />
          </StatGrid2>
          {pathLength > 0 && (
            <SummaryNote>
              <SummaryNoteAccent $accent={algoAccent}>★</SummaryNoteAccent>
              {meta.name} visited <strong>{visitedCount}</strong> cells
              {' '}({coveragePct}% of grid) to find a path of <strong>{pathLength}</strong> cells.
            </SummaryNote>
          )}
        </div>

        {/* Col 2: History */}
        <div>
          <DrawerColLabelNoMb>History — last {metricsHistory.length} runs</DrawerColLabelNoMb>
          <HistoryChart />
        </div>

        {/* Col 3: Explanation */}
        <div>
          <DrawerColLabel>Why this many nodes?</DrawerColLabel>
          <ExplanationBox>{meta.watchFor[0] ?? meta.blurb}</ExplanationBox>
          {pathLength > 0 && (
            <EfficiencyBox>
              <EfficiencyLabel>efficiency ratio</EfficiencyLabel><br />
              visited / path = <EfficiencyValue $accent={algoAccent}>
                {pathLength > 0 ? (visitedCount / pathLength).toFixed(1) : '—'}×
              </EfficiencyValue>
            </EfficiencyBox>
          )}
        </div>
      </DrawerBody>
    </DrawerRoot>
  );
};
