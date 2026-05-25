import React from 'react';
import { useTheme } from 'styled-components';
import { ALGORITHM_REGISTRY } from '../../constants/algorithms';
import { useAlgorithmStore } from '../../store/algorithmStore';
import type { Theme } from '../../styles/theme';
import { Icons } from '../ui/Icons';
import { ComplexityBadge, PropertyChip } from '../ui/Primitives';
import {
  AlgoBlurb,
  AlgoFamilyIcon,
  AlgoFamilyLabel,
  AlgoFamilyRow,
  AlgoName,
  AlgoPanelRoot,
  ComplexityGrid,
  PropertyChipRow,
} from './AlgorithmPanel.styled';

export const AlgorithmPanel: React.FC = () => {
  const t = useTheme() as Theme;
  const { selectedAlgo } = useAlgorithmStore();
  const meta = ALGORITHM_REGISTRY[selectedAlgo];
  const accent =
    meta.color === 'amber' ? t.amber :
    meta.color === 'pink'  ? t.pink  :
    meta.color === 'green' ? t.green :
    t.accent;

  return (
    <AlgoPanelRoot>
      <AlgoFamilyRow>
        <AlgoFamilyIcon $accent={accent}>{Icons.brain}</AlgoFamilyIcon>
        <AlgoFamilyLabel $accent={accent}>{meta.family}</AlgoFamilyLabel>
      </AlgoFamilyRow>

      <AlgoName>{meta.name}</AlgoName>
      <AlgoBlurb>{meta.blurb}</AlgoBlurb>

      <ComplexityGrid>
        <ComplexityBadge label="TIME" value={meta.complexity.time} />
        <ComplexityBadge label="SPACE" value={meta.complexity.space} />
      </ComplexityGrid>

      <PropertyChipRow>
        <PropertyChip ok={meta.optimal} label="optimal" />
        <PropertyChip ok={meta.complete} label="complete" />
        <PropertyChip ok={meta.weighted} label="weighted" />
      </PropertyChipRow>
    </AlgoPanelRoot>
  );
};
