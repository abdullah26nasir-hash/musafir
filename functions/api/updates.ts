// Live travel-updates feed. Aggregates free, official, machine-readable sources
// server-side (browsers can't read these cross-origin), normalises to one shape,
// caches 15 minutes at the edge. Adding a source = one FEEDS entry.
//
// Parked: @HaramainInfo and airline/airport X accounts - X's API has no free
// read tier, so those need a paid plan or his call on cost.

interface PagesContext { request: Request; waitUntil: (p: Promise<unknown>) => void }

interface FeedDef { id: string; label: string; url: string; type: 'rss' | 'atom'; max: number; onlyTitles?: string[] }
interface UpdateItem { id: string; source: string; sourceLabel: string; title: string; url: string; published: string; summary: string }

// Destinations Musafir users actually fly to - keeps the FCDO feed relevant.
const DESTINATIONS = ['saudi arabia', 'turkey', 'united arab emirates', 'morocco', 'egypt', 'jordan', 'qatar', 'pakistan', 'malaysia', 'indonesia'];

const FEEDS: FeedDef[] = [
  { id: 'fcdo', label: 'GOV.UK FCDO travel advice', url: 'https://www.gov.uk/foreign-travel-advice.atom', type: 'atom', max: 8, onlyTitles: DESTINATIONS },
];

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ');
const strip = (s: string) => decode(decode(s.replace(/<!\[CDATA\[|\]\]>/g, '')).replace(/<[^>]+>/g, ' ')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const pick = (xml: string, tag: string) => { const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')); return m ? strip(m[1]) : ''; };
const pickAttr = (xml: string, tag: string, attr: string) => { const m = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"`, 'i')); return m ? m[1] : ''; };
const iso = (s: string) => { const t = Date.parse(s); return Number.isNaN(t) ? '' : new Date(t).toISOString(); };

function parseFeed(feed: FeedDef, xml: string): UpdateItem[] {
  const chunks = feed.type === 'rss' ? xml.split(/<item[\s>]/i).slice(1) : xml.split(/<entry[\s>]/i).slice(1);
  const out: UpdateItem[] = [];
  for (const c of chunks) {
    const title = pick(c, 'title');
    if (!title) continue;
    if (feed.onlyTitles && !feed.onlyTitles.includes(title.toLowerCase())) continue;
    const link = feed.type === 'rss' ? pick(c, 'link') : (pickAttr(c, 'link', 'href') || pick(c, 'link'));
    const published = iso(pick(c, feed.type === 'rss' ? 'pubDate' : 'updated') || pick(c, 'published'));
    if (!published || Date.now() - Date.parse(published) > 21 * 24 * 3600 * 1000) continue; // stale items are not updates
    const summary = (pick(c, 'summary') || pick(c, 'description')).slice(0, 220);
    out.push({ id: `${feed.id}:${link || title}`, source: feed.id, sourceLabel: feed.label, title, url: link, published, summary });
    if (out.length >= feed.max) break;
  }
  return out;
}

async function build(): Promise<{ generatedAt: string; items: UpdateItem[]; sources: { id: string; label: string; ok: boolean }[] }> {
  const results = await Promise.allSettled(FEEDS.map(async (feed) => {
    const res = await fetch(feed.url, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'Musafir travel companion (personal preview)' } });
    if (!res.ok) throw new Error(`${feed.id} ${res.status}`);
    return parseFeed(feed, await res.text());
  }));
  const items: UpdateItem[] = [];
  const sources = FEEDS.map((f, i) => {
    const r = results[i];
    if (r.status === 'fulfilled') { items.push(...r.value); return { id: f.id, label: f.label, ok: true }; }
    return { id: f.id, label: f.label, ok: false };
  });
  items.sort((a, b) => (b.published || '').localeCompare(a.published || ''));
  return { generatedAt: new Date().toISOString(), items: items.slice(0, 15), sources };
}

export const onRequestGet = async (ctx: PagesContext): Promise<Response> => {
  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request(new URL(ctx.request.url).origin + '/api/updates');
  const hit = await cache.match(key);
  if (hit) return hit;
  const body = JSON.stringify(await build());
  const res = new Response(body, { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=900' } });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
};
