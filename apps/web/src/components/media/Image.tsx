// apps/web/src/components/media/Image.tsx
import { Picture } from '@hmidmismi/ui';
import { localize } from '@/lib/localize';
import { PLACEHOLDER } from '@/lib/placeholder';
import type { ImageData } from '@/lib/sanity';

/**
 * An image at its own size. A document without an image yet shows the placeholder, so a layout never has a hole in it.
 *
 * @param props - the image; a label that becomes its alt text when the image has none of its own; whether it only decorates (a card whose title already names it); and whether to show the placeholder when there is no image (on by default).
 * @returns the picture, or nothing when there is no image and the placeholder is off.
 */
export function Image({
  image,
  label,
  decorative = false,
  placeholder = true,
}: {
  image?: ImageData;
  label: string;
  decorative?: boolean;
  placeholder?: boolean;
}) {
  const real = image?.url && image.width && image.height ? image : null;
  if (!real && !placeholder) return null;
  return (
    <Picture
      shape="photo"
      src={real?.url ?? PLACEHOLDER.url}
      alt={decorative ? '' : (real && localize(real.alt)) || label}
      width={real?.width ?? PLACEHOLDER.width}
      height={real?.height ?? PLACEHOLDER.height}
    />
  );
}
