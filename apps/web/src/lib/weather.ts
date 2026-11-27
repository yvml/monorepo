// apps/web/src/lib/weather.ts
import { PLACE } from '@/constants';
import type { TextKey } from '@/i18n';

/** Which picture stands for the weather; the weather component maps each to an icon. */
export type WeatherIcon = 'sun' | 'moon' | 'cloud-sun' | 'cloud-moon' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';

/** The weather now: the temperature in °F, the string that names the conditions, and the icon. */
export type Weather = { temperature: number; condition: TextKey; icon: WeatherIcon };

/** Open-Meteo's forecast API: free, no key. Its `weather_code` is the WMO code. */
const ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

/**
 * Turns a WMO weather code into what the page shows.
 *
 * @param code - Open-Meteo's `weather_code`.
 * @param day - whether the sun is up, which decides between a sun and a moon.
 * @returns the condition's string key and the icon.
 */
export function describeWeather(code: number, day: boolean): Pick<Weather, 'condition' | 'icon'> {
  if (code === 0) return day ? { condition: 'weatherSunny', icon: 'sun' } : { condition: 'weatherClear', icon: 'moon' };
  if (code <= 2) return { condition: 'weatherPartlyCloudy', icon: day ? 'cloud-sun' : 'cloud-moon' };
  if (code === 3) return { condition: 'weatherCloudy', icon: 'cloud' };
  if (code <= 48) return { condition: 'weatherFog', icon: 'fog' };
  if (code <= 57) return { condition: 'weatherDrizzle', icon: 'drizzle' };
  if (code <= 67 || (code >= 80 && code <= 82)) return { condition: 'weatherRain', icon: 'rain' };
  if (code <= 77 || code === 85 || code === 86) return { condition: 'weatherSnow', icon: 'snow' };
  return { condition: 'weatherStorm', icon: 'storm' };
}

/**
 * The current weather where the lab is.
 *
 * @returns the weather, or null when the service does not answer.
 */
export async function currentWeather(): Promise<Weather | null> {
  const query = new URLSearchParams({
    latitude: String(PLACE.latitude),
    longitude: String(PLACE.longitude),
    current: 'temperature_2m,weather_code,is_day',
    temperature_unit: 'fahrenheit',
    timezone: PLACE.timeZone,
  });
  const response = await fetch(`${ENDPOINT}?${query}`);
  if (!response.ok) return null;
  const { current } = (await response.json()) as {
    current?: { temperature_2m: number; weather_code: number; is_day: number };
  };
  if (!current) return null;
  return {
    temperature: Math.round(current.temperature_2m),
    ...describeWeather(current.weather_code, current.is_day === 1),
  };
}
