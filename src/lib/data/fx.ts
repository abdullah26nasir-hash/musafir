// ExchangeRate-API open endpoint: GBP -> SAR. Free, no key, updates daily.
import { fetchCached } from './cache';
export interface Fx { rate: number; date: string; }
async function load(): Promise<Fx> {
  const res = await fetch('https://open.er-api.com/v6/latest/GBP');
  if (!res.ok) throw new Error(`fx ${res.status}`);
  const j = await res.json();
  return { rate: j.rates.SAR, date: j.time_last_update_utc };
}
export const getFx = () => fetchCached('fx:gbpsar', 12 * 3600000, load);
