import styled from 'styled-components';
import { FONT_MONO } from '../../styles/theme';

export const PseudoContainer = styled.div`
  margin: 0 16px 14px;
  padding: 8px 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
  background: ${({ theme }) => theme.bg};
  font-family: ${FONT_MONO};
  font-size: 11.5px;
  line-height: 1.6;
  overflow: auto;
  max-height: 280px;
`;

export const PseudoLine = styled.div<{ $active: boolean; $accent: string }>`
  display: flex;
  align-items: flex-start;
  padding: 1px 12px 1px 0;
  background: ${({ $active, theme }) => $active ? theme.accentSoft : 'transparent'};
  border-left: 2px solid ${({ $active, $accent }) => $active ? $accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.text : theme.textMuted};
  transition: background 0.15s;
`;

export const PseudoLineNumber = styled.span<{ $active: boolean; $accent: string }>`
  width: 28px;
  text-align: right;
  flex-shrink: 0;
  padding-right: 8px;
  padding-top: 1px;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  color: ${({ $active, $accent, theme }) => $active ? $accent : theme.textDim};
`;

export const PseudoIndent = styled.span<{ $indent: number }>`
  padding-left: ${p => p.$indent * 8}px;
  white-space: pre-wrap;
`;

export const PseudoKeyword = styled.span<{ $accent: string }>`
  color: ${p => p.$accent};
  opacity: 0.85;
`;
