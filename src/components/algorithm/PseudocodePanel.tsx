import React from 'react';
import { useTheme } from 'styled-components';
import { ALGORITHM_REGISTRY } from '../../constants/algorithms';
import { useAlgorithmStore } from '../../store/algorithmStore';
import type { Theme } from '../../styles/theme';
import { Icons } from '../ui/Icons';
import { SectionLabel } from '../ui/Primitives';
import {
  PseudoContainer,
  PseudoIndent,
  PseudoKeyword,
  PseudoLine,
  PseudoLineNumber,
} from './PseudocodePanel.styled';

const KEYWORDS = /\b(while|for|each|if|else|return|to|in|set|push|pop|add|update|append|of|not|and|or|function|let|var|const)\b/g;

function highlight(line: string, accent: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(KEYWORDS.source, 'g');
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) parts.push(line.slice(last, m.index));
    parts.push(<PseudoKeyword key={m.index} $accent={accent}>{m[0]}</PseudoKeyword>);
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

export const PseudocodePanel: React.FC = () => {
  const t = useTheme() as Theme;
  const { selectedAlgo, steps, stepIndex } = useAlgorithmStore();
  const meta = ALGORITHM_REGISTRY[selectedAlgo];
  const accent =
    meta.color === 'amber' ? t.amber :
    meta.color === 'pink'  ? t.pink  :
    t.accent;

  const currentStep = steps[stepIndex];
  const activeLine = currentStep?.pseudocodeLine ?? -1;

  return (
    <div>
      <SectionLabel right={activeLine >= 0 ? `line ${activeLine + 1}` : undefined}>
        <span>{Icons.cpu}</span> Pseudocode
      </SectionLabel>

      <PseudoContainer>
        {meta.pseudocode.map((ln, i) => {
          const indent = ln.match(/^(\s*)/)?.[1]?.length ?? 0;
          const txt = ln.trim();
          const active = i === activeLine;
          return (
            <PseudoLine key={i} $active={active} $accent={accent}>
              <PseudoLineNumber $active={active} $accent={accent}>
                {(i + 1).toString().padStart(2, '0')}
              </PseudoLineNumber>
              <PseudoIndent $indent={indent}>
                {active ? highlight(txt, accent) : txt}
              </PseudoIndent>
            </PseudoLine>
          );
        })}
      </PseudoContainer>
    </div>
  );
};
