import { useState } from 'react';
import { PlanInput } from '../types';
import { Btn, SectionTitle } from '../components/ui';

const ORIGINS = ['London', 'Birmingham', 'Manchester', 'Leicester', 'Bradford', 'Glasgow'];
const MONTHS = (() => {
  const out: string[] = [];
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + 1);
  for (let i = 0; i < 12; i++) { out.push(d.toLocaleString('en-GB', { month: 'long', year: 'numeric' })); d.setMonth(d.getMonth() + 1); }
  return out;
})();

export const Planner = ({ onDone }: { onDone: (p: PlanInput) => void }) => {
  const [origin, setOrigin] = useState('London');
  const [travelers, setTravelers] = useState(2);
  const [month, setMonth] = useState(MONTHS[1]);
  const [nights, setNights] = useState(10);
  const [budget, setBudget] = useState(1600);
  const [route, setRoute] = useState<PlanInput['route']>('makkah-first');

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mb-8"><p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">{label}</p>{children}</div>
  );

  return (
    <div className="mx-auto max-w-xl px-5 pb-24 pt-10 sm:pt-14">
      <SectionTitle kicker="The plan">Shape the journey</SectionTitle>

      <Field label="Flying from">
        <div className="flex flex-wrap gap-2">
          {ORIGINS.map(o => (
            <button key={o} onClick={() => setOrigin(o)} aria-pressed={origin === o}
              className={`btn-press min-h-11 rounded-full border px-5 text-sm font-semibold ${origin === o ? 'border-gold bg-gold/10 text-gold' : 'border-mist/30 text-sand hover:border-mist/60'}`}>{o}</button>
          ))}
        </div>
      </Field>

      <Field label="Travellers">
        <div className="flex items-center gap-5">
          <button onClick={() => setTravelers(Math.max(1, travelers - 1))} aria-label="Fewer travellers" className="btn-press size-11 rounded-full border border-mist/30 text-xl text-sand">−</button>
          <span className="font-display tnum text-3xl font-semibold">{travelers}</span>
          <button onClick={() => setTravelers(Math.min(8, travelers + 1))} aria-label="More travellers" className="btn-press size-11 rounded-full border border-mist/30 text-xl text-sand">+</button>
          <span className="text-sm text-mist">{travelers === 1 ? 'person' : 'people'}</span>
        </div>
      </Field>

      <Field label="When">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MONTHS.slice(0, 6).map(m => (
            <button key={m} onClick={() => setMonth(m)} aria-pressed={month === m}
              className={`btn-press min-h-11 rounded-2xl border px-3 text-sm font-semibold ${month === m ? 'border-gold bg-gold/10 text-gold' : 'border-mist/30 text-sand hover:border-mist/60'}`}>{m}</button>
          ))}
        </div>
      </Field>

      <Field label={`${nights} nights`}>
        <input type="range" min={5} max={21} value={nights} onChange={e => setNights(+e.target.value)} aria-label="Nights"
          className="w-full accent-gold" />
        <div className="mt-1 flex justify-between text-xs text-mist"><span>5</span><span>21</span></div>
      </Field>

      <Field label={`£${budget.toLocaleString()} per person`}>
        <input type="range" min={800} max={4000} step={50} value={budget} onChange={e => setBudget(+e.target.value)} aria-label="Budget per person"
          className="w-full accent-gold" />
        <div className="mt-1 flex justify-between text-xs text-mist"><span>£800</span><span>£4,000</span></div>
      </Field>

      <Field label="Route">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {([['makkah-first', 'Makkah first', 'Land in Jeddah, Umrah on arrival, Madinah after'], ['madinah-first', 'Madinah first', 'Rest in the City of the Prophet ﷺ, then Makkah']] as const).map(([v, t, d]) => (
            <button key={v} onClick={() => setRoute(v)} aria-pressed={route === v}
              className={`btn-press rounded-2xl border p-4 text-left ${route === v ? 'border-gold bg-gold/10' : 'border-mist/30 hover:border-mist/60'}`}>
              <p className={`text-sm font-bold ${route === v ? 'text-gold' : 'text-sand'}`}>{t}</p>
              <p className="mt-1 text-xs leading-relaxed text-mist">{d}</p>
            </button>
          ))}
        </div>
      </Field>

      <Btn className="w-full" onClick={() => onDone({ origin, travelers, month, nights, budget, route })}>Build my packages</Btn>
      <p className="mt-4 text-center text-xs text-mist">Estimates use real hotels & typical fares - live prices via link-outs.</p>
    </div>
  );
};
