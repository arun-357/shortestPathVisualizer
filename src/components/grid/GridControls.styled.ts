import styled from 'styled-components';
import { FONT_MONO, FONT_SANS } from '../../styles/theme';

export const PopoverRoot = styled.div`
  position: absolute;
  top: 52px;
  right: 8px;
  width: 280px;
  background: ${({ theme }) => theme.panel};
  border: 1px solid ${({ theme }) => theme.hairline};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadowLg};
  z-index: 20;
  overflow: hidden;
  font-family: ${FONT_SANS};
`;

export const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 8px;
  border-bottom: 1px solid ${({ theme }) => theme.hairlineSoft};
`;

export const PopoverHeaderLabel = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textDim};
`;

export const PopoverCloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textMuted};
`;

export const PopoverBody = styled.div`
  padding: 10px 12px 14px;
`;

export const PillGroup = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
`;

export const PillEl = styled.span<{ $active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: ${p => p.$active ? 600 : 400};
  cursor: pointer;
  font-family: ${FONT_SANS};
  white-space: nowrap;
  background: ${({ $active, theme }) => $active ? theme.accentSoft : theme.bg};
  border: 1px solid ${({ $active, theme }) => $active ? theme.accentEdge : theme.hairlineSoft};
  color: ${({ $active, theme }) => $active ? theme.text : theme.textMuted};
`;

export const GenerateMazeBtn = styled.button`
  width: 100%;
  padding: 8px;
  border-radius: 7px;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.bg};
  border: none;
  font-family: ${FONT_MONO};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
`;

export const ClearMazeBtn = styled.button`
  width: 100%;
  padding: 7px;
  border-radius: 7px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.hairline};
  font-family: ${FONT_MONO};
  font-size: 11px;
  cursor: pointer;
  color: ${({ theme }) => theme.textMuted};
`;

export const WeightSection = styled.div`
  margin-top: 14px;
`;

export const WeightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: ${FONT_MONO};
  font-size: 10px;
  color: ${({ theme }) => theme.textDim};
  margin-bottom: 6px;
`;

export const WeightValue = styled.span`
  color: ${({ theme }) => theme.textMuted};
`;

export const WeightSlider = styled.input`
  width: 100%;
  accent-color: ${({ theme }) => theme.accent};
  cursor: pointer;
`;

export const WeightHint = styled.div`
  font-family: ${FONT_MONO};
  font-size: 10px;
  color: ${({ theme }) => theme.textDim};
  margin-top: 4px;
`;
