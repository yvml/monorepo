import '../../styles/studio.css';
import type { LayoutProps } from 'sanity';

export function StudioLayout(props: LayoutProps) {
  return props.renderDefault(props);
}
