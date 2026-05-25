import styled from 'styled-components';
import { FONT_MONO, FONT_SANS } from '../../styles/theme';
import { mobile } from '../../styles/breakpoints';
import { BtnGhost, BtnIcon } from './Primitives.styled';

export const NavBarRoot = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  height: 48px;
  flex-shrink: 0;
  gap: 12px;
  background: ${({ theme }) => theme.panel};
  border-bottom: 1px solid ${({ theme }) => theme.hairline};

  ${mobile} {
    padding: 0 10px;
    gap: 8px;
  }
`;

export const NavBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;

  ${mobile} {
    overflow: hidden;
  }
`;

export const NavHeuristicWrapper = styled.div`
  ${mobile} {
    display: none;
  }
`;

export const NavBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const VerticalDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.hairline};

  ${mobile} {
    display: none;
  }
`;

export const LogoRoot = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const LogoBadge = styled.span`
  display: inline-flex;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.bg};
`;

export const LogoName = styled.span`
  font-family: ${FONT_MONO};
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.text};
`;

export const LogoSlash = styled.span`
  font-family: ${FONT_MONO};
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.textDim};

  ${mobile} {
    display: none;
  }
`;

export const LogoVersion = styled.span`
  font-family: ${FONT_MONO};
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};

  ${mobile} {
    display: none;
  }
`;

export const SelectGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const AlgoSelectEl = styled.select<{ $accent: string }>`
  appearance: none;
  padding: 6px 28px 6px 12px;
  border-radius: 7px;
  background: ${({ theme }) => theme.raised};
  border: 1px solid ${({ theme }) => theme.hairline};
  color: ${p => p.$accent};
  font-family: ${FONT_SANS};
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
`;

export const HeuristicSelectEl = styled.select`
  appearance: none;
  padding: 6px 24px 6px 26px;
  border-radius: 7px;
  background: ${({ theme }) => theme.raised};
  border: 1px solid ${({ theme }) => theme.hairline};
  color: ${({ theme }) => theme.text};
  font-family: ${FONT_SANS};
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
`;

export const SelectChevron = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.textDim};
`;

export const HLabel = styled.span`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-family: ${FONT_MONO};
  font-size: 9.5px;
  letter-spacing: 1px;
  text-transform: uppercase;
  pointer-events: none;
  color: ${({ theme }) => theme.textDim};
`;

export const CompareBtn = styled(BtnGhost)<{ $active: boolean }>`
  background: ${({ $active, theme }) => $active ? theme.accentSoft : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.accent : theme.textMuted};
  border: 1px solid ${({ $active, theme }) => $active ? theme.accentEdge : theme.hairline};

  ${mobile} {
    display: none;
  }
`;

export const NavIconBtn = styled(BtnIcon)``;

export const BtnDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.hairline};
  margin: 0 2px;

  ${mobile} {
    display: none;
  }
`;
