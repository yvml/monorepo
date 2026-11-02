'use client';
import { useEffect, useState } from 'react';
import { css } from '../../styled-system/css';
import { useUiText } from './ui-text';

const savedIndicatorStyle = css({
  color: 'success.9',
  fontSize: 'sm',
  marginLeft: '2',
});

export function SavedIndicator({ trigger }: { trigger: unknown }) {
  const t = useUiText();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === undefined || trigger === null) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!visible) return null;

  return <span className={savedIndicatorStyle}>{t.saved}</span>;
}
