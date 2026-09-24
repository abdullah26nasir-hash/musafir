import { useEffect, useState } from 'react';
import { getAdvice, Advice } from '../lib/data/advice';
import { getWeather, Weather, heatLevel, heatGuidance } from '../lib/data/weather';
import { getPrayer } from '../lib/data/prayer';
import { EMERGENCY, SAFETY_GUIDES, crowdLevel } from '../data/content';
import { Chip, Dot, SectionTitle, SourceLine, Btn } from '../components/ui';
import { Star } from '../components/Star';

const toneTxt = { clear: 'text-clear', caution: 'text-caution', warning: 'text-warning' } as const;

export const Safety = ({ onPlan }: { onPlan: () => void }) => {
  const [advice, setAdvice] = useState<{ data?: Advice; at?: number; stale?: boolean }>({});
  const [wxM, setWxM] = useState<{ data?: Weather }>({});
  const [wxD, setWxD] = useState<{ data?: Weather }>({});
  const [hijri, setHijri] = useState<string>('');
  const [open, setOpen] = useState<string | null>('crowds');
  useEffect(() => {
    getAdvice().then(setAdvice).catch(() => {});
    getWeather('Makkah').then(setWxM).catch(() => {});
    getWeather('Madinah').then(setWxD).catch(() => {});
    getPrayer('Makkah').then(r => setHijri(r.data.hijri.monthEn)).catch(() => {});
  }, []);
  const a = advice.data;
  const crowd = crowdLevel(hijri || 'Muharram');
  const heatM = wxM.data ? heatLevel(wxM.data.feels) : undefined;
  const heatD = wxD.data ? heatLevel(wxD.data.feels) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:pt-14">
      <SectionTitle kicker="Safety briefing" arabic="ٱلسَّلَامَةُ أَوَّلًا">Know before you go</SectionTitle>

      {/* Status board */}
      <div className="card shadow-hero divide-y divide-mist/15">
        <div className="flex items-start gap-4 p-5">
          <Dot tone={a?.level || 'clear'} />
          <div className="flex-1">
            <p className="text-sm font-bold">Official travel advice <span className="ml-2"><Chip tone={a?.level || 'clear'}>{a ? (a.level === 'clear' ? 'Clear' : a.level === 'caution' ? 'Caution' : 'Warning') : '…'}</Chip></span></p>
            <p className="mt-1.5 text-sm leading-relaxed text-mist">{a ? a.levelLabel + '.' : 'Loading the FCDO page…'}</p>
            {a && <a href={a.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold">Read the full FCDO advice</a>}
            <SourceLine label="GOV.UK Foreign, Commonwealth & Development Office" at={advice.at} stale={advice.stale} />
          </div>
        </div>
        <div className="flex items-start gap-4 p-5">
          <Dot tone={heatM === 'extreme' || heatD === 'extreme' ? 'warning' : heatM === 'hot' || heatD === 'hot' ? 'caution' : 'clear'} />
          <div className="flex-1">
            <p className="text-sm font-bold">Heat right now</p>
            <div className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-mist">
              <span>Makkah <span className={`tnum font-bold ${heatM ? toneTxt[heatM === 'extreme' ? 'warning' : heatM === 'hot' ? 'caution' : 'clear'] : ''}`}>{wxM.data ? `${Math.round(wxM.data.feels)}°C feels` : '…'}</span></span>
              <span>Madinah <span className={`tnum font-bold ${heatD ? toneTxt[heatD === 'extreme' ? 'warning' : heatD === 'hot' ? 'caution' : 'clear'] : ''}`}>{wxD.data ? `${Math.round(wxD.data.feels)}°C feels` : '…'}</span></span>
            </div>
            {wxM.data && <p className="mt-1.5 text-sm leading-relaxed text-mist">{heatGuidance[heatLevel(wxM.data.feels)]}</p>}
            <SourceLine label="Open-Meteo, live" at={undefined} />
          </div>
        </div>
        <div className="flex items-start gap-4 p-5">
          <Dot tone={crowd.level === 'peak' ? 'warning' : crowd.level === 'busy' ? 'caution' : 'clear'} />
          <div className="flex-1">
            <p className="text-sm font-bold">Season & crowds <span className="ml-2"><Chip tone={crowd.level === 'peak' ? 'warning' : crowd.level === 'busy' ? 'caution' : 'clear'}>{crowd.level}</Chip></span></p>
            <p className="mt-1.5 text-sm leading-relaxed text-mist">{crowd.note}</p>
            <SourceLine label={`Hijri calendar (${hijri || '…'}) via Aladhan`} />
          </div>
        </div>
      </div>

      {/* Guides */}
      <h3 className="font-display mt-12 mb-4 text-2xl font-semibold">Pilgrim safety guides</h3>
      <div className="space-y-3">
        {SAFETY_GUIDES.map(g => (
          <div key={g.id} className="card overflow-hidden">
            <button onClick={() => setOpen(open === g.id ? null : g.id)} aria-expanded={open === g.id}
              className="flex w-full items-center justify-between gap-4 p-5 text-left">
              <span className="flex items-center gap-3 text-sm font-bold"><Star size={16} className="text-gold" />{g.title}</span>
              <span className={`text-gold transition-transform duration-200 ${open === g.id ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open === g.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className={`px-5 pb-5 pt-4 ${open === g.id ? 'border-t border-mist/15' : ''}`}>
                  <ul className="space-y-2.5">
                    {g.points.map((pt, i) => <li key={i} className="flex gap-3 text-sm leading-relaxed text-sand/85"><span className="mt-[9px] size-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />{pt}</li>)}
                  </ul>
                  {g.source && <p className="mt-4 text-[11px] text-mist">Source: {g.source}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency */}
      <h3 className="font-display mt-12 mb-4 text-2xl font-semibold">Emergency numbers</h3>
      <div className="card divide-y divide-mist/15">
        {EMERGENCY.map(c => (
          <div key={c.number} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-semibold">{c.label}</p>
              {c.note && <p className="mt-0.5 text-xs text-mist">{c.note}</p>}
            </div>
            <a href={`tel:${c.number.replace(/\s/g, '')}`} className="tnum shrink-0 rounded-full border border-gold/40 px-4 py-2 text-sm font-bold text-gold btn-press">{c.number}</a>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center"><Btn onClick={onPlan}>Plan my Umrah</Btn></div>
    </div>
  );
};
