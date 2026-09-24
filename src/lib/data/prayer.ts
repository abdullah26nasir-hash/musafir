// Aladhan API: live prayer times + Hijri date. Free, no key. Method 4 = Umm al-Qura (Makkah).
import { fetchCached } from './cache';

export interface PrayerData {
  timings: Record<string, string>; // Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha
  hijri: { day: string; monthEn: string; monthAr: string; year: string };
  nextName: string; nextTime: string; nextAt: number; // epoch ms (local interpretation of Makkah time)
  city: string;
}

const ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

async function load(city: string): Promise<PrayerData> {
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Saudi+Arabia&method=4`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`aladhan ${res.status}`);
  const j = await res.json();
  const t: Record<string, string> = j.data.timings;
  const h = j.data.date.hijri;
  const timings: Record<string, string> = {};
  for (const k of ORDER) timings[k] = (t[k] || '').slice(0, 5);
  const clean: PrayerData = {
    timings,
    hijri: { day: h.day, monthEn: h.month.en, monthAr: h.month.ar, year: h.year },
    nextName: '', nextTime: '', nextAt: 0, city,
  };
  return withNext(clean);
}

// Compute next prayer. Aladhan times are Makkah local (AST, UTC+3, no DST).
export function withNext(p: PrayerData): PrayerData {
  const nowMakkah = Date.now() + (3 * 60 + new Date().getTimezoneOffset()) * 60000;
  const d = new Date(nowMakkah);
  for (const name of ORDER) {
    const [hh, mm] = p.timings[name].split(':').map(Number);
    const at = new Date(d); at.setHours(hh, mm, 0, 0);
    if (at.getTime() > nowMakkah) {
      return { ...p, nextName: name, nextTime: p.timings[name], nextAt: at.getTime() - (3 * 60 + new Date().getTimezoneOffset()) * 60000 };
    }
  }
  const [hh, mm] = p.timings.Fajr.split(':').map(Number);
  const at = new Date(d); at.setDate(at.getDate() + 1); at.setHours(hh, mm, 0, 0);
  return { ...p, nextName: 'Fajr', nextTime: p.timings.Fajr, nextAt: at.getTime() - (3 * 60 + new Date().getTimezoneOffset()) * 60000 };
}

export const getPrayer = (city: 'Makkah' | 'Madinah') =>
  fetchCached(`prayer:${city}`, 30 * 60000, () => load(city));
