import styled from 'styled-components';
import { FONT_MONO, FONT_SANS } from '../../styles/theme';
import { CtrlBtn } from '../ui/Primitives.styled';

// ─── Panel ───────────────────────────────────────────────────────────────────

export const ComparePanelRoot = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ComparePanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.hairlineSoft};
  background: ${({ theme }) => theme.panel};
`;

export const ComparePanelHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const AlgoBadge = styled.span<{ $accent: string }>`
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background: ${p => `${p.$accent}22`};
  color: ${p => p.$accent};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${p => `${p.$accent}44`};
  font-family: ${FONT_MONO};
  font-size: 11px;
  font-weight: 700;
`;

export const AlgoComplexity = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.textDim};
`;

export const AlgoSelectEl = styled.select<{ $accent: string }>`
  appearance: none;
  padding: 5px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.raised};
  border: 1px solid ${({ theme }) => theme.hairline};
  color: ${p => p.$accent};
  font-family: ${FONT_SANS};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

// ─── Mini Metrics ─────────────────────────────────────────────────────────────

export const MiniMetrics = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.hairlineSoft};
  background: ${({ theme }) => theme.panelAlt};
  font-family: ${FONT_MONO};
`;

export const MiniMetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MiniMetricLabel = styled.span`
  font-size: 9px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.textDim};
  text-transform: uppercase;
`;

export const MiniMetricValue = styled.span<{ $accent?: string }>`
  font-size: 16px;
  font-weight: 600;
  margin-top: 2px;
  color: ${({ $accent, theme }) => $accent || theme.text};
`;

// ─── Compare Grid ─────────────────────────────────────────────────────────────

export const CompareGridArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: relative;
  background: ${({ theme }) => theme.bg};
`;

export const CompareGridInner = styled.div<{ $cols: number; $rows: number; $cellSize: number }>`
  display: grid;
  grid-template-columns: repeat(${p => p.$cols}, ${p => p.$cellSize}px);
  grid-template-rows: repeat(${p => p.$rows}, ${p => p.$cellSize}px);
  border-right: 1px solid ${({ theme }) => theme.gridLine};
  border-bottom: 1px solid ${({ theme }) => theme.gridLine};
  background: ${({ theme }) => theme.gridBg};
`;

export const CompareCellDiv = styled.div<{ $cellSize: number; $bg: string }>`
  width: ${p => p.$cellSize}px;
  height: ${p => p.$cellSize}px;
  background: ${p => p.$bg};
  border-top: 1px solid ${({ theme }) => theme.gridLine};
  border-left: 1px solid ${({ theme }) => theme.gridLine};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CompareCellLabel = styled.span<{ $size: number }>`
  color: ${({ theme }) => theme.bg};
  font-family: ${FONT_MONO};
  font-weight: 700;
  font-size: ${p => p.$size * 0.55}px;
`;

export const CompareAlgoBadge = styled.div<{ $accent: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 3px 8px;
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 1px;
  color: ${p => p.$accent};
  background: ${({ theme }) => `${theme.panel}e0`};
  border: 1px solid ${p => `${p.$accent}44`};
  border-radius: 4px;
  text-transform: uppercase;
`;

// ─── Compare Stats Table ──────────────────────────────────────────────────────

export const CompareStatsRoot = styled.div`
  background: ${({ theme }) => theme.panel};
  border-top: 1px solid ${({ theme }) => theme.hairline};
  padding: 10px 16px 12px;
`;

export const CompareStatsTable = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  font-family: ${FONT_MONO};
  font-size: 11.5px;
  border: 1px solid ${({ theme }) => theme.hairline};
  border-radius: 8px;
  overflow: hidden;
`;

export const StatsHeaderCell = styled.div<{ $accent?: string }>`
  padding: 5px 12px;
  background: ${({ theme }) => theme.panelAlt};
  border-bottom: 1px solid ${({ theme }) => theme.hairline};
  font-size: 9.5px;
  letter-spacing: 1px;
  text-align: ${({ $accent }) => $accent ? 'right' : 'left'};
  color: ${({ $accent, theme }) => $accent || theme.textDim};
`;

export const StatsCell = styled.div<{ $highlight?: boolean; $right?: boolean }>`
  padding: 5px 12px;
  border-top: 1px solid ${({ theme }) => theme.hairlineSoft};
  text-align: ${p => p.$right ? 'right' : 'left'};
  color: ${({ $highlight, theme }) => $highlight ? theme.green : theme.text};
  background: ${({ $highlight, theme }) => $highlight ? theme.greenSoft : 'transparent'};
`;

export const StatsCellLabel = styled.div`
  padding: 5px 12px;
  border-top: 1px solid ${({ theme }) => theme.hairlineSoft};
  color: ${({ theme }) => theme.textMuted};
`;

export const StatsWinIcon = styled.span`
  color: ${({ theme }) => theme.green};
  margin-right: 4px;
`;

// ─── Compare Mode Root ────────────────────────────────────────────────────────

export const CompareModeRoot = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${({ theme }) => theme.bg};
`;

export const SyncBanner = styled.div`
  height: 40px;
  padding: 0 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.panelAlt};
  border-bottom: 1px solid ${({ theme }) => theme.hairline};
  font-family: ${FONT_MONO};
  font-size: 11px;
`;

export const SyncBannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SyncBannerRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SyncModeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.accent};
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.accentSoft};
  border: 1px solid ${({ theme }) => theme.accentEdge};
  font-size: 10px;
  letter-spacing: 1px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const SyncModeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.accent};
  display: inline-block;
`;

export const SyncBannerHint = styled.span`
  color: ${({ theme }) => theme.textDim};
`;

export const SyncTickLabel = styled.span`
  margin-left: 8px;
  color: ${({ theme }) => theme.textDim};
`;

export const PanelDivider = styled.div`
  width: 1px;
  background: ${({ theme }) => theme.hairline};
  flex-shrink: 0;
`;

export const SplitBody = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`;

export const PlayBtnAccent = styled(CtrlBtn)`
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.bg};
  border-color: ${({ theme }) => theme.accent};
  width: 40px;
`;
