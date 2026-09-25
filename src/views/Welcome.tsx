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

export const Welcome = ({ onStart, onChat, onSafety }: { onStart: () => void; onChat: () => void; onSafety: () => void }) => {
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
    <div className="relative">
      {/* HERO */}
      <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        </div>
        <p className="font-arabic fade-in text-2xl text-gold" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h1 className="font-display fade-in mt-6 max-w-2xl text-5xl font-semibold leading-[1.02] sm:text-7xl" style={{ animationDelay: '80ms' }}>
          Your Umrah,<br /><span className="text-gold">safely</span> planned.
        </h1>
        <p className="fade-in mt-5 max-w-md text-base leading-relaxed text-mist sm:text-lg" style={{ animationDelay: '160ms' }}>
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

        <div className="fade-in mt-9 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center" style={{ animationDelay: '340ms' }}>
          <Btn onClick={onChat} className="flex-1">Chat with Musafir</Btn>
          <Btn kind="ghost" onClick={onStart} className="flex-1">Fill out the form</Btn>
        </div>
        <p className="fade-in mt-3 text-[11px] text-mist" style={{ animationDelay: '380ms' }}>Same plan either way. Chat asks, you answer - or tap through the form.</p>
        <SourceLine label="Live from Open-Meteo, Aladhan & GOV.UK FCDO" at={Math.max(prayer.at || 0, wx.at || 0, advice.at || 0) || undefined} />
      </div>

      {/* How it works */}
      <section className="mx-auto w-full max-w-2xl px-6 pb-8 pt-14">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-gold">How Musafir works</p>
        <div className="mt-6 space-y-3">
          {[
            { n: '1', t: 'Check the ground truth', d: 'Before anything is planned, Musafir reads the live FCDO advice for Saudi Arabia, the heat in Makkah, the Hijri season and the crowds it brings. If official advice changes, the plan changes with it.' },
            { n: '2', t: 'Shape the journey', d: 'Answer six quick questions in chat, or fill the form. Your month, travellers, nights and budget become three honest packages - flights, hotels and walking distance to the Haram.' },
            { n: '3', t: 'Walk it prepared', d: 'A document checklist, permits to book, prayer times at the Haram and the numbers to call if something goes wrong - carried with you for the whole trip.' },
          ].map((s, i) => (
            <div key={s.n} className="card shadow-card fade-in flex gap-4 p-5 text-left" style={{ animationDelay: `${i * 90}ms` }}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-dome/10 font-display text-base font-semibold text-dome" aria-hidden="true">{s.n}</span>
              <div>
                <p className="font-display text-lg font-semibold leading-snug">{s.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-mist">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reassurance */}
      <section className="mx-auto w-full max-w-2xl px-6 pb-14">
        <div className="card fade-in grid grid-cols-1 gap-x-6 gap-y-3 p-6 text-left sm:grid-cols-2" style={{ animationDelay: '200ms' }}>
          {[
            ['No account, nothing to install', 'Opens in the browser and keeps your plan on this device.'],
            ['Free to use', 'Live data comes from keyless public sources - no card, no trial.'],
            ['When signals drop', 'Anything stale or unreachable is labelled as such; advice is never guessed.'],
            ['Built for the journey', 'Readable in bright sun, tappable one-handed, respectful of reduced motion.'],
          ].map(([t, d]) => (
            <div key={t} className="flex gap-3">
              <Star size={14} className="mt-1 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-bold">{t}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-mist">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Btn onClick={onChat}>Chat with Musafir</Btn>
          <button onClick={onSafety} className="btn-press min-h-11 px-4 text-xs font-bold text-mist hover:text-sand underline underline-offset-4">Read the safety briefing first</button>
        </div>
      </section>
    </div>
  );
};
