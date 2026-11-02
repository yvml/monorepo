import ibmPlexMono from '@capsizecss/metrics/iBMPlexMono';
import inter from '@capsizecss/metrics/inter';
import type { Theme } from './types';

/**
 * A neutral theme: gray ink on warm white, a blue accent, Inter for titles and text and IBM Plex Mono for data. It is
 * the default of `createPreset`, so the machinery runs without any brand. A project supplies its own `Theme` with the
 * same shape.
 */
export const neutral = {
  name: 'neutral',
  palette: {
    ink: '#16181D',
    paper: '#F7F7F4',
    line: '#D3D4CE',
    accent: '#2F5FD0',
    accentSoft: '#9DB8F2',
    danger: '#C0392B',
    dangerSoft: '#F1A79E',
  },
  faces: {
    display: { family: 'Inter', generic: 'sans-serif', metrics: inter, cssVar: '--font-display' },
    body: { family: 'Inter', generic: 'sans-serif', metrics: inter, cssVar: '--font-body' },
    mono: {
      family: 'IBM Plex Mono',
      generic: 'monospace',
      metrics: ibmPlexMono,
      cssVar: '--font-mono',
    },
  },
} as const satisfies Theme;
