import styled from 'styled-components';
import { FONT_MONO } from '../../styles/theme';

export const AlgoStateRoot = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const TableWrapper = styled.div`
  padding: 0 12px 12px;
`;

export const FrontierTable = styled.div`
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.bg};
`;

export const TableHeader = styled.div<{ $showScores: boolean }>`
  display: grid;
  grid-template-columns: ${p => p.$showScores ? '1fr 40px 40px 44px' : '1fr 56px'};
  padding: 6px 10px;
  background: ${({ theme }) => theme.panelAlt};
  font-family: ${FONT_MONO};
  font-size: 9.5px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.textDim};
  border-bottom: 1px solid ${({ theme }) => theme.hairlineSoft};
`;

export const TableHeaderCell = styled.span<{ $right?: boolean }>`
  text-align: ${p => p.$right ? 'right' : 'left'};
`;

export const TableEmpty = styled.div`
  padding: 10px;
  font-family: ${FONT_MONO};
  font-size: 11px;
  color: ${({ theme }) => theme.textDim};
  text-align: center;
`;

export const TableRow = styled.div<{ $showScores: boolean; $isFirst: boolean }>`
  display: grid;
  grid-template-columns: ${p => p.$showScores ? '1fr 40px 40px 44px' : '1fr 56px'};
  padding: 4px 10px;
  font-family: ${FONT_MONO};
  font-size: 11px;
  color: ${({ $isFirst, theme }) => $isFirst ? theme.text : theme.textMuted};
  background: ${({ $isFirst, theme }) => $isFirst ? theme.accentSoft : 'transparent'};
  border-top: ${({ $isFirst, theme }) => $isFirst ? 'none' : `1px solid ${theme.hairlineSoft}`};
`;

export const TableRowCell = styled.span<{ $right?: boolean; $accent?: string; $bold?: boolean; $dimmed?: boolean }>`
  text-align: ${p => p.$right ? 'right' : 'left'};
  color: ${({ $accent, $dimmed, theme }) => $accent || ($dimmed ? theme.textDim : 'inherit')};
  font-weight: ${p => p.$bold ? 600 : 'inherit'};
`;

export const RelaxDim = styled.span`
  color: ${({ theme }) => theme.textDim};
`;

export const RelaxText = styled.span`
  color: ${({ theme }) => theme.text};
`;

export const RelaxAccent = styled.span<{ $accent: string }>`
  color: ${p => p.$accent};
  font-weight: 600;
`;

export const TableRowLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

export const TableRowArrow = styled.span<{ $accent: string }>`
  font-size: 10px;
  color: ${p => p.$accent};
`;

export const RelaxLogWrapper = styled.div`
  margin: 0 12px 12px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
  border-radius: 8px;
  background: ${({ theme }) => theme.bg};
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  line-height: 1.55;
  color: ${({ theme }) => theme.textMuted};
`;

export const RelaxEntry = styled.div.attrs<{ $opacity: number }>(p => ({
  style: { opacity: p.$opacity },
}))<{ $opacity: number }>`
  display: flex;
  justify-content: space-between;
`;

export const StatGrid = styled.div`
  padding: 0 16px 14px;
`;

export const StatGridInner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

export const StepMessage = styled.div`
  margin: 0 12px 14px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
  border-radius: 6px;
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  color: ${({ theme }) => theme.textMuted};
`;

export const StepMessagePrefix = styled.span`
  font-size: 9.5px;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.textDim};
`;
