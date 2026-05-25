import React from 'react';
import { usePlayback } from '../../hooks/usePlayback';
import { useAlgorithmStore } from '../../store/algorithmStore';
import { useUIStore } from '../../store/uiStore';
import { Icons } from './Icons';
import {
  MobileBarRoot,
  MobileCtrlBtn,
  MobileDrawerBtn,
  MobilePanelGroup,
  MobilePlayBtn,
  MobileTransportGroup,
} from './MobileBar.styled';

export const MobileBar: React.FC = () => {
  const { status, steps, stepIndex } = useAlgorithmStore();
  const { run, pause, resume, stepForward, stepBack, reset } = usePlayback();
  const { mobileDrawer, setMobileDrawer } = useUIStore();

  const isRunning = status === 'running';
  const isIdle = status === 'idle';
  const isDoneOrPaused = status === 'done' || status === 'paused' || status === 'no-path';

  const handlePlay = () => {
    if (isIdle) { run(); return; }
    if (isRunning) { pause(); return; }
    if (isDoneOrPaused) { resume(); }
  };

  const toggleDrawer = (drawer: 'controls' | 'info') => {
    setMobileDrawer(mobileDrawer === drawer ? null : drawer);
  };

  return (
    <MobileBarRoot>
      <MobileTransportGroup>
        <MobileCtrlBtn onClick={reset} title="Reset">{Icons.reset}</MobileCtrlBtn>
        <MobileCtrlBtn
          onClick={stepBack}
          disabled={isIdle && stepIndex <= 0}
          title="Step back"
        >
          {Icons.stepB}
        </MobileCtrlBtn>
        <MobilePlayBtn $running={isRunning} onClick={handlePlay} title={isRunning ? 'Pause' : 'Play'}>
          {isRunning ? Icons.pause : Icons.play}
        </MobilePlayBtn>
        <MobileCtrlBtn
          onClick={stepForward}
          disabled={isRunning || (steps.length > 0 && stepIndex >= steps.length - 1)}
          title="Step forward"
        >
          {Icons.stepF}
        </MobileCtrlBtn>
      </MobileTransportGroup>

      <MobilePanelGroup>
        <MobileDrawerBtn $active={mobileDrawer === 'controls'} onClick={() => toggleDrawer('controls')}>
          {Icons.cpu} Controls
        </MobileDrawerBtn>
        <MobileDrawerBtn $active={mobileDrawer === 'info'} onClick={() => toggleDrawer('info')}>
          {Icons.book} Learn
        </MobileDrawerBtn>
      </MobilePanelGroup>
    </MobileBarRoot>
  );
};
