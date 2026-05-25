import styled from 'styled-components';
import type { PlaybackStatus } from '../../algorithms/types';
import { FONT_MONO } from '../../styles/theme';
import { CtrlBtn } from '../ui/Primitives.styled';

export const ControlsRoot = styled.div``;

export const TransportRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const SpeedLabel = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10.5px;
  color: ${({ theme }) => theme.textDim};
`;

export const PlayBtn = styled(CtrlBtn)<{ $status: PlaybackStatus }>`
  background: ${({ $status, theme }) =>
    $status === 'running' ? theme.amber : theme.accent};
  color: ${({ theme }) => theme.bg};
  border-color: ${({ $status, theme }) =>
    $status === 'running' ? theme.amber : theme.accent};
  width: 44px;
`;

export const RunBtn = styled.button`
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.bg};
  border: none;
  font-family: ${FONT_MONO};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
`;

export const ScrubberWrapper = styled.div`
  position: relative;
  height: 14px;
  margin-bottom: 4px;
`;

export const ScrubberTrack = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 6px;
  height: 2px;
  background: ${({ theme }) => theme.hairline};
  border-radius: 999px;
`;

export const ScrubberFill = styled.div.attrs<{ $pct: number }>(p => ({
  style: { width: `${p.$pct * 100}%` },
}))<{ $pct: number }>`
  position: absolute;
  left: 0;
  top: 6px;
  height: 2px;
  background: ${({ theme }) => theme.accent};
  border-radius: 999px;
`;

export const ScrubberInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
`;

export const ScrubberThumb = styled.div.attrs<{ $pct: number }>(p => ({
  style: { left: `calc(${p.$pct * 100}% - 7px)` },
}))<{ $pct: number }>`
  position: absolute;
  top: 0;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  pointer-events: none;
  background: ${({ theme }) => theme.panel};
  border: 2px solid ${({ theme }) => theme.accent};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
`;

export const ScrubberLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: ${FONT_MONO};
  font-size: 9.5px;
  letter-spacing: 0.4px;
  margin-top: 2px;
  color: ${({ theme }) => theme.textDim};
`;

export const ScrubberLabelCenter = styled.span`
  color: ${({ theme }) => theme.textMuted};
`;

export const SpeedRow = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SpeedKey = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10px;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.textDim};
`;

export const SpeedSlider = styled.input`
  flex: 1;
  accent-color: ${({ theme }) => theme.accent};
  cursor: pointer;
`;

export const SpeedValue = styled.span`
  font-family: ${FONT_MONO};
  font-size: 10px;
  width: 36px;
  text-align: right;
  color: ${({ theme }) => theme.textMuted};
`;

export const PaddedBody = styled.div`
  padding: 0 16px 12px;
`;
