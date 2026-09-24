// Tiny TTL cache: every live source is cached in localStorage so repeat visits
// are instant and the APIs stay well inside free tiers.
export async function fetchCached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<{ data: T; at: number; stale: boolean }> {
  const k = `musafir:${key}`;
  try {
    const raw = localStorage.getItem(k);
    if (raw) {
      const { data, at } = JSON.parse(raw) as { data: T; at: number };
      if (Date.now() - at < ttlMs) return { data, at, stale: false };
    }
  } catch { /* ignore corrupt cache */ }
  try {
    const data = await load();
    const at = Date.now();
    try { localStorage.setItem(k, JSON.stringify({ data, at })); } catch { /* full */ }
    return { data, at, stale: false };
  } catch (e) {
    const raw = localStorage.getItem(k);
    if (raw) {
      const { data, at } = JSON.parse(raw) as { data: T; at: number };
      return { data, at, stale: true }; // serve old data, labelled stale
    }
    throw e;
  }
}
export const ago = (at: number) => {
  const m = Math.round((Date.now() - at) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};
