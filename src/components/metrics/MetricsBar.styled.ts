import styled from 'styled-components';
import { FONT_MONO } from '../../styles/theme';
import { mobile } from '../../styles/breakpoints';

export const MetricsBarRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 16px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.panel};
  border-top: 1px solid ${({ theme }) => theme.hairline};

  ${mobile} {
    height: auto;
    padding: 6px 12px;
    flex-wrap: wrap;
    gap: 4px 12px;
  }
`;

export const MetricsGroup = styled.div<{ $gap?: number }>`
  display: flex;
  align-items: center;
  gap: ${p => p.$gap ?? 18}px;
`;

export const MetricEl = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
`;

export const MetricLabel = styled.span`
  font-family: ${FONT_MONO};
  font-size: 9.5px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textDim};
`;

export const MetricValue = styled.span<{ $accent?: string }>`
  font-family: ${FONT_MONO};
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ $accent, theme }) => $accent || theme.text};
`;

export const GridSizeLabel = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  color: ${({ theme }) => theme.textMuted};
`;
