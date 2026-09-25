import { useEffect, useState } from 'react';
import { getPrayer, PrayerData, withNext } from '../lib/data/prayer';
import { getWeather, Weather } from '../lib/data/weather';
import { getAdvice, Advice } from '../lib/data/advice';
import { crowdLevel } from '../data/content';

const useLive = <T,>(load: () => Promise<{ data: T; at: number; stale: boolean }>) => {
  const [s, setS] = useState<{ data?: T; at?: number; stale?: boolean }>({});
  useEffect(() => { load().then(setS).catch(() => setS({})); }, []);
  return s;
};

/* v0.3: no literal photography in the hero - type and space carry it (his call) */
const Atmosphere = () => (
  <div className="absolute inset-0" aria-hidden="true">
    <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-dome/[0.07] to-transparent" />
  </div>
);

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

  const liveBits = [
    w ? `MAKKAH ${Math.round(w.feels)}° FEELS` : null,
    p ? `NEXT PRAYER ${String(p.nextName).toUpperCase()} ${p.nextTime} · IN ${cd.toUpperCase()}` : null,
    a ? `FCDO: ${a.level === 'clear' ? 'NO ADVISORY' : a.level === 'caution' ? 'BORDER AREAS' : 'ADVISORY'}` : null,
    crowd ? `SEASON ${String(crowd.level).toUpperCase()}` : null,
  ].filter(Boolean).join('  ·  ');

  return (
    <div className="night-root relative bg-kiswa text-sand">
      {/* HERO */}
      <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-12 text-center">
        <Atmosphere />
        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
          <p className="font-arabic fade-in text-xl text-gold-soft/90" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1 className="fade-in mt-8 font-body text-[3.4rem] font-extrabold leading-[0.95] tracking-[-0.045em] text-sand sm:text-8xl lg:text-[7.5rem]" style={{ animationDelay: '90ms' }}>
            Your Umrah,<br /><span className="font-display font-medium italic tracking-normal text-gold-soft">safely</span> planned.
          </h1>
          <p className="fade-in mt-6 max-w-md text-base leading-relaxed text-sand/70 sm:text-lg" style={{ animationDelay: '180ms' }}>
            Musafir watches the things that matter - official travel advice, heat, crowds, permits - and plans the journey around them.
          </p>
          <div className="fade-in mt-10 flex w-full max-w-md flex-col items-center gap-4" style={{ animationDelay: '270ms' }}>
            <button onClick={onChat} className="cta-lift min-h-12 w-full rounded-full bg-sand px-8 text-[15px] font-bold text-kiswa sm:w-auto sm:min-w-56">
              Chat with Musafir
            </button>
            <button onClick={onStart} className="btn-press min-h-11 px-4 text-sm font-semibold text-sand/80 underline decoration-kiswa/30 underline-offset-8 hover:text-sand">
              or fill out the form
            </button>
          </div>
          <p className="fade-in mt-4 text-[11px] text-sand/45" style={{ animationDelay: '330ms' }}>Same plan either way. Free, no account.</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-sand/10 px-5 py-3">
          <p className="tnum truncate text-center text-[10px] uppercase tracking-[0.14em] text-sand/55" aria-live="polite">
            {liveBits || 'READING LIVE SIGNALS…'}
          </p>
        </div>
      </div>

      {/* Numbered story */}
      <section className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-6 pt-16">
        {[
          { n: '01', t: 'Check the ground truth', d: 'Before anything is planned, Musafir reads the live FCDO advice for Saudi Arabia, the heat in Makkah, the Hijri season and the crowds it brings. If official advice changes, the plan changes with it.' },
          { n: '02', t: 'Shape the journey', d: 'Answer six quick questions in chat, or fill the form. Your month, travellers, nights and budget become three honest packages - flights, hotels and walking distance to the Haram.' },
          { n: '03', t: 'Walk it prepared', d: 'A document checklist, permits to book, prayer times at the Haram and the numbers to call if something goes wrong - carried with you for the whole trip.' },
        ].map((s) => (
          <div key={s.n} className="border-t border-sand/10 py-10 first:border-t-0 first:pt-0">
            <p className="tnum text-6xl font-extrabold leading-none text-sand/10 sm:text-7xl" aria-hidden="true">{s.n}</p>
            <p className="font-display mt-4 text-2xl font-medium italic leading-snug text-sand sm:text-3xl">{s.t}</p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-sand/60">{s.d}</p>
          </div>
        ))}
      </section>


      {/* Inside the app - real product evidence, verbatim from the live chat */}
      <section className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-6">
        <p className="tnum mb-4 text-[10px] uppercase tracking-[0.2em] text-sand/40">Inside the app</p>
        <div className="overflow-hidden rounded-3xl border border-sand/10 bg-ink shadow-hero">
          <div className="flex items-center gap-3 border-b border-sand/10 px-5 py-3.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-dome/15 text-[13px] text-gold-soft" aria-hidden="true">&#10022;</span>
            <div>
              <p className="text-[13px] font-bold leading-tight text-sand">Musafir</p>
              <p className="text-[10px] leading-tight text-sand/45">Plans from your answers</p>
            </div>
          </div>
          <div className="space-y-4 px-5 py-5">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-sand/10 bg-sand/[0.04] px-4 py-3">
              <p className="text-sm leading-relaxed text-sand/85">Salaam. I&rsquo;ll ask a few quick questions and build the plan from your answers. Six of them, that&rsquo;s all.</p>
            </div>
            <div className="flex flex-wrap gap-2" aria-hidden="true">
              {['London', 'Birmingham', 'Manchester', 'Leicester'].map((c) => (
                <span key={c} className="rounded-full border border-sand/15 px-4 py-2 text-[13px] font-semibold text-sand/75">{c}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="tnum mt-2 text-[9px] uppercase tracking-[0.14em] text-sand/35">The real chat - first question, as it ships</p>
      </section>

      {/* Full-bleed courtyard band */}
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-6">
        <div className="overflow-hidden rounded-3xl border border-sand/10 shadow-hero">
          <img src="/haram-court.webp" alt="Pilgrims performing tawaf around the Kaaba in the Grand Mosque courtyard" className="h-56 w-full object-cover sm:h-72" loading="lazy" />
        </div>
        <p className="tnum mt-2 text-[9px] uppercase tracking-[0.14em] text-sand/35">The Grand Mosque, Makkah · Photo: omar_chatriwala (CC BY 2.0)</p>
      </div>

      {/* Reassurance */}
      <section className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-20 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-sand/10 pt-10 sm:grid-cols-2">
          {[
            ['No account, nothing to install', 'Opens in the browser and keeps your plan on this device.'],
            ['Free to use', 'Live data comes from keyless public sources - no card, no trial.'],
            ['When signals drop', 'Anything stale or unreachable is labelled as such; advice is never guessed.'],
            ['Built for the journey', 'Readable in bright sun, tappable one-handed, respectful of reduced motion.'],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="text-sm font-bold text-sand">{t}</p>
              <p className="mt-1 text-xs leading-relaxed text-sand/55">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-4">
          <button onClick={onChat} className="cta-lift min-h-12 rounded-full bg-sand px-10 text-[15px] font-bold text-kiswa">Chat with Musafir</button>
          <button onClick={onSafety} className="btn-press min-h-11 px-4 text-xs font-bold text-sand/55 underline underline-offset-4 hover:text-sand">Read the safety briefing first</button>
        </div>
      </section>
    </div>
  );
};
