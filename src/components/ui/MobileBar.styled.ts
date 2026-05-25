import styled from 'styled-components';
import { FONT_MONO, FONT_SANS } from '../../styles/theme';
import { desktop } from '../../styles/breakpoints';

export const MobileBarRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 12px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.panel};
  border-top: 1px solid ${({ theme }) => theme.hairline};
  gap: 6px;

  ${desktop} {
    display: none;
  }
`;

export const MobileTransportGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MobilePanelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const MobileCtrlBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.hairline};
  background: ${({ theme }) => theme.raised};
  color: ${({ theme }) => theme.text};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
`;

export const MobilePlayBtn = styled.button<{ $running: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: ${({ $running, theme }) => $running ? theme.amber : theme.accent};
  color: ${({ theme }) => theme.bg};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`;

export const MobileDrawerBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-family: ${FONT_SANS};
  font-size: 11.5px;
  font-weight: 500;
  border: 1px solid ${({ $active, theme }) => $active ? theme.accentEdge : theme.hairline};
  background: ${({ $active, theme }) => $active ? theme.accentSoft : theme.raised};
  color: ${({ $active, theme }) => $active ? theme.accent : theme.textMuted};
`;

export const MobileStatusChip = styled.span`
  font-family: ${FONT_MONO};
  font-size: 9px;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.textDim};
  text-transform: uppercase;
  white-space: nowrap;
`;
