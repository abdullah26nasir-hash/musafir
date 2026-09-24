// Open-Meteo: live temperature + apparent (feels-like) temperature. Free, no key.
// Heat is the leading safety risk for pilgrims, so this drives the heat gauge.
import { fetchCached } from './cache';

export interface Weather { temp: number; feels: number; humidity: number; code: number; city: string; }

const COORDS = { Makkah: [21.4267, 39.8256], Madinah: [24.4672, 39.6111] } as const;

async function load(city: keyof typeof COORDS): Promise<Weather> {
  const [lat, lon] = COORDS[city];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code&timezone=Asia%2FRiyadh`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`open-meteo ${res.status}`);
  const j = await res.json();
  return { temp: j.current.temperature_2m, feels: j.current.apparent_temperature, humidity: j.current.relative_humidity_2m, code: j.current.weather_code, city };
}

export type HeatLevel = 'mild' | 'hot' | 'extreme';
export const heatLevel = (feels: number): HeatLevel => feels >= 43 ? 'extreme' : feels >= 35 ? 'hot' : 'mild';
export const heatGuidance: Record<HeatLevel, string> = {
  mild: 'Comfortable for outdoor worship. Normal hydration.',
  hot: 'Plan outdoor rituals for early morning or after Maghrib. Carry water; use the shaded paths.',
  extreme: 'Heat danger zone. Avoid midday sun entirely; elderly pilgrims and children stay indoors 10:00-16:00.',
};

export const getWeather = (city: keyof typeof COORDS) => fetchCached(`weather:${city}`, 30 * 60000, () => load(city));
