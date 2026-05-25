import styled from 'styled-components';
import { FONT_MONO, FONT_SANS } from '../../styles/theme';
import { mobile } from '../../styles/breakpoints';

// ─── BigStat ─────────────────────────────────────────────────────────────────

export const BigStatRoot = styled.div`
  padding: 8px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
`;

export const BigStatLabel = styled.div`
  font-family: ${FONT_MONO};
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textDim};
`;

export const BigStatValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-top: 2px;
`;

export const BigStatValue = styled.span<{ $accent?: string }>`
  font-family: ${FONT_MONO};
  font-size: 18px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ $accent, theme }) => $accent || theme.text};

  ${mobile} {
    font-size: 15px;
  }
`;

export const BigStatUnit = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10px;
  color: ${({ theme }) => theme.textDim};
`;

// ─── HistoryChart ─────────────────────────────────────────────────────────────

export const ChartWrapper = styled.div`
  padding: 10px 12px 8px;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
  border-radius: 8px;
  margin-top: 8px;
`;

export const ChartSvg = styled.svg`
  display: block;
  overflow: visible;
`;

export const ChartGridLine = styled.line`
  stroke: ${({ theme }) => theme.hairlineSoft};
`;

export const ChartBar = styled.rect<{ $isCurrent: boolean }>`
  fill: ${({ $isCurrent, theme }) => $isCurrent ? theme.amber : theme.cellVisited};
  opacity: ${p => p.$isCurrent ? 1 : 0.7};
`;

export const ChartBarLabel = styled.text<{ $isCurrent: boolean }>`
  fill: ${({ $isCurrent, theme }) => $isCurrent ? theme.amber : theme.textMuted};
`;

export const ChartLegend = styled.div`
  display: flex;
  gap: 14px;
  font-family: ${FONT_MONO};
  font-size: 10px;
  color: ${({ theme }) => theme.textMuted};
`;

export const ChartLegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

export const ChartLegendDot = styled.span<{ $bg: string }>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  display: inline-block;
  background: ${p => p.$bg};
`;

// ─── StatsDrawer ─────────────────────────────────────────────────────────────

export const DrawerRoot = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  background: ${({ theme }) => theme.panel};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.hairline};
  box-shadow: ${({ theme }) => theme.shadowLg};
  overflow: hidden;
  font-family: ${FONT_SANS};
  animation: slide-up 0.25s ease-out;
  z-index: 10;

  ${mobile} {
    left: 8px;
    right: 8px;
    bottom: 8px;
    max-height: 62dvh;
    overflow-y: auto;
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.hairlineSoft};
  background: ${({ theme }) => theme.panelAlt};
`;

export const DrawerHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DrawerHeaderTitle = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  font-size: 13px;
`;

export const DrawerHeaderAlgo = styled.span`
  font-family: ${FONT_MONO};
  font-size: 11px;
  color: ${({ theme }) => theme.textDim};
`;

export const DrawerBody = styled.div`
  padding: 14px 16px 16px;
  display: grid;
  grid-template-columns: 1.1fr 1.5fr 1fr;
  gap: 20px;

  ${mobile} {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 12px;
  }
`;

export const DrawerColLabel = styled.div`
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textDim};
  margin-bottom: 8px;
`;

export const DrawerColLabelNoMb = styled(DrawerColLabel)`
  margin-bottom: 0;
`;

export const StatGrid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

export const ExplanationBox = styled.div`
  padding: 10px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
  font-size: 11.5px;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.6;
`;

export const SummaryNote = styled.div`
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
  font-size: 11.5px;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;
`;

export const SummaryNoteAccent = styled.span<{ $accent: string }>`
  font-family: ${FONT_MONO};
  margin-right: 6px;
  color: ${p => p.$accent};
`;

export const EfficiencyBox = styled.div`
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px dashed ${({ theme }) => theme.hairlineSoft};
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;
`;

export const EfficiencyLabel = styled.span`
  color: ${({ theme }) => theme.textDim};
`;

export const EfficiencyValue = styled.span<{ $accent: string }>`
  font-weight: 600;
  color: ${p => p.$accent};
`;
