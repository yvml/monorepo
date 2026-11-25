// apps/web/src/components/home/materials.ts
import type { CSSProperties } from 'react';

const PAPER = '#ece8e1';
const WARM_BLACK = '#17130f';

/** Each material's text colour in light and dark, from DESIGN.md. */
const MATERIALS: Record<string, readonly [string, string]> = {
  Ceramics: ['#b83a20', '#ff8a5c'],
  'Earth building': ['#8a5a14', '#e5a63a'],
  'Fiber arts': ['#b02a6b', '#ff7fb8'],
  Glass: ['#087283', '#3fd6ea'],
  'Landscape & ecology': ['#36701a', '#8fe05a'],
  Leatherwork: ['#8c3a1e', '#e08a5a'],
  'Metal casting': ['#bf2f2a', '#ff7a6e'],
  Metalwork: ['#2f55c4', '#8aa8ff'],
  Printmaking: ['#6a3fc0', '#b79bff'],
  'Professional development': ['#2b6b5a', '#5fd9b5'],
  Sculpture: ['#9a3a8e', '#e88ad8'],
  'Stone carving': ['#5b6470', '#a9b4c2'],
};

/** The studio's material names that the design's table calls something else. */
const ALIASES: Record<string, string> = {
  Steel: 'Metalwork',
  Leather: 'Leatherwork',
  Fabric: 'Fiber arts',
  Adobe: 'Earth building',
  'PETG plates': 'Printmaking',
};

const channels =(hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

/** A hex colour `amount` of the way from `base` to `colour`. */
function mix(colour: string, base: string, amount: number) {
  const [from, to] = [channels(colour), channels(base)];
  const out = from.map((value, i) => Math.round(value * amount + (to[i] ?? 0) * (1 - amount)));
  return `#${out.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * The custom properties that give an element a material's colours; the home styles read them with `[data-m]`.
 *
 * @param name - the material's name in English.
 * @returns the properties, or nothing for a material the table does not have.
 */
export function materialStyle(name: string): CSSProperties | undefined {
  const pair = MATERIALS[ALIASES[name] ?? name];
  if (!pair) return undefined;
  const [light, dark] = pair;
  return {
    '--m': light,
    '--m-dk': dark,
    '--t': mix(light, PAPER, 0.22),
    '--t-dk': mix(dark, WARM_BLACK, 0.26),
  } as CSSProperties;
}
