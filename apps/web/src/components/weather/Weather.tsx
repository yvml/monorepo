// apps/web/src/components/weather/Weather.tsx
import { Icon, Span } from '@hmidmismi/ui';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from 'lucide-react';
import { PLACE } from '@/constants';
import { useApi } from '@/hooks';
import { t } from '@/i18n';
import type { Weather as WeatherData, WeatherIcon } from '@/lib/weather';

const ICONS: Record<WeatherIcon, typeof Sun> = {
  sun: Sun,
  moon: Moon,
  'cloud-sun': CloudSun,
  'cloud-moon': CloudMoon,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

/**
 * The temperature and conditions where the lab is, in the header's utility row. It is read in the browser because the
 * pages are cached; nothing is drawn until it arrives, or when the weather service does not answer.
 *
 * @returns the weather, or nothing.
 */
export function Weather() {
  const weather = useApi<WeatherData>('/api/weather');
  if (!weather) return null;
  const Glyph = ICONS[weather.icon];
  const condition = t(weather.condition);
  return (
    <Span role="img" aria-label={t('weatherLabel', { place: PLACE.name, temperature: weather.temperature, condition })}>
      <Icon>
        <Glyph size={16} aria-hidden />
      </Icon>{' '}
      <Span aria-hidden>
        {weather.temperature}°F {condition}
      </Span>
    </Span>
  );
}
