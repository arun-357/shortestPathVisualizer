import styled from 'styled-components';
import { FONT_MONO, FONT_SANS } from './styles/theme';
import { mobile, notDesktop, tablet } from './styles/breakpoints';

// ─── App Shell ───────────────────────────────────────────────────────────────

export const AppRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: ${FONT_SANS};
`;

export const AppBody = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;

  ${mobile} {
    flex-direction: column;
  }
`;

export const LeftPanel = styled.div`
  width: 288px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.panel};
  border-right: 1px solid ${({ theme }) => theme.hairline};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${mobile} {
    display: none;
  }

  ${tablet} {
    width: 220px;
  }
`;

export const LeftPanelScroll = styled.div`
  flex: 1;
  overflow: auto;
`;

export const CenterStage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
`;

export const GridViewport = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

export const GridCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RightPanel = styled.div`
  width: 320px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.panel};
  border-left: 1px solid ${({ theme }) => theme.hairline};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${notDesktop} {
    display: none;
  }
`;

export const PseudocodeWrapper = styled.div`
  flex-shrink: 0;
`;

export const InfoWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

// ─── Keyboard HUD ────────────────────────────────────────────────────────────

export const HudRoot = styled.div`
  position: absolute;
  right: 16px;
  bottom: 50px;
  padding: 12px 14px;
  background: ${({ theme }) => `${theme.panel}f0`};
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => theme.hairline};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadowLg};
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  color: ${({ theme }) => theme.textMuted};
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 5px 12px;
  align-items: center;
  min-width: 230px;
  z-index: 20;

  ${mobile} {
    display: none;
  }
`;

export const HudTitleRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const HudTitle = styled.span`
  color: ${({ theme }) => theme.textDim};
  letter-spacing: 1px;
  font-size: 9.5px;
`;

export const HudCloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textDim};
`;

export const HudKbdRow = styled.span`
  display: flex;
  gap: 2px;
`;

// ─── Heuristic Card ──────────────────────────────────────────────────────────

export const HeuristicCardRoot = styled.div`
  padding: 12px 16px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.hairlineSoft};
`;

export const HeuristicCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const HeuristicCardLabel = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textDim};
`;

export const HeuristicAdmissible = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10px;
  color: ${({ theme }) => theme.green};
`;

export const HeuristicBtnGroup = styled.div`
  display: flex;
  gap: 4px;
`;

export const HeuristicBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 5px 0;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  font-family: ${FONT_SANS};
  font-size: 11px;
  font-weight: ${p => p.$active ? 600 : 400};
  background: ${({ $active, theme }) => $active ? theme.accentSoft : theme.bg};
  border: 1px solid ${({ $active, theme }) => $active ? theme.accentEdge : theme.hairlineSoft};
  color: ${({ $active, theme }) => $active ? theme.text : theme.textMuted};
`;

export const HeuristicFormula = styled.div`
  margin-top: 6px;
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  color: ${({ theme }) => theme.textDim};
`;

export const HeuristicFormulaValue = styled.span`
  color: ${({ theme }) => theme.textMuted};
`;

// ─── Stage Header ────────────────────────────────────────────────────────────

export const StageHeaderRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 16px;
  flex-shrink: 0;
  border-bottom: 1px solid ${({ theme }) => theme.hairlineSoft};
  background: ${({ theme }) => theme.panelAlt};
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  color: ${({ theme }) => theme.textDim};
  letter-spacing: 0.6px;
`;

export const StageHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StageHeaderGrid = styled.span`
  color: ${({ theme }) => theme.textMuted};
`;

export const StageHeaderStep = styled.span`
  color: ${({ theme }) => theme.textDim};
`;

export const StageHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HeatmapBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-family: ${FONT_MONO};
  font-size: 10px;
  background: ${({ $active, theme }) => $active ? theme.accentSoft : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.accent : theme.textDim};
  border: 1px solid ${({ $active, theme }) => $active ? theme.accentEdge : theme.hairlineSoft};
`;

export const HeatmapDot = styled.span<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 1px;
  display: inline-block;
  background: ${({ $active, theme }) => $active ? theme.accent : theme.textDim};
`;

export const StageHeaderHint = styled.span`
  color: ${({ theme }) => theme.textDim};

  ${mobile} {
    display: none;
  }
`;

// ─── Cell Legend ─────────────────────────────────────────────────────────────

export const LegendRoot = styled.div`
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 8px 12px;
  background: ${({ theme }) => `${theme.panel}e8`};
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => theme.hairline};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadowLg};
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  column-gap: 10px;
  row-gap: 5px;
  color: ${({ theme }) => theme.textMuted};

  ${mobile} {
    display: none;
  }
`;

export const LegendTitle = styled.div`
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.textDim};
  letter-spacing: 1px;
  font-size: 9.5px;
  margin-bottom: 2px;
`;

export const LegendSwatch = styled.span<{ $bg: string; $ring?: string }>`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.bg};
  font-size: 9px;
  font-weight: 700;
  background: ${p => p.$bg};
  box-shadow: ${({ $ring, theme }) =>
    $ring ? `inset 0 0 0 1.5px ${$ring}` : `inset 0 0 0 1px ${theme.gridLine}`};
`;

// ─── Compare Mode full-screen shell ──────────────────────────────────────────

export const CompareModeShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.bg};
`;

export const CompareModeBody = styled.div`
  flex: 1;
  overflow: hidden;
`;
