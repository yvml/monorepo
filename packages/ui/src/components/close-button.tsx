import { XIcon } from 'lucide-react';
import { forwardRef } from 'react';
import { IconButton, type IconButtonProps } from './icon-button';
import { useUiText } from './ui-text';

export type CloseButtonProps = IconButtonProps;

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(props, ref) {
    const t = useUiText();
    return (
      <IconButton variant="plain" colorPalette="gray" aria-label={t.close} ref={ref} {...props}>
        {props.children ?? <XIcon />}
      </IconButton>
    );
  }
);
