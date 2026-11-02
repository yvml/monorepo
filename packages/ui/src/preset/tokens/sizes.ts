import { defineTokens } from '@pandacss/dev';
import { type Design, design } from '../../design';
import { controlsFor, createScale, scaleValuesFor } from '../../grid';
import { withOverrides } from './overrides';

/**
 * Sizes: the spacing scale (for control heights, icons and boxes) plus named widths for layout and dialogs. The
 * named widths are horizontal measures, so they are on the 10px scale but not tied to the vertical rhythm.
 */
export const sizesFor = (d: Pick<Design, 'grid' | 'controls' | 'sizes'>) => {
  const { rem, baselines } = createScale(d);
  const controls = Object.entries(controlsFor(d));
  const defaults = {
    ...scaleValuesFor(d),
    /** The height of each control size, and the minimum width of an icon-only control. */
    control: Object.fromEntries(
      controls.map(([size, c]) => [size, { value: baselines(c.height) }])
    ),
    /** The icon beside the label at each control size. */
    controlIcon: Object.fromEntries(
      controls.map(([size, c]) => [size, { value: baselines(c.icon) }])
    ),
    /** The side of a round portrait, in whole baselines so it never moves what is under it off the grid. */
    avatar: {
      sm: { value: baselines(10) },
      md: { value: baselines(16) },
      lg: { value: baselines(40) },
    },
    xs: { value: rem(320) },
    sm: { value: rem(380) },
    md: { value: rem(440) },
    lg: { value: rem(500) },
    xl: { value: rem(560) },
    '2xl': { value: rem(640) },
    '3xl': { value: rem(760) },
    '4xl': { value: rem(900) },
    '5xl': { value: rem(1060) },
    '6xl': { value: rem(1200) },
    '7xl': { value: rem(1360) },
    /** The full width or height of the parent. */
    full: { value: '100%' },
    /** The widest the content column gets, side inset included. */
    site: { value: rem(1280) },
    /** The shortest the header bar gets. */
    bar: { value: rem(64) },
    /** The readable line length of running text. */
    prose: { value: '65ch' },
    /** The page's centered inset. */
    inset: { value: rem(1120) },
    narrow: { value: '60ch' },
    /** The ideal column width of a column list. */
    column: { value: '22rem' },
    /** The ideal column width of a stacked list of names. */
    name: { value: '12rem' },
    /** The minimum width of the side column in the overview layout. */
    aside: { value: '16rem' },
    /** The minimum width of the label column in a term list. */
    label: { value: '8rem' },
    /** The largest a cover image grows. */
    cover: { value: '28rem' },
    /** The square plate in an expandable row. */
    plate: { value: '4rem' },
    /** The shortest a label tile gets. */
    tile: { value: '8rem' },
    /** The tallest a scrolling list gets: a drawer's items or a list of names. */
    scrollList: { value: '14rem' },
    /** The diameter of a status dot. */
    dot: { value: '0.5rem' },
    /** The widest the signed-in institution's name may be in the header before it is cut off. */
    institution: { value: '12rem' },
    /** The widest a breadcrumb's current page may be before it is cut off. */
    crumb: { value: '60vw' },
    /** The shortest the landscape editorial hero gets. */
    hero: { value: '20rem' },
    /** The shortest the landscape editorial hero gets on phones. */
    heroTall: { value: '22.5rem' },
    /** The width of the art in the portrait editorial hero. */
    heroArt: { value: '22.5rem' },
    /** The height of the header's utility row, hairline included. The sticky header hides exactly this much. */
    utility: { value: '2.5rem' },
    /** The shortest the header's wordmark row gets on phones. */
    barCompact: { value: '3.5rem' },
    /** The side of a small icon beside text, such as the institution chip's building. */
    glyph: { value: '1.25rem' },
    /** The side of the search icon, and on phones. */
    searchIcon: { value: '1.75rem' },
    searchIconCompact: { value: '1.5rem' },
    /** The width of the label combobox's input and of its list. */
    combo: { value: '13.75rem' },
    comboList: { value: '20rem' },
    /** The shortest a spotlight card gets. */
    card: { value: '15rem' },
    /** The shortest a label tile gets on phones. */
    tileCompact: { value: '7rem' },
    /** The cover plate's side on phones. */
    plateCompact: { value: '3.5rem' },
    /** The date column of an event row, and on phones. */
    dateColumn: { value: '6rem' },
    dateColumnCompact: { value: '4rem' },
    /** The side of the chevron on an expandable row. */
    chevron: { value: '0.5rem' },
    /** The side of the search keycap and clear button targets. */
    halo: { value: '0.1875rem' },
    /** The side of an icon in the utility row. */
    glyphSm: { value: '1rem' },
    /** The width of the info page sidebar. */
    sidebar: { value: '14rem' },
    /** Info page article column: 72ch at the 17px long-form size (694px in Rev 19). */
    article: { value: '43.375rem' },
    /** The width of the term column of a key-value list. */
    term: { value: '10rem' },
    /** The side of a letter key on phones. */
    keyCompact: { value: '2.25rem' },
    /** The side of a square control such as the theme button. */
    squareControl: { value: '2.5rem' },
    /** The height of the player bar, which the queue panel sits above. */
    player: { value: '4.5rem' },
    /** The tallest the queue panel grows. */
    panel: { value: '50vh' },
    /** The widest the now-playing title may be. */
    now: { value: '17.5rem' },
    /** The width of the volume slider. */
    slider: { value: '5rem' },
    /** The width of a narrow form such as sign-in. */
    form: { value: '22.5rem' },
  };
  return defineTokens.sizes(withOverrides('sizes', defaults, d.sizes));
};

export const sizes = sizesFor(design);
