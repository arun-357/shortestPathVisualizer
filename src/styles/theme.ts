export const FONT_SANS = "'IBM Plex Sans', system-ui, sans-serif";
export const FONT_MONO = "'IBM Plex Mono', ui-monospace, monospace";
export const FONT_SERIF = "'Newsreader', Georgia, serif";

export interface Theme {
  bg: string;
  panel: string;
  panelAlt: string;
  raised: string;
  hairline: string;
  hairlineSoft: string;
  divider: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
  accentSoft: string;
  accentEdge: string;
  amber: string;
  amberSoft: string;
  green: string;
  greenSoft: string;
  pink: string;
  cellUnvisited: string;
  cellWall: string;
  cellWallEdge: string;
  cellFrontier: string;
  cellFrontierEdge: string;
  cellVisited: string;
  cellVisitedDeep: string;
  cellCurrent: string;
  cellPath: string;
  gridLine: string;
  gridBg: string;
  shadow: string;
  shadowLg: string;
  isDark: boolean;
}

export const darkTheme: Theme = {
  bg: '#0a0d12',
  panel: '#10141c',
  panelAlt: 'rgba(13,17,24,0.5)',
  raised: '#161b25',
  hairline: '#1c2230',
  hairlineSoft: '#161b25',
  divider: '#1a2030',
  text: '#e6ecf5',
  textMuted: '#8a94a6',
  textDim: '#5a6276',
  accent: 'oklch(0.72 0.13 220)',
  accentSoft: 'oklch(0.72 0.13 220 / 0.18)',
  accentEdge: 'oklch(0.72 0.13 220 / 0.45)',
  amber: 'oklch(0.78 0.14 65)',
  amberSoft: 'oklch(0.78 0.14 65 / 0.22)',
  green: 'oklch(0.78 0.15 155)',
  greenSoft: 'oklch(0.78 0.15 155 / 0.22)',
  pink: 'oklch(0.7 0.16 0)',
  cellUnvisited: 'transparent',
  cellWall: '#1f2738',
  cellWallEdge: '#283042',
  cellFrontier: 'oklch(0.72 0.13 220 / 0.35)',
  cellFrontierEdge: 'oklch(0.72 0.13 220 / 0.75)',
  cellVisited: 'oklch(0.42 0.07 220 / 0.55)',
  cellVisitedDeep: 'oklch(0.32 0.06 220 / 0.7)',
  cellCurrent: 'oklch(0.78 0.14 65)',
  cellPath: 'oklch(0.78 0.15 155)',
  gridLine: '#161b26',
  gridBg: '#0c1018',
  shadow: '0 1px 0 rgba(255,255,255,.03), 0 1px 2px rgba(0,0,0,.4)',
  shadowLg: '0 24px 48px -16px rgba(0,0,0,.6), 0 8px 16px -8px rgba(0,0,0,.5)',
  isDark: true,
};

export const lightTheme: Theme = {
  bg: '#faf9f5',
  panel: '#ffffff',
  panelAlt: '#fbfaf6',
  raised: '#ffffff',
  hairline: '#e6e3da',
  hairlineSoft: '#efece4',
  divider: '#e6e3da',
  text: '#1c1f26',
  textMuted: '#5c6370',
  textDim: '#9099a8',
  accent: 'oklch(0.52 0.16 220)',
  accentSoft: 'oklch(0.52 0.16 220 / 0.10)',
  accentEdge: 'oklch(0.52 0.16 220 / 0.45)',
  amber: 'oklch(0.62 0.18 60)',
  amberSoft: 'oklch(0.62 0.18 60 / 0.18)',
  green: 'oklch(0.55 0.18 155)',
  greenSoft: 'oklch(0.55 0.18 155 / 0.18)',
  pink: 'oklch(0.55 0.2 0)',
  cellUnvisited: 'transparent',
  cellWall: '#21262e',
  cellWallEdge: '#2c313b',
  cellFrontier: 'oklch(0.52 0.16 220 / 0.18)',
  cellFrontierEdge: 'oklch(0.52 0.16 220 / 0.6)',
  cellVisited: 'oklch(0.82 0.07 220 / 0.65)',
  cellVisitedDeep: 'oklch(0.72 0.1 220 / 0.7)',
  cellCurrent: 'oklch(0.62 0.18 60)',
  cellPath: 'oklch(0.55 0.18 155)',
  gridLine: '#ebe8df',
  gridBg: '#fbfaf6',
  shadow: '0 1px 0 rgba(255,255,255,.6), 0 1px 2px rgba(0,0,0,.06)',
  shadowLg: '0 24px 48px -16px rgba(0,0,0,.18), 0 8px 16px -8px rgba(0,0,0,.12)',
  isDark: false,
};
