import { useEffect, useState } from 'react';
import { getPrayer, PrayerData, withNext } from '../lib/data/prayer';
import { getWeather, Weather, heatLevel } from '../lib/data/weather';
import { getAdvice, Advice } from '../lib/data/advice';
import { crowdLevel } from '../data/content';
import { Btn, Chip, SourceLine } from '../components/ui';
import { Star } from '../components/Star';

const useLive = <T,>(load: () => Promise<{ data: T; at: number; stale: boolean }>) => {
  const [s, setS] = useState<{ data?: T; at?: number; stale?: boolean }>({});
  useEffect(() => { load().then(setS).catch(() => setS({})); }, []);
  return s;
};

export const Welcome = ({ onStart, onSafety }: { onStart: () => void; onSafety: () => void }) => {
  const prayer = useLive(() => getPrayer('Makkah'));
  const wx = useLive(() => getWeather('Makkah'));
  const advice = useLive(() => getAdvice());
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const p: PrayerData | undefined = prayer.data && withNext(prayer.data);
  const w: Weather | undefined = wx.data;
  const a: Advice | undefined = advice.data;
  const crowd = p ? crowdLevel(p.hijri.monthEn) : undefined;
  const mins = p ? Math.max(0, Math.round((p.nextAt - now) / 60000)) : 0;
  const cd = `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] text-gold" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><Star size={560} /></div>
      </div>
      <p className="font-arabic fade-in text-2xl text-gold" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
      <h1 className="font-display fade-in mt-6 max-w-2xl text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl" style={{ animationDelay: '80ms' }}>
        Your Umrah,<br /><span className="text-gold">safely</span> planned.
      </h1>
      <p className="fade-in mt-5 max-w-md text-base leading-relaxed text-mist" style={{ animationDelay: '160ms' }}>
        Musafir watches the things that matter - official travel advice, heat, crowds, permits - and plans the journey around them.
      </p>

      <div className="fade-in mt-8 grid w-full max-w-lg grid-cols-1 items-start gap-3 sm:grid-cols-3" style={{ animationDelay: '240ms' }}>
        <div className="card shadow-card p-4 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mist">Makkah now</p>
          {w ? <>
            <p className="font-display tnum mt-1 text-2xl font-semibold">{Math.round(w.feels)}° <span className="text-sm text-mist">feels</span></p>
            <p className={`mt-1 text-xs font-semibold ${heatLevel(w.feels) === 'mild' ? 'text-clear' : heatLevel(w.feels) === 'hot' ? 'text-caution' : 'text-warning'}`}>
              {heatLevel(w.feels) === 'mild' ? 'Mild' : heatLevel(w.feels) === 'hot' ? 'Hot - plan rituals early/late' : 'Extreme heat'}</p>
          </> : <p className="mt-2 text-sm text-mist">Loading…</p>}
        </div>
        <div className="card shadow-card p-4 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mist">Next prayer · Haram</p>
          {p ? <>
            <p className="font-display tnum mt-1 text-2xl font-semibold">{p.nextName} <span className="text-sm text-mist">{p.nextTime}</span></p>
            <p className="tnum mt-1 text-xs text-mist">in {cd} · {p.hijri.day} {p.hijri.monthEn} {p.hijri.year} AH</p>
          </> : <p className="mt-2 text-sm text-mist">Loading…</p>}
        </div>
        <div className="card shadow-card p-4 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mist">Travel advice</p>
          {a ? <>
            <p className="mt-1.5"><Chip tone={a.level}>{a.level === 'clear' ? 'No advisory' : a.level === 'caution' ? 'Border areas' : 'Advisory'}</Chip></p>
            <p className="mt-2 text-xs leading-snug text-mist">{a.level === 'clear' ? a.levelLabel : 'Makkah, Madinah & Jeddah carry no advisory'}</p>
          </> : <p className="mt-2 text-sm text-mist">Loading…</p>}
        </div>
      </div>
      {crowd && <p className="fade-in mt-4 text-xs text-mist" style={{ animationDelay: '300ms' }}>Season: <span className="font-semibold text-sand">{crowd.level}</span> · {p?.hijri.monthEn}</p>}

      <div className="fade-in mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '340ms' }}>
        <Btn onClick={onStart}>Plan my Umrah</Btn>
        <Btn kind="ghost" onClick={onSafety}>See the safety briefing</Btn>
      </div>
      <SourceLine label="Live from Open-Meteo, Aladhan & GOV.UK FCDO" at={Math.max(prayer.at || 0, wx.at || 0, advice.at || 0) || undefined} />
    </div>
  );
};
