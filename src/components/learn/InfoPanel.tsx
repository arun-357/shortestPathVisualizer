import React from 'react';
import { useTheme } from 'styled-components';
import { ALGORITHM_REGISTRY } from '../../constants/algorithms';
import { useAlgorithmStore } from '../../store/algorithmStore';
import type { Theme } from '../../styles/theme';
import { Icons } from '../ui/Icons';
import { Divider, SectionLabel } from '../ui/Primitives';
import {
  InfoPanelRoot,
  PaperAuthor,
  PaperIndex,
  PaperItem,
  PaperLink,
  PaperVenue,
  PaperYear,
  PapersBody,
  ProofText,
  WatchForArrow,
  WatchForBody,
  WatchForItem,
  WatchForText,
} from './InfoPanel.styled';

export const InfoPanel: React.FC = () => {
  const t = useTheme() as Theme;
  const { selectedAlgo } = useAlgorithmStore();
  const meta = ALGORITHM_REGISTRY[selectedAlgo];
  const accent =
    meta.color === 'amber' ? t.amber :
    meta.color === 'pink'  ? t.pink  :
    t.accent;

  return (
    <InfoPanelRoot>
      <SectionLabel>
        <span>{Icons.book}</span> Why it works
      </SectionLabel>
      <ProofText>{meta.proofSketch}</ProofText>

      {meta.watchFor.length > 0 && (
        <>
          <SectionLabel>
            <span>{Icons.question}</span> Watch for
          </SectionLabel>
          <WatchForBody>
            {meta.watchFor.map((b, i) => (
              <WatchForItem key={i}>
                <WatchForArrow $accent={accent}>→</WatchForArrow>
                <WatchForText>{b}</WatchForText>
              </WatchForItem>
            ))}
          </WatchForBody>
        </>
      )}

      {meta.papers.length > 0 && (
        <>
          <Divider m="4px 16px 10px" />
          <SectionLabel>
            <span>{Icons.book}</span> References
          </SectionLabel>
          <PapersBody>
            {meta.papers.map((p, i) => (
              <PaperItem key={i}>
                <PaperIndex>[{i + 1}]</PaperIndex>
                <span>
                  <PaperAuthor>{p.authors}.</PaperAuthor>{' '}
                  <em>{p.title}.</em>{' '}
                  {p.venue && <PaperVenue>{p.venue}, </PaperVenue>}
                  <PaperYear>{p.year}.</PaperYear>{' '}
                  <PaperLink $accent={accent} href={p.url} target="_blank" rel="noopener noreferrer">
                    doi {Icons.external}
                  </PaperLink>
                </span>
              </PaperItem>
            ))}
          </PapersBody>
        </>
      )}
    </InfoPanelRoot>
  );
};
