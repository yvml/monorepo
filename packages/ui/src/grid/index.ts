/**
 * The grid: the one place that defines how things line up.
 *
 * - `definition`: the grid's numbers and the rem converters.
 * - `controls`, `spacing`: the spacing scale and control sizes, every one a whole number of baselines.
 * - `lines`: putting the baseline of text on a grid line (shift, margins, centered, padded, trim).
 * - `rules`: rules and outlines that take no space.
 * - `overlay`: the graph-paper overlay.
 * - `check/`: the script that measures a live page. See `README.md`.
 */
export { type ControlSize, type ControlStyle, defaultControls } from './controls';
export { createScale, defaultGrid, type Grid, round } from './definition';
export {
  type CenteredBox,
  centeredLine,
  type Line,
  lineMargins,
  lineRelative,
  lineShift,
  measureLine,
  type Metrics,
  paddedLine,
  type Style,
  trim,
  type Units,
} from './lines';
export { gridOverlay } from './overlay';
export { createRules, type RuleTokens } from './rules';
export { controlsFor, scaleValuesFor, spacingFor } from './spacing';
