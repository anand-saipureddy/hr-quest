// User preferences — low-stimulation mode (from the spec: drops sun/blush
// fills, halves the doodles, sets animation to none). Wrapped in try/catch
// like everything else that touches storage.
export type Prefs = { lowStim: boolean };

const KEY = 'hrq.v2.prefs';
const blank: Prefs = { lowStim: false };

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...blank };
    return { ...blank, ...JSON.parse(raw) };
  } catch {
    return { ...blank };
  }
}

export function savePrefs(p: Prefs): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}
