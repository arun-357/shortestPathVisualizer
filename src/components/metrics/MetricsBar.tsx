import React from 'react';
import { useTheme } from 'styled-components';
import { ALGORITHM_REGISTRY } from '../../constants/algorithms';
import { useAlgorithmStore } from '../../store/algorithmStore';
import { useGridStore } from '../../store/gridStore';
import type { Theme } from '../../styles/theme';
import { StatusPill } from '../ui/Primitives';
import {
  GridSizeLabel,
  MetricEl,
  MetricLabel,
  MetricValue,
  MetricsBarRoot,
  MetricsGroup,
} from './MetricsBar.styled';

function formatTime(ms: number): string {
  if (ms === 0) return '—';
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  const ss = (s % 60).toFixed(2).padStart(5, '0');
  return `${m}:${ss}`;
}

export const MetricsBar: React.FC = () => {
  const t = useTheme() as Theme;
  const { selectedAlgo, status, visitedCount, pathLength, wallTime, speed } = useAlgorithmStore();
  const { rows, cols } = useGridStore();
  const meta = ALGORITHM_REGISTRY[selectedAlgo];
  const accent =
    meta.color === 'amber' ? t.amber :
    meta.color === 'pink'  ? t.pink  :
    t.accent;

  const pillKind =
    status === 'running' ? 'running' :
    status === 'done'    ? 'done' :
    status === 'paused'  ? 'paused' :
    status === 'no-path' ? 'no-path' :
    'default';

  const pillText =
    status === 'running'  ? 'running' :
    status === 'done'     ? 'path found' :
    status === 'paused'   ? 'paused' :
    status === 'no-path'  ? 'no path' :
    'idle';

  return (
    <MetricsBarRoot>
      <MetricsGroup>
        <MetricEl>
          <MetricLabel>visited</MetricLabel>
          <MetricValue $accent={accent}>{visitedCount}</MetricValue>
        </MetricEl>
        <MetricEl>
          <MetricLabel>path</MetricLabel>
          <MetricValue $accent={t.green}>{pathLength > 0 ? pathLength : '—'}</MetricValue>
        </MetricEl>
        <MetricEl>
          <MetricLabel>elapsed</MetricLabel>
          <MetricValue>{formatTime(wallTime)}</MetricValue>
        </MetricEl>
        <MetricEl>
          <MetricLabel>speed</MetricLabel>
          <MetricValue>{speed}ms</MetricValue>
        </MetricEl>
      </MetricsGroup>
      <MetricsGroup $gap={14}>
        <GridSizeLabel>{rows} × {cols}</GridSizeLabel>
        <StatusPill kind={pillKind}>{pillText}</StatusPill>
      </MetricsGroup>
    </MetricsBarRoot>
  );
};
