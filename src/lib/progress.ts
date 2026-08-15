import type { Progress } from './storage';

// Every mutation has an inverse. Every function returns a NEW Progress
// (no in-place edits) so the caller can keep the old one for Undo.

export function markMcq(p: Progress, lessonId: string, n: number, pick: number): Progress {
  const next = structuredClone(p);
  const l = (next.lessons[lessonId] ??= { mcqs: {} });
  l.mcqs[n] = pick;
  return next;
}

export function unmarkMcq(p: Progress, lessonId: string, n: number): Progress {
  const next = structuredClone(p);
  const l = next.lessons[lessonId];
  if (l) delete l.mcqs[n];
  return next;
}

export function saveScenario(p: Progress, lessonId: string, text: string): Progress {
  const next = structuredClone(p);
  const l = (next.lessons[lessonId] ??= { mcqs: {} });
  l.scenario = text;
  return next;
}

export function markLessonDone(p: Progress, lessonId: string, done: boolean): Progress {
  const next = structuredClone(p);
  const l = (next.lessons[lessonId] ??= { mcqs: {} });
  l.done = done;
  return next;
}

export function markDrill(p: Progress, trackId: string, n: number, pick: number): Progress {
  const next = structuredClone(p);
  const t = (next.tracks[trackId] ??= { drills: {} });
  t.drills[n] = pick;
  return next;
}

export function unmarkDrill(p: Progress, trackId: string, n: number): Progress {
  const next = structuredClone(p);
  const t = next.tracks[trackId];
  if (t) delete t.drills[n];
  return next;
}

export function markBuilt(p: Progress, trackId: string, built: boolean): Progress {
  const next = structuredClone(p);
  const t = (next.tracks[trackId] ??= { drills: {} });
  t.built = built;
  return next;
}

type JobFlag = 'saved' | 'applied' | 'notMe';

export function markJob(p: Progress, jobId: string, flag: JobFlag, on: boolean, appliedOn?: string): Progress {
  const next = structuredClone(p);
  const j = (next.jobs[jobId] ??= {});
  j[flag] = on;
  if (flag === 'applied') j.appliedOn = on ? appliedOn ?? new Date().toISOString().slice(0, 10) : undefined;
  return next;
}

export function saveJobNote(p: Progress, jobId: string, note: string): Progress {
  const next = structuredClone(p);
  const j = (next.jobs[jobId] ??= {});
  j.note = note;
  return next;
}
