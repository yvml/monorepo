/** The sizes a control (button, input, select, tab) comes in. */
export type ControlSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** One size of a control, in baselines (so it scales with the grid). Half baselines are allowed. */
export type ControlStyle = {
  /** The height, and the minimum width of an icon-only control. */
  height: number;
  /** The padding at each side. */
  padX: number;
  /** The icon beside the label. */
  icon: number;
};

/** The control sizes of the default design, in baselines: one baseline taller at each step. */
export const defaultControls = {
  '2xs': { height: 5, padX: 2, icon: 3 },
  xs: { height: 6, padX: 2, icon: 3 },
  sm: { height: 7, padX: 3, icon: 3 },
  md: { height: 8, padX: 3, icon: 4 },
  lg: { height: 9, padX: 4, icon: 4 },
  xl: { height: 10, padX: 4, icon: 5 },
  '2xl': { height: 12, padX: 6, icon: 6 },
} as const satisfies Record<ControlSize, ControlStyle>;
