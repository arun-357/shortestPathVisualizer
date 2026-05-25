import styled, { css } from 'styled-components';
import { FONT_MONO, FONT_SANS } from '../../styles/theme';

// ─── Status Pill ─────────────────────────────────────────────────────────────

type PillKind = 'running' | 'done' | 'paused' | 'error' | 'default' | 'no-path';

function pillColors(kind: PillKind, theme: import('styled-components').DefaultTheme) {
  if (kind === 'running')               return { c: theme.amber,     bg: theme.amberSoft };
  if (kind === 'done')                  return { c: theme.green,     bg: theme.greenSoft };
  if (kind === 'paused')                return { c: theme.textMuted, bg: theme.hairline };
  if (kind === 'error' || kind === 'no-path') return { c: theme.pink, bg: 'rgba(200,80,80,0.12)' };
  return { c: theme.accent, bg: theme.accentSoft };
}

export const StatusPillWrap = styled.span<{ $kind: PillKind }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px 3px 8px;
  border-radius: 999px;
  font-size: 10.5px;
  letter-spacing: 0.6px;
  font-weight: 600;
  font-family: ${FONT_MONO};
  text-transform: uppercase;
  white-space: nowrap;
  background: ${({ $kind, theme }) => pillColors($kind, theme).bg};
  color: ${({ $kind, theme }) => pillColors($kind, theme).c};
  border: 1px solid ${({ $kind, theme }) => pillColors($kind, theme).c + '33'};
`;

export const StatusPillDot = styled.span<{ $kind: PillKind }>`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  flex-shrink: 0;
  background: ${({ $kind, theme }) => pillColors($kind, theme).c};
  box-shadow: ${({ $kind, theme }) =>
    $kind === 'running' ? `0 0 0 3px ${pillColors($kind, theme).c}22` : 'none'};
  animation: ${({ $kind }) =>
    $kind === 'running' ? 'pulse-dot 1.4s ease-in-out infinite' : 'none'};
`;

// ─── Section Label ────────────────────────────────────────────────────────────

export const SectionLabelRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 6px;
  gap: 8px;
  white-space: nowrap;
`;

export const SectionLabelText = styled.div<{ $accent?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  color: ${({ $accent, theme }) => $accent || theme.textDim};
`;

export const SectionLabelRight = styled.div`
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 0.6px;
  white-space: nowrap;
  flex-shrink: 0;
  color: ${({ theme }) => theme.textDim};
`;

// ─── Divider ──────────────────────────────────────────────────────────────────

export const DividerEl = styled.div<{ $m?: string }>`
  height: 1px;
  background: ${({ theme }) => theme.hairlineSoft};
  margin: ${({ $m }) => $m ?? '0'};
`;

// ─── Kbd ──────────────────────────────────────────────────────────────────────

export const KbdEl = styled.span<{ $w?: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $w }) => $w ?? 20}px;
  height: 20px;
  padding: 0 5px;
  border-radius: 4px;
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  font-weight: 500;
  background: ${({ theme }) => theme.raised};
  color: ${({ theme }) => theme.textMuted};
  border: 1px solid ${({ theme }) => theme.hairline};
  border-bottom: 1.5px solid ${({ theme }) => theme.hairline};
`;

// ─── Property Chip ────────────────────────────────────────────────────────────

export const PropertyChipRoot = styled.span<{ $ok: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2.5px 7px 2.5px 5px;
  border-radius: 999px;
  background: transparent;
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 0.4px;
  color: ${({ $ok, theme }) => $ok ? theme.green : theme.textDim};
  border: 1px solid ${({ $ok, theme }) => $ok ? theme.green + '44' : theme.hairline};
`;

export const PropertyChipIcon = styled.span`
  width: 10px;
  height: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

// ─── Complexity Badge ─────────────────────────────────────────────────────────

export const ComplexityBadgeRoot = styled.div`
  padding: 7px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
`;

export const ComplexityBadgeLabel = styled.div`
  font-family: ${FONT_MONO};
  font-size: 9px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.textDim};
`;

export const ComplexityBadgeValue = styled.div`
  font-family: ${FONT_MONO};
  font-size: 11.5px;
  font-weight: 500;
  margin-top: 2px;
  color: ${({ theme }) => theme.text};
`;

// ─── Stat ─────────────────────────────────────────────────────────────────────

export const StatRoot = styled.div`
  padding: 6px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.hairlineSoft};
`;

export const StatLabel = styled.div`
  font-family: ${FONT_MONO};
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textDim};
`;

export const StatValue = styled.div<{ $accent?: string }>`
  font-family: ${FONT_MONO};
  font-size: 13px;
  font-weight: 500;
  margin-top: 2px;
  color: ${({ $accent, theme }) => $accent || theme.text};
`;

// ─── Button Primitives ────────────────────────────────────────────────────────

export const BtnGhost = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 7px;
  background: transparent;
  cursor: pointer;
  font-family: ${FONT_SANS};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
  border: 1px solid ${({ theme }) => theme.hairline};
`;

export const BtnIcon = styled.button`
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 7px;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textMuted};
  border: 1px solid ${({ theme }) => theme.hairline};
`;

export const CtrlBtn = styled.button<{ $active?: boolean; $accent?: string }>`
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active, $accent, theme }) =>
    $active && $accent ? $accent : theme.raised};
  color: ${({ $active, $accent, theme }) =>
    $active && $accent ? theme.bg : theme.text};
  border: 1px solid ${({ $active, $accent, theme }) =>
    $active && $accent ? $accent : theme.hairline};
`;
