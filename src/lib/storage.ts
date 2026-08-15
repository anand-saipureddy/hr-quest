// Storage: localStorage only, every read and write wrapped in try/catch.
// If storage is blocked the app runs in memory and the caller learns via
// `blocked` so it can show the storage-blocked state instead of crashing.

export type Progress = {
  lessons: Record<string, { mcqs: Record<number, number>; scenario?: string; done?: boolean }>;
  tracks: Record<string, { drills: Record<number, number>; built?: boolean }>;
  jobs: Record<string, { saved?: boolean; applied?: boolean; notMe?: boolean; appliedOn?: string; note?: string }>;
};

export const blank: Progress = { lessons: {}, tracks: {}, jobs: {} };

const KEY = 'hrq.v2.progress';
const V1KEY = 'hrq.v1';

type Store = { ok: boolean; get(k: string): string | null; set(k: string, v: string): void };

// In-memory fallback used in tests and when localStorage throws.
export function memStore(): Store {
  const m = new Map<string, string>();
  return { ok: false, get: (k) => m.get(k) ?? null, set: (k, v) => void m.set(k, v) };
}

function safeStore(ls?: Store): Store {
  if (ls) return ls;
  try {
    const probe = '__hrq_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return { ok: true, get: (k) => localStorage.getItem(k), set: (k, v) => localStorage.setItem(k, v) };
  } catch {
    return memStore();
  }
}

// v1 -> v2 migration. v1 shape (from v1.html):
//   { lessons: {}, skills: { id: {drills: [{pick}], built} }, jobs: { id: {applied, replied} }, counters: {} }
export function migrate(v1: any): Progress {
  const p: Progress = structuredClone(blank);
  if (!v1 || typeof v1 !== 'object') return p;
  for (const [id, st] of Object.entries<any>(v1.skills ?? {})) {
    const drills: Record<number, number> = {};
    (st.drills ?? []).forEach((d: any, i: number) => {
      if (d && typeof d.pick === 'number') drills[i] = d.pick;
    });
    p.tracks[id] = { drills, built: !!st.built };
  }
  for (const [id, st] of Object.entries<any>(v1.jobs ?? {})) {
    p.jobs[id] = { applied: true, appliedOn: st.applied, note: st.replied ? 'They replied' : undefined };
  }
  return p;
}

export function load(ls?: Store): { progress: Progress; blocked: boolean; store: Store } {
  const store = safeStore(ls);
  let raw: string | null = null;
  try {
    raw = store.get(KEY);
  } catch {
    return { progress: structuredClone(blank), blocked: true, store };
  }
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return { progress: { ...structuredClone(blank), ...parsed }, blocked: !store.ok, store };
    } catch {
      return { progress: structuredClone(blank), blocked: !store.ok, store };
    }
  }
  // migrate once, leave the v1 key in place
  let v1raw: string | null = null;
  try {
    v1raw = store.get(V1KEY);
  } catch {}
  const progress = v1raw ? migrate(JSON.parse(v1raw)) : structuredClone(blank);
  save(progress, store);
  return { progress, blocked: !store.ok, store };
}

export function save(p: Progress, store: Store): boolean {
  try {
    store.set(KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export function exportJson(p: Progress): string {
  return JSON.stringify(p, null, 2);
}

export function importJson(text: string): Progress | null {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') return null;
    return { ...structuredClone(blank), ...parsed };
  } catch {
    return null;
  }
}
