import { PlanInput, Pkg } from '../types';
import { HOTELS, FLIGHT_BAND_GBP, HARAMAIN_TRAIN_GBP } from '../data/hotels';
import { Btn, Chip, SectionTitle } from '../components/ui';

function buildPackages(p: PlanInput): Pkg[] {
  const makkahN = p.route === 'makkah-first' ? Math.ceil(p.nights * 0.6) : Math.floor(p.nights * 0.5);
  const madinahN = p.nights - makkahN;
  const pick = (city: 'Makkah' | 'Madinah', tier: 'value' | 'mid' | 'top') => {
    const hs = HOTELS.filter(h => h.city === city).sort((a, b) => (a.nightlyGBP[0] + a.nightlyGBP[1]) - (b.nightlyGBP[0] + b.nightlyGBP[1]));
    return tier === 'value' ? hs[0] : tier === 'mid' ? hs[Math.floor(hs.length / 2)] : hs[hs.length - 1];
  };
  const mk = (tier: 'value' | 'mid' | 'top', title: string, tag: string): Pkg => {
    const mh = pick('Makkah', tier), dh = pick('Madinah', tier);
    const low = FLIGHT_BAND_GBP[0] + (makkahN * mh.nightlyGBP[0] + madinahN * dh.nightlyGBP[0]) / 2 + HARAMAIN_TRAIN_GBP;
    const high = FLIGHT_BAND_GBP[1] + (makkahN * mh.nightlyGBP[1] + madinahN * dh.nightlyGBP[1]) / 2 + HARAMAIN_TRAIN_GBP;
    return {
      id: tier, title, tag, makkahHotel: mh.name, madinahHotel: dh.name,
      makkahNights: makkahN, madinahNights: madinahN,
      priceLow: Math.round(low / 10) * 10, priceHigh: Math.round(high / 10) * 10,
      walkNote: `${mh.walkMin} min walk to the Haram`,
      features: tier === 'value' ? ['Haramain train between the cities', 'Shared shuttle transfers', 'Breakfast included']
        : tier === 'mid' ? ['Haramain train, business seat', 'Private airport transfers', 'Breakfast + Ziyarat day tour']
        : ['Clock Tower proximity', 'Private SUV transfers', 'Half board + guided Ziyarat'],
    };
  };
  return [mk('value', 'Essential', 'Best value'), mk('mid', 'Comfort', 'Most balanced'), mk('top', 'Proximity', 'Steps away')];
}

export const Packages = ({ plan, onSelect, onBack }: { plan: PlanInput; onSelect: (pkg: Pkg) => void; onBack: () => void }) => {
  const pkgs = buildPackages(plan);
  const gf = `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(plan.origin)}+to+Jeddah`;
  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-10 sm:pt-14">
      <SectionTitle kicker={`${plan.nights} nights · ${plan.month} · ${plan.travelers} ${plan.travelers > 1 ? 'travellers' : 'traveller'}`}>Three ways to go</SectionTitle>
      <div className="space-y-4">
        {pkgs.map((pkg, i) => (
          <button key={pkg.id} onClick={() => onSelect(pkg)} className="card shadow-card btn-press fade-in block w-full p-6 text-left hover:border-gold/50" style={{ animationDelay: `${i * 90}ms` }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Chip tone={i === 1 ? 'gold' : 'mist'}>{pkg.tag}</Chip>
                <h3 className="font-display mt-3 text-2xl font-semibold">{pkg.title}</h3>
              </div>
              <div className="text-right">
                <p className="font-display tnum text-2xl font-semibold text-gold">£{pkg.priceLow.toLocaleString()}–{pkg.priceHigh.toLocaleString()}</p>
                <p className="text-[11px] text-mist">per person, estimated</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-mist">Makkah · {pkg.makkahNights}n</p><p className="mt-0.5 font-semibold">{pkg.makkahHotel}</p><p className="text-xs text-mist">{pkg.walkNote}</p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-widest text-mist">Madinah · {pkg.madinahNights}n</p><p className="mt-0.5 font-semibold">{pkg.madinahHotel}</p></div>
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {pkg.features.map(f => <li key={f} className="flex items-center gap-1.5 text-xs text-sand/80"><span className="size-1 rounded-full bg-gold" />{f}</li>)}
            </ul>
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <a href={gf} target="_blank" rel="noreferrer" className="btn-press inline-flex min-h-11 items-center rounded-full border border-mist/40 px-5 text-sm font-bold text-sand hover:border-gold/60 hover:text-gold">Check live fares on Google Flights ↗</a>
        <Btn kind="ghost" onClick={onBack}>Adjust plan</Btn>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-mist">Estimates combine typical {plan.origin}–Jeddah return fares, published hotel rate bands and the Haramain train. Final prices come from the airline and hotel at booking - nothing is sold in this app.</p>
    </div>
  );
};
