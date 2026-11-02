import { describe, expect, it } from 'vitest';
import { design } from '../design';
import { neutral, xHeightAdjust } from '../theme';
import { createRecipes } from './recipes';
import { createScale, scaleValuesFor } from '../grid';
import {
  BASE_SIZE,
  createTypeSystem,
  MIN_LEADING,
  RATIO,
  STEPS,
  type StepName,
  stepLineHeight,
  stepSize,
  textSize,
  textTrim,
} from './type-scale';

const { recipes, slotRecipes } = createRecipes(createTypeSystem(design));

const names = Object.keys(STEPS) as StepName[];
const { BASELINE, ROOT_SIZE } = createScale(design);
const scaleValues = scaleValuesFor(design);
const px = (rem: string) => Number.parseFloat(rem) * ROOT_SIZE;

describe('type scale', () => {
  it('is a minor third from a 16px body', () => {
    expect(BASE_SIZE).toBe(16);
    expect(RATIO).toBe(1.2);
    expect(stepSize('md')).toBe(16);
    for (let i = 1; i < names.length; i++) {
      const prev = names[i - 1] as StepName;
      const next = names[i] as StepName;
      expect(stepSize(next) / stepSize(prev)).toBeCloseTo(RATIO, 10);
    }
  });

  it('puts every line height on the 5px baseline', () => {
    for (const name of names) {
      expect(stepLineHeight(name) % BASELINE, name).toBe(0);
    }
  });

  it('keeps leading between the minimum and 1.6', () => {
    for (const name of names) {
      const leading = stepLineHeight(name) / stepSize(name);
      expect(leading, name).toBeGreaterThanOrEqual(MIN_LEADING);
      expect(leading, name).toBeLessThanOrEqual(1.6);
    }
  });

  it('gives every face the same line height at the same step', () => {
    for (const name of names) {
      const heights = (['display', 'body', 'mono'] as const).map((face) =>
        px(String(textSize(face, name).lineHeight))
      );
      expect(new Set(heights).size, name).toBe(1);
      expect(heights[0]! % BASELINE, name).toBe(0);
    }
  });

  it('matches x-heights to the body face', () => {
    const { body, display, mono } = neutral.faces;
    expect(xHeightAdjust(body.metrics, body.metrics)).toBe(1);
    expect(xHeightAdjust(body.metrics, display.metrics)).toBeGreaterThan(0.5);
    expect(xHeightAdjust(body.metrics, mono.metrics)).toBeGreaterThan(0.5);
  });

  it('trims every face and step above and below', () => {
    for (const face of ['display', 'body', 'mono'] as const) {
      for (const name of names) {
        const css = textTrim(face, name) as Record<string, Record<string, string>>;
        expect(css['&::before']?.marginBottom, `${face} ${name}`).toMatch(/^-?[\d.]+rem$/);
        expect(css['&::after']?.marginTop, `${face} ${name}`).toMatch(/^-?[\d.]+rem$/);
      }
    }
  });
});

describe('spacing scale', () => {
  it("is Park UI's ladder, each step its name times the 5px baseline", () => {
    for (const [name, { value }] of Object.entries(scaleValues)) {
      expect(px(value), name).toBeCloseTo(Number(name) * BASELINE, 1);
    }
  });

  it('puts even whole tokens on the 10px scale and odd whole tokens on the 5px half step', () => {
    for (const name of Object.keys(scaleValues).filter((key) => Number.isInteger(Number(key)))) {
      const size = Number(name) * BASELINE;
      expect(size % (name === '0' || Number(name) % 2 === 0 ? 10 : 5), name).toBe(0);
    }
  });
});

describe('recipes', () => {
  // `1rem` is the unit that turns a unitless size into rem inside the generated calc().
  const ALLOWED = new Set(['1px', '-1px', '2px', '0px', '0.5px', '1rem']);
  // Font sizes and line heights come from the type scale through `textSize`, never typed by hand. So does every length
  // the baseline functions work out from the face metrics (shifts, trims, offsets), so those are allowed too.
  const t = createTypeSystem(design);
  const box = { height: 'token(sizes.5)', items: false };
  for (const face of ['display', 'body', 'mono'] as const) {
    for (const name of names) {
      const { fontSize, lineHeight } = textSize(face, name);
      ALLOWED.add(String(fontSize));
      ALLOWED.add(String(lineHeight));
      const generated = JSON.stringify([
        t.textTrim(face, name),
        t.lineShift(face, name),
        t.lineMargins(face, name),
        t.lineRelative(face, name),
        t.lineCentered(face, name, box),
        t.linePadded(face, name, { block: 'token(spacing.2)' }),
      ]);
      for (const match of generated.matchAll(/-?\d*\.?\d+(?:px|rem)\b/g)) ALLOWED.add(match[0]);
    }
  }
  for (const match of JSON.stringify(t.lineShift('body', 'lg', 7 * BASELINE)).matchAll(
    /-?\d*\.?\d+(?:px|rem)\b/g
  ))
    ALLOWED.add(match[0]);

  it('use no literal px or rem lengths outside the allow-list', () => {
    const found = new Set<string>();
    const source = JSON.stringify({ recipes, slotRecipes });
    for (const match of source.matchAll(/-?\d*\.?\d+(?:px|rem)\b/g)) {
      if (!ALLOWED.has(match[0])) found.add(match[0]);
    }
    expect([...found]).toEqual([]);
  });
});
