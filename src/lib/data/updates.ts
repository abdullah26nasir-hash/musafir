// Live travel-updates feed, served by the /api/updates Pages Function.
import { fetchCached } from './cache';

export interface UpdateItem { id: string; source: string; sourceLabel: string; title: string; url: string; published: string; summary: string }
export interface UpdatesPayload { generatedAt: string; items: UpdateItem[]; sources: { id: string; label: string; ok: boolean }[] }

export const getUpdates = () =>
  fetchCached<UpdatesPayload>('updates', 15 * 60 * 1000, async () => {
    const res = await fetch('/api/updates');
    if (!res.ok) throw new Error(`updates ${res.status}`);
    return res.json();
  });
