import styled from 'styled-components';
import { FONT_MONO } from '../../styles/theme';

export interface CellDivProps {
  $cellSize: number;
  $bg: string;
  $boxShadow: string;
  $animation: string;
  $fe: string;
  $c: string;
  $cSoft: string;
}

export const CellDiv = styled.div.attrs<CellDivProps>(p => ({
  style: {
    width: `${p.$cellSize}px`,
    height: `${p.$cellSize}px`,
    background: p.$bg,
    boxShadow: p.$boxShadow,
    animation: p.$animation,
    ['--fe' as string]: p.$fe,
    ['--c' as string]: p.$c,
    ['--c-soft' as string]: p.$cSoft,
  },
}))<CellDivProps>`
  border-top: 1px solid ${({ theme }) => theme.gridLine};
  border-left: 1px solid ${({ theme }) => theme.gridLine};
  box-sizing: border-box;
  position: relative;
  cursor: crosshair;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.1s ease;
`;

export const CellLabel = styled.span<{ $cellSize: number }>`
  font-family: ${FONT_MONO};
  font-weight: 700;
  font-size: ${p => p.$cellSize * 0.55}px;
  color: ${({ theme }) => theme.bg};
`;

export const CellWeightLabel = styled.span<{ $cellSize: number }>`
  font-family: ${FONT_MONO};
  font-weight: 600;
  font-size: ${p => Math.max(8, p.$cellSize * 0.38)}px;
  opacity: 0.85;
  color: ${({ theme }) => theme.textMuted};
`;

export const CellGScoreLabel = styled.span<{ $cellSize: number }>`
  position: absolute;
  top: 1px;
  left: 2px;
  font-family: ${FONT_MONO};
  font-size: ${p => p.$cellSize * 0.3}px;
  opacity: 0.5;
  color: ${({ theme }) => theme.textDim};
`;
