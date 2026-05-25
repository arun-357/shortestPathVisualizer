import { css } from 'styled-components';
import { FONT_MONO, FONT_SANS } from './theme';

export const monoLabel = css`
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textDim};
  font-weight: 600;
`;

export const panelContainer = css`
  background: ${({ theme }) => theme.panel};
  border: 1px solid ${({ theme }) => theme.hairline};
  border-radius: 8px;
`;

export const panelCard = css`
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
  border-radius: 6px;
`;

export const monoMetric = css`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-family: ${FONT_MONO};
`;

export const sansBase = css`
  font-family: ${FONT_SANS};
`;
