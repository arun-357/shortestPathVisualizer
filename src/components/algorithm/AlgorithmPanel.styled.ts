import styled from 'styled-components';
import { FONT_MONO, FONT_SANS } from '../../styles/theme';

export const AlgoPanelRoot = styled.div`
  padding: 16px 16px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.hairlineSoft};
`;

export const AlgoFamilyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const AlgoFamilyIcon = styled.span<{ $accent: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${({ theme }) => theme.accentSoft};
  color: ${p => p.$accent};
`;

export const AlgoFamilyLabel = styled.span<{ $accent: string }>`
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${p => p.$accent};
`;

export const AlgoName = styled.div`
  font-family: ${FONT_SANS};
  font-size: 18px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.text};
`;

export const AlgoBlurb = styled.div`
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
`;

export const ComplexityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 12px;
`;

export const PropertyChipRow = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;
