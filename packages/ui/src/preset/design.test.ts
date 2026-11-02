import { describe, expect, it } from 'vitest';
import { type Design, design } from '../design';
import {
  type ColorTokens,
  fontFaces,
  fontStack,
  neutral,
  type Theme,
  themeVariables,
  toCss,
} from '../theme';
import { categorical, wash } from './colors/defaults';
import { createPreset, createRecipes, explicitScale } from './index';
import { createScale, scaleValuesFor } from '../grid';
import { createTypeSystem, STEPS, type StepName } from './type-scale';

const names = Object.keys(STEPS) as StepName[];

/** A design nothing in the code knows about: a 4px baseline and a major-third scale. */
const other: Design = {
  grid: { baseline: 4, unit: 8, root: 16 },
  type: { base: 16, ratio: 1.25, leading: { body: 1.5, falloff: 0.05, floor: 1.3 } },
  motion: { durations: { ...design.motion.durations } },
};

describe('design', () => {
  it('has a unit of two baselines', () => {
    expect(design.grid.unit).toBe(design.grid.baseline * 2);
    expect(other.grid.unit).toBe(other.grid.baseline * 2);
  });

  it('makes every spacing step its name times the baseline, for any grid', () => {
    for (const d of [design, other]) {
      const { ROOT_SIZE, BASELINE } = createScale(d);
      for (const [name, token] of Object.entries(scaleValuesFor(d))) {
        const px = Number.parseFloat(token.value) * ROOT_SIZE;
        expect(px, `${d.grid.baseline}px grid, spacing ${name}`).toBeCloseTo(
          Number(name) * BASELINE,
          2
        );
      }
    }
  });

  it('puts every line height on the baseline, for any design', () => {
    for (const d of [design, other]) {
      const scale = createTypeSystem(d);
      for (const name of names) {
        expect(scale.stepLineHeight(name) % d.grid.baseline, `${d.grid.baseline}px ${name}`).toBe(
          0
        );
      }
    }
  });

  it('builds a preset from a design', () => {
    const preset = createPreset(other);
    const tokens = (preset.theme?.tokens ?? {}) as Record<
      string,
      Record<string, { value: string }>
    >;
    expect(tokens.spacing?.['2']?.value).toBe('0.5rem');
    expect(tokens.fontSizes?.md?.value).toBe('1rem');
  });
});

describe('theme', () => {
  it('turns every palette entry and face into a CSS variable', () => {
    const vars = themeVariables(neutral);
    // 7 palette colors, 3 font stacks, and 4 type numbers for each of the 3 roles
    expect(Object.keys(vars)).toHaveLength(7 + 8 + 3);
    for (const value of Object.values(vars)) expect(value.length).toBeGreaterThan(0);
  });

  it('keeps a font stack valid when the app never sets its variable', () => {
    const css = themeVariables(neutral)['--ui-font-body'] ?? '';
    // the family and generic are the var()'s fallback, not siblings of it
    expect(css).toMatch(/^var\(--font-body, "Inter", sans-serif\)$/);
  });

  it("puts a face's fallbacks after its family, in order", () => {
    const face = {
      family: 'Univers',
      generic: 'sans-serif',
      fallbacks: ['ui-sans-serif', '"Segoe UI"', 'sans-serif'],
    } as const;
    expect(fontStack(face)).toBe('"Univers", ui-sans-serif, "Segoe UI", sans-serif');
    expect(fontStack({ ...face, cssVar: '--f' })).toBe(
      'var(--f, "Univers", ui-sans-serif, "Segoe UI", sans-serif)'
    );
  });

  it('writes CSS for a selector', () => {
    const css = toCss(neutral, '[data-theme="x"]');
    expect(css.startsWith('[data-theme="x"] {')).toBe(true);
    expect(css).toContain(`--ui-ink: ${neutral.palette.ink};`);
  });
});

/** A project's own scales: every role the components read, as plain light and dark values. */
const own = {
  canvas: { value: '{colors.gray.1}' },
  fg: {
    default: { value: '{colors.gray.12}' },
    muted: { value: '{colors.gray.11}' },
    subtle: { value: '{colors.gray.10}' },
    disabled: { value: '{colors.gray.8}' },
  },
  border: {
    DEFAULT: { value: '{colors.gray.7}' },
    muted: { value: '{colors.gray.5}' },
    emphasized: { value: '{colors.gray.9}' },
  },
  error: { value: '{colors.red.9}' },
  shadow: { value: '{colors.gray.a6}' },
  gray: { '1': { value: { base: '#fdfdfb', _dark: '#1c1c1b' } } },
  accent: { '9': { value: { base: '#2f4bff', _dark: '#7c90ff' } } },
  red: { '9': { value: { base: '#c23a3a', _dark: '#f07f7f' } } },
  success: { '9': { value: { base: '#2f7d4a', _dark: '#9ad3b0' } } },
  warning: { '9': { value: { base: '#9a6a12', _dark: '#ebc57a' } } },
  info: { '9': { value: { base: '#2f6fa8', _dark: '#9cc4e4' } } },
  secondary: { value: { base: '#8f6200', _dark: '#e8b44a' } },
  categorical,
  wash,
  hue: { '1': { value: { base: '#2f4bff', _dark: '#7c90ff' } } },
} satisfies ColorTokens;

const withColors: Theme = { name: 'own', faces: neutral.faces, colors: own };

describe('controls', () => {
  it('become height, padding and icon tokens for every size, from the design or the default', () => {
    const tokens = createPreset(other, neutral).theme?.tokens as Record<
      string,
      Record<string, unknown>
    >;
    for (const size of ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']) {
      expect(tokens.sizes?.control).toHaveProperty(size);
      expect(tokens.sizes?.controlIcon).toHaveProperty(size);
      expect(tokens.spacing?.controlPad).toHaveProperty(size);
    }
  });

  it("take the design's own sizes, in baselines", () => {
    const design = { ...other, controls: { md: { height: 10, padX: 3.5, icon: 5 } } };
    const tokens = createPreset(design, neutral).theme?.tokens as {
      sizes: { control: { md: { value: string } } };
    };
    // a 4px baseline: ten baselines is 40px, 2.5rem
    expect(tokens.sizes.control.md.value).toBe('2.5rem');
  });
});

describe('theme colors', () => {
  const semantic = (theme: Theme) =>
    (createPreset(other, theme).theme?.semanticTokens ?? {}).colors as Record<string, unknown>;

  it("plugs a project's own scales in as they are, extra keys included", () => {
    const colors = semantic(withColors);
    expect(colors.gray).toBe(own.gray);
    expect(colors.accent).toBe(own.accent);
    expect(colors.hue).toBe(own.hue);
  });

  it('generates the scales from the palette when a theme has no colors', () => {
    const colors = semantic(neutral);
    expect(Object.keys(colors)).toEqual(expect.arrayContaining(['gray', 'accent', 'brand', 'red']));
    expect(colors.hue).toBeUndefined();
  });

  it('sets no palette variables for a theme without a palette', () => {
    const vars = themeVariables(withColors);
    expect(Object.keys(vars)).toHaveLength(3);
    expect(vars['--ui-ink']).toBeUndefined();
  });

  it('keeps the palette variables when a theme has both', () => {
    const vars = themeVariables({ ...withColors, palette: neutral.palette });
    expect(vars['--ui-ink']).toBe(neutral.palette.ink);
    expect(Object.keys(vars)).toHaveLength(7 + 8 + 3);
  });

  it('names every missing role', () => {
    const { canvas: _canvas, ...rest } = own;
    const broken = { ...rest, fg: { default: own.fg.default } } as unknown as ColorTokens;
    expect(() =>
      createPreset(other, { name: 'broken', faces: neutral.faces, colors: broken })
    ).toThrow(/Theme "broken" colors are missing: canvas, fg\.muted, fg\.subtle, fg\.disabled/);
  });

  it('refuses a theme with no way to make colors', () => {
    const empty = { name: 'empty', faces: neutral.faces } as unknown as Theme;
    expect(() => createPreset(other, empty)).toThrow(/needs a palette or colors/);
  });
});

describe('explicit scales', () => {
  const light = Array.from({ length: 12 }, (_, i) => `#${String(i + 1).padStart(2, '0')}0000`);
  const dark = [...light].reverse();
  const roles = { solid: 9, solidHover: 10, solidFg: { base: '#fff', _dark: '#000' }, text: 11 };

  it('has the 12 steps, the 12 alpha steps and the Park UI variants', () => {
    const scale = explicitScale('brand', { light, dark, ...roles }) as Record<string, unknown>;
    for (let i = 1; i <= 12; i += 1) {
      expect(scale[String(i)], `step ${i}`).toBeDefined();
      expect(scale[`a${i}`], `alpha ${i}`).toBeDefined();
    }
    for (const group of ['solid', 'subtle', 'surface', 'outline', 'plain']) {
      expect(scale[group], group).toBeDefined();
    }
    expect(scale['3']).toEqual({ value: { base: '#030000', _dark: '#100000' } });
  });

  it('uses the alpha steps it is given, and mixes them from step 12 when it is not', () => {
    const alpha = { light: light.map((c) => `${c}80`), dark: dark.map((c) => `${c}80`) };
    const given = explicitScale('brand', { light, dark, alpha, ...roles }) as unknown as Record<
      string,
      { value: { base: string } }
    >;
    expect(given.a1?.value.base).toBe('#01000080');
    const mixed = explicitScale('brand', { light, dark, ...roles }) as unknown as Record<
      string,
      { value: { base: string } }
    >;
    expect(mixed.a1?.value.base).toContain('color-mix(in oklab, #120000');
  });

  it('names a scale that does not have 12 steps', () => {
    expect(() => explicitScale('brand', { light: light.slice(1), dark, ...roles })).toThrow(
      /Scale "brand" light has 11 entries, not 12/
    );
  });

  it('keeps a keyword family unquoted in a font stack', () => {
    expect(
      fontStack({ family: 'ui-monospace', generic: 'monospace', fallbacks: ['Menlo', 'monospace'] })
    ).toBe('ui-monospace, Menlo, monospace');
    expect(fontStack({ family: 'Life LT Std', generic: 'serif' })).toBe('"Life LT Std", serif');
  });
});

describe("a project's own recipes and global styles", () => {
  const own = {
    recipes: { onlyMine: { className: 'only-mine', base: { color: 'red' } } },
    slotRecipes: {},
  };

  it("adds its recipes to the system's, and a recipe named like one of the system's replaces it", () => {
    const preset = createPreset(other, neutral, { recipes: () => own });
    const theme = preset.theme?.extend as { recipes?: Record<string, unknown> };
    const names = Object.keys(theme.recipes ?? {});
    expect(names).toContain('onlyMine');
    expect(names).toContain('button');
  });

  it('hands the recipes the type system of the design', () => {
    let seen: number | undefined;
    createPreset(other, neutral, {
      recipes: (type) => {
        seen = type.stepLineHeight('md');
        return own;
      },
    });
    expect(seen).toBe(24);
  });

  it("uses its own global styles and still sets the theme's variables", () => {
    const preset = createPreset(other, neutral, { globalCss: { body: { color: 'red' } } });
    const css = (preset.globalCss?.extend ?? {}) as Record<string, unknown>;
    expect(Object.keys(css)).toEqual(['body', ':root']);
  });

  it("keeps the system's own when it is given none", () => {
    const theme = createPreset(other).theme?.extend as { recipes?: Record<string, unknown> };
    expect(Object.keys(theme.recipes ?? {})).toEqual(
      Object.keys(createRecipes(createTypeSystem(other)).recipes)
    );
  });
});

describe('font faces', () => {
  const faces = {
    ...neutral.faces,
    display: {
      ...neutral.faces.display,
      family: 'Life',
      files: [
        { file: 'life-regular.woff2', weight: 400 },
        { file: 'life-italic.woff2', weight: 400, style: 'italic' },
      ],
    },
    body: {
      ...neutral.faces.body,
      family: 'Univers',
      files: [{ file: 'univers-bold.woff', weight: 700 }],
    },
  } as const;
  const themed: Theme = { ...neutral, faces };

  it('declares each family once with a rule per file, at the URL the app chooses', () => {
    const rules = fontFaces(themed, (file) => `../fonts/${file}`);
    expect(Object.keys(rules)).toEqual(['Life', 'Univers']);
    expect(rules.Life).toEqual([
      {
        src: 'url(../fonts/life-regular.woff2) format("woff2")',
        fontWeight: 400,
        fontStyle: 'normal',
        fontDisplay: 'swap',
      },
      {
        src: 'url(../fonts/life-italic.woff2) format("woff2")',
        fontWeight: 400,
        fontStyle: 'italic',
        fontDisplay: 'swap',
      },
    ]);
    expect(rules.Univers?.[0]?.src).toBe('url(../fonts/univers-bold.woff) format("woff")');
  });

  it('declares nothing for faces without files, and a shared family once', () => {
    expect(fontFaces(neutral, (file) => file)).toEqual({});
    const shared: Theme = { ...themed, faces: { ...faces, body: { ...faces.display } } };
    expect(Object.keys(fontFaces(shared, (file) => file))).toEqual(['Life']);
  });
});
