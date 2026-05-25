import styled from 'styled-components';

export const GridContainer = styled.div<{ $cols: number; $rows: number; $cellSize: number }>`
  display: grid;
  grid-template-columns: repeat(${p => p.$cols}, ${p => p.$cellSize}px);
  grid-template-rows: repeat(${p => p.$rows}, ${p => p.$cellSize}px);
  border-right: 1px solid ${({ theme }) => theme.gridLine};
  border-bottom: 1px solid ${({ theme }) => theme.gridLine};
  background: ${({ theme }) => theme.gridBg};
  width: fit-content;
  user-select: none;
  touch-action: none;
`;

export const AutoSizedGridWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
