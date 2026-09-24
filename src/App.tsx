import { useState } from 'react';
import { View, PlanInput, Pkg } from './types';
import { Welcome } from './views/Welcome';
import { Safety } from './views/Safety';
import { Planner } from './views/Planner';
import { Packages } from './views/Packages';
import { Trip } from './views/Trip';
import { Star } from './components/Star';

export default function App() {
  const [view, setViewRaw] = useState<View>(() => (location.hash.replace('#','') || 'welcome') as View);
  const setView = (v: View) => { setViewRaw(v); location.hash = v; };
  const [plan, setPlan] = useState<PlanInput | null>(() => ['packages','trip'].includes(location.hash.replace('#','')) ? { origin: 'London', travelers: 2, month: 'December 2026', nights: 10, budget: 1600, route: 'makkah-first' } : null);
  const [pkg, setPkg] = useState<Pkg | null>(() => location.hash === '#trip' ? { id: 'mid', title: 'Comfort', tag: 'Most balanced', makkahHotel: 'Conrad Makkah', madinahHotel: 'Shaza Al Madina', makkahNights: 6, madinahNights: 4, priceLow: 1350, priceHigh: 1980, walkNote: '8 min walk to the Haram', features: ['Haramain train, business seat', 'Private airport transfers', 'Breakfast + Ziyarat day tour'] } : null);

  return (
    <div className="min-h-dvh">
      {view !== 'welcome' && (
        <header className="mx-auto flex max-w-2xl items-center justify-between px-5 pt-5">
          <button onClick={() => setView('welcome')} className="flex items-center gap-2 text-gold" aria-label="Musafir home">
            <Star size={20} /><span className="font-display text-lg font-semibold tracking-wide">Musafir</span>
          </button>
          <nav className="flex gap-1 text-xs font-bold">
            <button onClick={() => setView('safety')} className={`btn-press rounded-full px-4 py-2 min-h-11 ${view === 'safety' ? 'bg-gold/15 text-gold' : 'text-mist hover:text-sand'}`}>Safety</button>
            <button onClick={() => setView('planner')} className={`btn-press rounded-full px-4 py-2 min-h-11 ${view === 'planner' || view === 'packages' ? 'bg-gold/15 text-gold' : 'text-mist hover:text-sand'}`}>Plan</button>
            {pkg && <button onClick={() => setView('trip')} className={`btn-press rounded-full px-4 py-2 min-h-11 ${view === 'trip' ? 'bg-gold/15 text-gold' : 'text-mist hover:text-sand'}`}>Trip</button>}
          </nav>
        </header>
      )}
      {view === 'welcome' && <Welcome onStart={() => setView('planner')} onSafety={() => setView('safety')} />}
      {view === 'safety' && <Safety onPlan={() => setView('planner')} />}
      {view === 'planner' && <Planner onDone={(p) => { setPlan(p); setView('packages'); }} />}
      {view === 'packages' && plan && <Packages plan={plan} onBack={() => setView('planner')} onSelect={(k) => { setPkg(k); setView('trip'); }} />}
      {view === 'trip' && plan && pkg && <Trip plan={plan} pkg={pkg} onSafety={() => setView('safety')} onReplan={() => { setPkg(null); setPlan(null); setView('planner'); }} />}
    </div>
  );
}
