import { useEffect, useMemo, useState } from 'react';
import { PlanInput, Pkg } from '../types';
import { PRE_TRAVEL, PACKING, ChecklistItem } from '../data/content';
import { getPrayer, withNext, PrayerData } from '../lib/data/prayer';
import { getFx } from '../lib/data/fx';
import { Btn, Chip, SectionTitle, SourceLine } from '../components/ui';

const Checklist = ({ title, items }: { title: string; items: ChecklistItem[] }) => {
  const [done, setDone] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setDone(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const pct = Math.round((done.size / items.length) * 100);
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold">{title}</h4>
        <span className="tnum text-xs font-bold text-gold">{pct}%</span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-kiswa"><div className="h-full rounded-full bg-gold transition-all duration-300" style={{ width: `${pct}%` }} /></div>
      <ul className="mt-4 space-y-1">
        {items.map(it => (
          <li key={it.id} className="flex items-center gap-3">
            <button onClick={() => toggle(it.id)} aria-pressed={done.has(it.id)} aria-label={it.text}
              className={`btn-press flex min-h-11 flex-1 items-center gap-3 rounded-xl px-2 text-left text-sm ${done.has(it.id) ? 'text-mist line-through' : 'text-sand/90'}`}>
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${done.has(it.id) ? 'border-gold bg-gold text-kiswa' : 'border-mist/40'}`}>{done.has(it.id) ? '✓' : ''}</span>
              {it.text}
            </button>
            {it.link && <a href={it.link} target="_blank" rel="noreferrer" className="shrink-0 text-xs font-bold text-gold">{it.linkLabel} ↗</a>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Trip = ({ plan, pkg, onSafety, onReplan }: { plan: PlanInput; pkg: Pkg; onSafety: () => void; onReplan: () => void }) => {
  const [prayer, setPrayer] = useState<{ data?: PrayerData; at?: number }>({});
  const [city, setCity] = useState<'Makkah' | 'Madinah'>('Makkah');
  const [fx, setFx] = useState<{ data?: { rate: number }; at?: number }>({});
  const [now, setNow] = useState(Date.now());
  useEffect(() => { getPrayer(city).then(setPrayer).catch(() => {}); }, [city]);
  useEffect(() => { getFx().then(setFx).catch(() => {}); }, []);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  const p = prayer.data && withNext(prayer.data);

  const itinerary = useMemo(() => {
    const days: { d: number; city: string; note: string }[] = [];
    const mkFirst = plan.route === 'makkah-first';
    const first = mkFirst ? { city: 'Makkah', n: pkg.makkahNights } : { city: 'Madinah', n: pkg.madinahNights };
    const second = mkFirst ? { city: 'Madinah', n: pkg.madinahNights } : { city: 'Makkah', n: pkg.makkahNights };
    const mkActs = ['Arrive Jeddah, transfer, rest', 'Perform Umrah with a guided group', 'Prayers at the Haram, off-peak tawaf', 'Ziyarat: Jabal al-Nour & the Revelation exhibition', 'Free worship day - pace yourself', 'Jumu\u2019ah at the Haram (arrive 2h early)'];
    const mdActs = ['Haramain train to Madinah', 'Greetings at the Prophet\u2019s Mosque ﷺ', 'Rawdah visit (Nusuk permit)', 'Quba mosque & date market', 'Uhud & the Seven Mosques', 'Quiet morning by the courtyard'];
    let d = 1;
    for (let i = 0; i < first.n; i++, d++) days.push({ d, city: first.city, note: (mkFirst ? mkActs : mdActs)[i] || 'Free worship & rest' });
    for (let i = 0; i < second.n; i++, d++) days.push({ d, city: second.city, note: (mkFirst ? mdActs : mkActs)[i] || 'Free worship & rest' });
    days[days.length - 1] = { ...days[days.length - 1], note: 'Departure - arrive at the airport 3h early' };
    return days;
  }, [plan, pkg]);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:pt-14">
      <SectionTitle kicker={`${pkg.title} · ${plan.month}`}>Your journey</SectionTitle>

      <div className="card shadow-hero p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-mist">Staying at</p>
            <p className="font-display mt-1 text-xl font-semibold">{pkg.makkahHotel}</p>
            <p className="text-sm text-mist">{pkg.madinahHotel}</p>
          </div>
          {p && <div className="text-right">
            <div className="mb-1 inline-flex rounded-full border border-mist/30 p-0.5 text-[10px] font-bold" role="group" aria-label="Prayer times city">
              {(['Makkah','Madinah'] as const).map(c => (
                <button key={c} onClick={() => setCity(c)} aria-pressed={city === c}
                  className={`btn-press rounded-full px-3 py-1 ${city === c ? 'bg-gold/15 text-gold' : 'text-mist'}`}>{c}</button>
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-mist">Next prayer · {city === 'Makkah' ? 'Haram' : 'the Prophet\u2019s Mosque'}</p>
            <p className="font-display tnum mt-1 text-2xl font-semibold text-gold">{p.nextName} {p.nextTime}</p>
            <p className="text-xs text-mist">{p.hijri.day} {p.hijri.monthEn} {p.hijri.year} AH</p>
          </div>}
        </div>
        {p && <div className="mt-5 grid grid-cols-6 gap-1 text-center">
          {Object.entries(p.timings).map(([k, v]) => (
            <div key={k} className={`rounded-xl py-2 ${k === p.nextName ? 'bg-gold/15 text-gold' : 'text-mist'}`}>
              <p className="text-[9px] font-bold uppercase tracking-wider">{k}</p><p className="tnum mt-0.5 text-xs font-semibold">{v}</p>
            </div>
          ))}
        </div>}
        {fx.data && <p className="tnum mt-4 text-sm text-mist">£1 = <span className="font-bold text-sand">{fx.data.rate.toFixed(2)} SAR</span> <SourceLine label="open.er-api.com" at={fx.at} /></p>}
      </div>

      <div className="mt-6"><Btn kind="ghost" className="w-full" onClick={onSafety}>Open the live safety briefing</Btn></div>

      <h3 className="font-display mt-10 mb-4 text-2xl font-semibold">Day by day</h3>
      <ol className="relative space-y-5 border-l border-mist/25 pl-6">
        {itinerary.map(it => (
          <li key={it.d} className="relative flex items-baseline gap-4">
            <span className={`absolute -left-[31px] top-1.5 size-2.5 rounded-full ${it.city === 'Makkah' ? 'bg-gold' : 'bg-dome'}`} aria-hidden="true" />
            <span className="font-display tnum w-10 shrink-0 text-2xl font-semibold text-gold/80" aria-hidden="true">{String(it.d).padStart(2, '0')}</span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-mist">{it.city}</span>
              <span className="mt-0.5 block text-sm text-sand/90">{it.note}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Checklist title="Before you travel" items={PRE_TRAVEL} />
        <Checklist title="Packing" items={PACKING} />
      </div>

      <div className="mt-8 text-center"><Btn kind="ghost" onClick={onReplan}>Start a new plan</Btn></div>
    </div>
  );
};
