'use client';
import { Tooltip } from '@ark-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { createStyleContext } from '../../styled-system/jsx';
import { tooltip } from '../../styled-system/recipes';

const { withRootProvider, withContext } = createStyleContext(tooltip);

export type RootProps = ComponentProps<typeof Root>;
export const Root = withRootProvider(Tooltip.Root, {
  defaultProps: { unmountOnExit: true, lazyMount: true, openDelay: 300, closeDelay: 100 },
});
export const RootProvider = withRootProvider(Tooltip.RootProvider, {
  defaultProps: { unmountOnExit: true, lazyMount: true },
});
export const ArrowTip = withContext(Tooltip.ArrowTip, 'arrowTip');
export const Arrow = withContext(Tooltip.Arrow, 'arrow', {
  defaultProps: { children: <ArrowTip /> },
});
export const Content = withContext(Tooltip.Content, 'content');
export const Positioner = withContext(Tooltip.Positioner, 'positioner');
export const Trigger = withContext(Tooltip.Trigger, 'trigger');

export { TooltipContext as Context } from '@ark-ui/react/tooltip';
