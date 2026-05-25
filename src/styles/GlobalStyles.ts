import { createGlobalStyle } from 'styled-components';
import { FONT_MONO, FONT_SANS } from './theme';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    overflow: hidden;
    font-family: ${FONT_SANS};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
  }

  button { cursor: pointer; font-family: inherit; }
  select { font-family: inherit; }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }

  @keyframes frontier-pulse {
    0%   { box-shadow: inset 0 0 0 1px var(--fe, transparent), 0 0 0 0 var(--fe, transparent); }
    60%  { box-shadow: inset 0 0 0 1px var(--fe, transparent), 0 0 6px 2px var(--fe, transparent); }
    100% { box-shadow: inset 0 0 0 1px var(--fe, transparent), 0 0 0 0 var(--fe, transparent); }
  }

  @keyframes current-glow {
    0%, 100% { box-shadow: inset 0 0 0 1.5px var(--c, transparent), 0 0 0 0 var(--c-soft, transparent); }
    50%       { box-shadow: inset 0 0 0 1.5px var(--c, transparent), 0 0 12px 3px var(--c-soft, transparent); }
  }

  @keyframes path-appear {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes slide-up {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.hairline};
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.textDim};
  }

  code, pre { font-family: ${FONT_MONO}; }
`;
