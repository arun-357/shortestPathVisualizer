import React from 'react';
import { usePlayback } from '../../hooks/usePlayback';
import { useAlgorithmStore } from '../../store/algorithmStore';
import { Icons } from '../ui/Icons';
import { SectionLabel } from '../ui/Primitives';
import { CtrlBtn } from '../ui/Primitives.styled';
import {
  PaddedBody,
  PlayBtn,
  RunBtn,
  ScrubberFill,
  ScrubberInput,
  ScrubberLabelCenter,
  ScrubberLabels,
  ScrubberThumb,
  ScrubberTrack,
  ScrubberWrapper,
  Spacer,
  SpeedKey,
  SpeedRow,
  SpeedSlider,
  SpeedValue,
  SpeedLabel,
  TransportRow,
} from './StepController.styled';

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export const StepController: React.FC = () => {
  const { status, steps, stepIndex, speed, setSpeed } = useAlgorithmStore();
  const { run, pause, resume, stepForward, stepBack, scrubTo, reset } = usePlayback();

  const isRunning = status === 'running';
  const isIdle = status === 'idle';
  const isDoneOrPaused = status === 'done' || status === 'paused' || status === 'no-path';
  const totalSteps = steps.length;
  const pct = totalSteps > 0 ? (stepIndex + 1) / totalSteps : 0;

  const handlePlayPause = () => {
    if (isIdle) { run(); return; }
    if (isRunning) { pause(); return; }
    if (isDoneOrPaused) { resume(); }
  };

  return (
    <div>
      <SectionLabel right={totalSteps > 0 ? `${stepIndex + 1} / ${totalSteps} steps` : undefined}>
        <span>{Icons.cpu}</span> Playback
      </SectionLabel>

      <PaddedBody>
        <TransportRow>
          <CtrlBtn onClick={reset} title="Reset (R)">{Icons.reset}</CtrlBtn>
          <CtrlBtn
            onClick={stepBack}
            disabled={stepIndex <= 0 && status === 'idle'}
            title="Step back (←)"
          >
            {Icons.stepB}
          </CtrlBtn>
          <PlayBtn
            $status={status}
            onClick={isIdle || isDoneOrPaused ? (isIdle ? run : resume) : pause}
            title={isRunning ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isRunning ? Icons.pause : Icons.play}
          </PlayBtn>
          <CtrlBtn
            onClick={stepForward}
            disabled={isRunning || (totalSteps > 0 && stepIndex >= totalSteps - 1)}
            title="Step forward (→)"
          >
            {Icons.stepF}
          </CtrlBtn>
          <Spacer />
          {!isIdle && <SpeedLabel>{speed}ms</SpeedLabel>}
          {isIdle && <RunBtn onClick={run}>RUN</RunBtn>}
        </TransportRow>

        {totalSteps > 0 && (
          <>
            <ScrubberWrapper>
              <ScrubberTrack />
              <ScrubberFill $pct={pct} />
              <ScrubberInput
                type="range"
                min={-1}
                max={totalSteps - 1}
                value={stepIndex}
                onChange={e => scrubTo(Number(e.target.value))}
              />
              <ScrubberThumb $pct={pct} />
            </ScrubberWrapper>
            <ScrubberLabels>
              <span>0</span>
              <ScrubberLabelCenter>step {Math.max(0, stepIndex + 1)}</ScrubberLabelCenter>
              <span>{totalSteps}</span>
            </ScrubberLabels>
          </>
        )}

        <SpeedRow>
          <SpeedKey>SPD</SpeedKey>
          <SpeedSlider
            type="range"
            min={5}
            max={500}
            step={5}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
          />
          <SpeedValue>{formatMs(speed)}</SpeedValue>
        </SpeedRow>
      </PaddedBody>
    </div>
  );
};
