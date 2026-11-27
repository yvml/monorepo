// apps/web/src/components/notice/NoticeBar.tsx
import { inheritLinkClass, Surface, Text } from '@hmidmismi/ui';
import { menuLinks } from '@/components/navigation';
import { useApi } from '@/hooks';
import { localize, t } from '@/i18n';
import type { Banner } from '@/lib/loaders';

/**
 * The notice above the header: an editor's notice, or what is happening now, as a toned band across the page. It is read
 * in the browser because the pages are cached and what is happening is not; until the answer comes, and when there is
 * none, nothing is drawn.
 *
 * @returns the band, or nothing.
 */
export function NoticeBar() {
  const banner = useApi<Banner>('/api/notice');
  if (!banner) return null;
  const text = localize(banner.text);
  if (!text) return null;
  const [item] = banner.href ? menuLinks([{ key: 'notice', label: text, href: banner.href }]) : [];
  return (
    <Surface tone="teal" pad="tight">
      <Text tone="inherit">
        {banner.kind === 'happening' && <strong>{t('happeningNow')} </strong>}
        {item ? item.link(inheritLinkClass(), text) : text}
      </Text>
    </Surface>
  );
}
