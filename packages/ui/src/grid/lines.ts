/**
 * Lines of text on a baseline grid.
 *
 * A browser draws the first baseline of a line at a fixed distance below the top of its line box, and that distance
 * depends on the font and the size. These functions work that distance out in JavaScript from the font's own metrics, then
 * return the style that moves the line so the baseline falls on a grid line while the box keeps its size. The styles hold
 * plain lengths, not `calc()` over font variables, so the generated CSS stays short. They return style objects; nothing
 * here knows about a framework, a design or a token system.
 *
 * The distance is the plain arithmetic the font's metrics imply: the baseline sits half of the leftover line height
 * below the top. Engines round ascent and descent differently (Chrome to whole pixels, WebKit not at all), so this middle
 * estimate leaves a baseline within about a pixel of its line in Chrome and Firefox and within half a pixel in WebKit;
 * box heights and spacing are exact everywhere.
 */

/** A style object: CSS properties and nested selectors, for any CSS-in-JS tool. */
export type Style = Record<string, unknown>;

/** A face's vertical metrics, each as a fraction of the font size (em). */
export type Metrics = {
  /** The distance from the baseline up to the top of the line the font wants. */
  ascent: number;
  /** The distance from the baseline down to the bottom of the line, as a positive number. */
  descent: number;
  /** The height of the capitals. */
  capHeight: number;
};

/** One line of text, in px. */
export type Line = {
  /** The line height. */
  height: number;
  /** The distance from the top of the line box to the first baseline. */
  offset: number;
  /** The height of the capitals at this size. */
  cap: number;
};

/** The grid row in px and how to write a length, so the styles come out in the project's own unit (rem, for one). */
export type Units = {
  /** One baseline, in px. */
  row: number;
  /** Writes a length in px as CSS. */
  length: (px: number) => string;
};

/**
 * Where the first baseline of a line of this face at this size falls, as plain arithmetic on the metrics.
 *
 * @param size - the font size in px.
 * @param height - the line height in px.
 * @param face - the face's metrics.
 * @returns the line.
 */
export function measureLine(size: number, height: number, face: Metrics): Line {
  const ascent = face.ascent * size;
  const descent = face.descent * size;
  return {
    height,
    offset: (height + ascent - descent) / 2,
    cap: face.capHeight * size,
  };
}

/** How far the first baseline must move to reach the nearest grid line (negative moves it up). */
const snapDistance = (line: Line, row: number) => Math.round(line.offset / row) * row - line.offset;

/** `calc(-1 * x)` for a length, written as the length itself. */
const negate = (px: number, units: Units) => units.length(px === 0 ? 0 : -px);

/**
 * Puts the first baseline of a block of text on a grid line without changing its height or its box: the line is moved by
 * a margin on `::before` and the opposite margin on `::after`. For a block whose text is its own, not a flex or grid
 * container (whose pseudo-elements would become items). The block must start on a grid line.
 *
 * @param line - the line.
 * @param units - the grid row and length writer.
 * @returns the style.
 */
export function lineShift(line: Line, units: Units): Style {
  const shift = snapDistance(line, units.row);
  return {
    '&::before': { content: '""', display: 'table', marginBottom: units.length(shift) },
    '&::after': { content: '""', display: 'table', marginTop: negate(shift, units) },
  };
}

/**
 * The same shift as margins on the element itself, for an item of a flex or grid container (whose margins never collapse)
 * and for text that clips with an ellipsis, which pseudo-elements would break. It moves the item's box too, so not for
 * text inside a box with its own background or border.
 *
 * @param line - the line.
 * @param units - the grid row and length writer.
 * @returns the style.
 */
export function lineMargins(line: Line, units: Units): Style {
  const shift = snapDistance(line, units.row);
  return { marginBlockStart: units.length(shift), marginBlockEnd: negate(shift, units) };
}

/**
 * Trims a block to the space between the top of its capitals and its baseline, so padding is measured from the letters.
 * With `snap` the block is rounded up to whole rows, with the space added above the capitals, so the baseline sits on a
 * grid line and the next block starts on one. For a block box only.
 *
 * @param line - the line.
 * @param units - the grid row and length writer.
 * @param snap - whether to round the trimmed height up to whole rows.
 * @returns the style.
 */
export function trim(line: Line, units: Units, snap: boolean): Style {
  const height = snap ? Math.ceil(line.cap / units.row - 1e-6) * units.row : line.cap;
  return {
    '&::before': {
      content: '""',
      display: 'table',
      marginBottom: units.length(height - line.offset),
    },
    '&::after': {
      content: '""',
      display: 'table',
      marginTop: units.length(line.offset - line.height),
    },
  };
}

/**
 * The same shift by moving the element with `position: relative`, for a block that can use neither pseudo-elements (a
 * disclosure summary, whose marker the browsers lay out differently) nor margins (that could collapse). Its box keeps its place
 * in the layout, so only for text with no background or border of its own.
 *
 * @param line - the line.
 * @param units - the grid row and length writer.
 * @returns the style.
 */
export function lineRelative(line: Line, units: Units): Style {
  return { position: 'relative', insetBlockStart: units.length(snapDistance(line, units.row)) };
}

/** The fixed height of a box that centers one line of text, and the edges inside it that take space. */
export type CenteredBox = {
  /** The height of the box, border box included, as a CSS length (a token, for one). */
  height: string;
  /** A border or padding at the top that the text is centered below. Defaults to none. */
  top?: string;
  /** The same at the bottom. */
  bottom?: string;
  /**
   * The box also holds an icon or other items that the browser keeps centered. The text then moves with them, by unequal
   * padding that shifts the whole centered content, instead of being placed from the top.
   */
  items?: boolean;
};

/**
 * Puts the first baseline of one line of text on the grid line nearest to where centering it in a fixed-height box would
 * put it. The text is placed by padding from the top of the box, not by the browser's centering, which browsers round in
 * different ways, and the box keeps its size. For text-only controls, tabs and badges; text beside an icon needs its own
 * slot and `lineMargins`. The box's own lengths are CSS (tokens), so the result is a short `calc()` over them.
 *
 * @param line - the line.
 * @param units - the grid row and length writer.
 * @param box - the box's height and the edges inside it.
 * @returns the style.
 */
export function centeredLine(line: Line, units: Units, box: CenteredBox): Style {
  const top = box.top ?? '0px';
  const bottom = box.bottom ?? '0px';
  const row = units.length(units.row);
  const offset = units.length(line.offset);
  const centered = `calc(${top} + (${box.height} - ${top} - ${bottom} - ${units.length(line.height)}) / 2 + ${offset})`;
  if (box.items) {
    const shift = `calc(round(nearest, ${centered}, ${row}) - ${centered})`;
    return {
      paddingBlockStart: `max(0px, calc(2 * ${shift}))`,
      paddingBlockEnd: `max(0px, calc(-2 * ${shift}))`,
    };
  }
  return {
    alignItems: 'flex-start',
    paddingBlockStart: `max(0px, calc(round(nearest, ${centered}, ${row}) - ${top} - ${offset}))`,
    paddingBlockEnd: '0px',
  };
}

/**
 * Puts the first baseline of text on a grid line in a box whose height comes from its own padding (an auto-height box with
 * `padding-block`), by moving the same amount of padding from below to above or the reverse. The box keeps its height. The
 * padding must be at least half a row on both sides.
 *
 * @param line - the line.
 * @param units - the grid row and length writer.
 * @param padding - the padding above and below the text as set, and a border above it that takes space (CSS lengths).
 * @returns the style.
 */
export function paddedLine(
  line: Line,
  units: Units,
  padding: { block: string; border?: string }
): Style {
  const row = units.length(units.row);
  const natural = `calc(${padding.border ?? '0px'} + ${padding.block} + ${units.length(line.offset)})`;
  const shift = `calc(round(nearest, ${natural}, ${row}) - ${natural})`;
  return {
    paddingBlockStart: `calc(${padding.block} + ${shift})`,
    paddingBlockEnd: `calc(${padding.block} - ${shift})`,
  };
}
