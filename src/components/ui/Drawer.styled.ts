import styled from 'styled-components';
import { FONT_MONO } from '../../styles/theme';

export const DrawerOverlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${p => p.$open ? 1 : 0};
  pointer-events: ${p => p.$open ? 'auto' : 'none'};
  transition: opacity 0.25s ease;
`;

export const DrawerSheet = styled.div<{ $open: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  max-height: 80dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.panel};
  border-radius: 12px 12px 0 0;
  border-top: 1px solid ${({ theme }) => theme.hairline};
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.4);
  transform: translateY(${p => p.$open ? '0' : '100%'});
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
`;

export const DrawerHandleWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 4px;
  flex-shrink: 0;
`;

export const DrawerHandle = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.hairline};
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px 10px;
  flex-shrink: 0;
  border-bottom: 1px solid ${({ theme }) => theme.hairlineSoft};
`;

export const DrawerTitle = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.textDim};
`;

export const DrawerCloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textMuted};
`;

export const DrawerScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
`;
