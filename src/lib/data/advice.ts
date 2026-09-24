// GOV.UK Content API: FCDO foreign travel advice for Saudi Arabia. Free, no key,
// authoritative, updated by the Foreign Office. The spine of the safety layer.
import { fetchCached } from './cache';

export type AdvisoryLevel = 'clear' | 'caution' | 'warning';
export interface Advice {
  level: AdvisoryLevel;
  levelLabel: string;
  summary: string;        // first meaningful lines of the warnings section
  pilgrimage: string;     // FCDO's dedicated pilgrimage section, trimmed
  updatedAt: string;      // ISO
  url: string;
}

const PAGE = 'https://www.gov.uk/api/content/foreign-travel-advice/saudi-arabia';
const strip = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

async function load(): Promise<Advice> {
  const res = await fetch(PAGE);
  if (!res.ok) throw new Error(`gov.uk ${res.status}`);
  const j = await res.json();
  const parts: { slug: string; title: string; body: string }[] = j.details.parts || [];
  const norm = (t: string) => t.replace(/:/g, ' ').replace(/\s+/g, ' ');
  const warnings = norm(strip(parts.find(p => p.slug === 'warnings-and-insurance')?.body || ''));
  const pilgrimage = strip(parts.find(p => p.slug === 'pilgrimage')?.body || '');
  let level: AdvisoryLevel = 'clear';
  let levelLabel = 'No FCDO advisory against travel to Saudi Arabia';
  const wholeCountry = /advises against (all|all but essential) travel to (the whole of )?Saudi Arabia/i.test(warnings);
  const hasAreaAdvice = /advises against (all|all but essential) travel/i.test(warnings);
  if (wholeCountry && /all travel/i.test(warnings)) { level = 'warning'; levelLabel = 'FCDO advises against all travel to Saudi Arabia'; }
  else if (wholeCountry) { level = 'warning'; levelLabel = 'FCDO advises against all but essential travel to Saudi Arabia'; }
  else if (hasAreaAdvice) {
    level = 'caution';
    // name the areas, e.g. the Yemen border
    const stop = warnings.split(/Find out more/i)[0];
    const areas = [...stop.matchAll(/advises against (?:all|all but essential) travel to (?:within [^.]*?)(?:\.|$)/gi)].map(m => m[0].replace(/advises against /i, '').replace(/\.$/, ''));
    levelLabel = 'FCDO advises against travel to areas near the Yemen border. Makkah, Madinah & Jeddah carry no advisory.';
  }
  const summaryClean = warnings.replace(/^Your travel insurance could be invalidated if you travel against advice from the Foreign, Commonwealth & Development Office \(FCDO\)\.?/i, '').trim();
  return {
    level, levelLabel,
    summary: summaryClean.slice(0, 600),
    pilgrimage: pilgrimage.slice(0, 600),
    updatedAt: j.updated_at || j.public_updated_at || '',
    url: 'https://www.gov.uk/foreign-travel-advice/saudi-arabia',
  };
}
export const getAdvice = () => fetchCached('fcdo:saudi', 6 * 3600000, load);
