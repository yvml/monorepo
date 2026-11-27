// apps/web/src/components/home/materials.ts
import { yvml } from '@/theme/yvml';

/** The studio's material names that the design's table calls something else. */
const ALIASES: Record<string, string> = {
  Steel: 'Metalwork',
  Leather: 'Leatherwork',
  Fabric: 'Fiber arts',
  Adobe: 'Earth building',
  'PETG plates': 'Printmaking',
};

const HUES = new Set(Object.keys(yvml.scales.categorical));

/**
 * The theme's hue for a material: its slug, such as `fiber-arts`.
 *
 * @param name - the material's name in English.
 * @returns the hue, or nothing for a material the theme does not have.
 */
export function materialHue(name: string) {
  const slug = (ALIASES[name] ?? name).toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
  return HUES.has(slug) ? slug : undefined;
}
