import { SourceLine } from './ui';

const SOURCES = [
  { name: 'Two Holy Mosques - General Authority', note: 'Official news on the Haramain: expansions, crowd measures, services.', url: 'https://alharamain.gov.sa/public/?site=en' },
  { name: 'Presidency of Religious Affairs', note: 'Mosque-specific announcements, prayer and sermon schedules.', url: 'https://prh.gov.sa/' },
  { name: 'Nusuk', note: 'The official permit platform. Umrah and Rawdah permits are booked here.', url: 'https://www.nusuk.sa/' },
  { name: 'GOV.UK travel advice - Saudi Arabia', note: 'FCDO advice, entry requirements and safety sections.', url: 'https://www.gov.uk/foreign-travel-advice/saudi-arabia' },
];

export const UpdatesPanel = () => (
  <section className="mx-auto w-full max-w-xl px-5 pb-10" aria-labelledby="updates-h">
    <h3 id="updates-h" className="font-display text-xl font-semibold">Official updates, straight from the source</h3>
    <p className="mt-2 text-sm leading-relaxed text-mist">
      We don't re-publish mosque announcements - closures and crowd alerts are confirmed on these official pages before anything safety-critical is said here.
    </p>
    <div className="mt-4 space-y-3">
      {SOURCES.map(s => (
        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
          className="card shadow-card btn-press block p-4 text-left hover:border-gold/50">
          <p className="text-sm font-bold text-sand">{s.name} <span className="ml-1 text-gold" aria-hidden="true">&#8599;</span></p>
          <p className="mt-1 text-xs leading-relaxed text-mist">{s.note}</p>
        </a>
      ))}
    </div>
    <SourceLine label="Curated official links - last checked 25 Sep 2026" />
  </section>
);
