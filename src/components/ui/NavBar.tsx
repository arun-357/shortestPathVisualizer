import React from 'react';
import { useTheme } from 'styled-components';
import type { AlgorithmId, HeuristicId } from '../../algorithms/types';
import { ALGORITHM_REGISTRY, ALGO_ORDER } from '../../constants/algorithms';
import { useAlgorithmStore } from '../../store/algorithmStore';
import { useUIStore } from '../../store/uiStore';
import type { Theme } from '../../styles/theme';
import { Icons } from './Icons';
import {
  AlgoSelectEl,
  BtnDivider,
  CompareBtn,
  HLabel,
  HeuristicSelectEl,
  LogoBadge,
  LogoName,
  LogoSlash,
  LogoVersion,
  NavBarLeft,
  NavBarRight,
  NavBarRoot,
  NavIconBtn,
  SelectChevron,
  SelectGroup,
  SelectWrapper,
  VerticalDivider,
  LogoRoot,
} from './NavBar.styled';

const PathfinderLogo: React.FC = () => (
  <LogoRoot>
    <LogoBadge>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12.5 6 9 9 11 13 4.5" />
        <circle cx="3" cy="12.5" r="1.2" fill="currentColor" />
        <circle cx="13" cy="4.5" r="1.2" fill="currentColor" />
      </svg>
    </LogoBadge>
    <LogoName>pathfinder</LogoName>
    <LogoSlash>/</LogoSlash>
    <LogoVersion>v2.0</LogoVersion>
  </LogoRoot>
);

const AlgoSelect: React.FC<{ value: AlgorithmId; onChange: (id: AlgorithmId) => void }> = ({ value, onChange }) => {
  const t = useTheme() as Theme;
  const meta = ALGORITHM_REGISTRY[value];
  const accent = meta.color === 'amber' ? t.amber : meta.color === 'pink' ? t.pink : t.accent;
  return (
    <SelectWrapper>
      <AlgoSelectEl $accent={accent} value={value} onChange={e => onChange(e.target.value as AlgorithmId)}>
        {ALGO_ORDER.map(id => (
          <option key={id} value={id}>{ALGORITHM_REGISTRY[id].name}</option>
        ))}
      </AlgoSelectEl>
      <SelectChevron>{Icons.chev}</SelectChevron>
    </SelectWrapper>
  );
};

const HeuristicSelect: React.FC<{ value: HeuristicId; onChange: (id: HeuristicId) => void }> = ({ value, onChange }) => (
  <SelectWrapper>
    <HLabel>H</HLabel>
    <HeuristicSelectEl value={value} onChange={e => onChange(e.target.value as HeuristicId)}>
      <option value="manhattan">Manhattan</option>
      <option value="euclidean">Euclidean</option>
      <option value="chebyshev">Chebyshev</option>
    </HeuristicSelectEl>
    <SelectChevron>{Icons.chev}</SelectChevron>
  </SelectWrapper>
);

export const NavBar: React.FC = () => {
  const { selectedAlgo, heuristic, setAlgo, setHeuristic } = useAlgorithmStore();
  const { theme, compareMode, toggleTheme, setCompareMode, toggleMazeControls, toggleKeyboardHud } = useUIStore();
  const needsHeuristic = selectedAlgo === 'astar' || selectedAlgo === 'greedy';

  return (
    <NavBarRoot>
      <NavBarLeft>
        <PathfinderLogo />
        <VerticalDivider />
        <SelectGroup>
          <AlgoSelect value={selectedAlgo} onChange={setAlgo} />
          {needsHeuristic && <HeuristicSelect value={heuristic} onChange={setHeuristic} />}
        </SelectGroup>
      </NavBarLeft>

      <NavBarRight>
        <CompareBtn $active={compareMode} onClick={() => setCompareMode(!compareMode)}>
          {Icons.split}<span>Compare</span>
        </CompareBtn>
        <CompareBtn $active={false} onClick={toggleMazeControls}>
          {Icons.layers}<span>Maze</span>
        </CompareBtn>
        <CompareBtn $active={false} onClick={toggleKeyboardHud}>
          {Icons.kb}<span>Keys</span>
        </CompareBtn>
        <BtnDivider />
        <NavIconBtn onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? Icons.moon : Icons.sun}
        </NavIconBtn>
        <NavIconBtn title="More">{Icons.more}</NavIconBtn>
      </NavBarRight>
    </NavBarRoot>
  );
};
