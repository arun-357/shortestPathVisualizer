import styled from 'styled-components';
import { FONT_MONO, FONT_SANS, FONT_SERIF } from '../../styles/theme';

export const InfoPanelRoot = styled.div`
  overflow: auto;
  flex: 1;
`;

export const ProofText = styled.div`
  padding: 0 16px 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.6;
  font-family: ${FONT_SANS};
`;

export const WatchForBody = styled.div`
  padding: 0 16px 12px;
  font-family: ${FONT_SANS};
`;

export const WatchForItem = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 7px;
`;

export const WatchForArrow = styled.span<{ $accent: string }>`
  color: ${p => p.$accent};
  font-family: ${FONT_MONO};
  margin-top: 1px;
  font-size: 11px;
  flex-shrink: 0;
`;

export const WatchForText = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;
`;

export const PapersBody = styled.div`
  padding: 0 16px 16px;
`;

export const PaperItem = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  font-family: ${FONT_SERIF};
  font-size: 11.5px;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;
`;

export const PaperIndex = styled.span`
  font-family: ${FONT_MONO};
  color: ${({ theme }) => theme.textDim};
  font-size: 10px;
  margin-top: 2px;
  flex-shrink: 0;
`;

export const PaperAuthor = styled.span`
  color: ${({ theme }) => theme.text};
`;

export const PaperVenue = styled.span`
  color: ${({ theme }) => theme.textDim};
`;

export const PaperYear = styled.span`
  color: ${({ theme }) => theme.textDim};
`;

export const PaperLink = styled.a<{ $accent: string }>`
  color: ${p => p.$accent};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: ${FONT_MONO};
  font-size: 10px;
`;
