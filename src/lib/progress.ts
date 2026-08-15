import type { Progress } from './storage';

export type Video = { n: number; title: string };
export type Mcq = { q: string; teach: string; options: string[]; answer: number; why: string; source: string };
export type Scenario = { prompt: string; model: string; source: string };
export type Lesson = { id: string; title: string; videos: Video[]; mcqs: Mcq[]; scenario: Scenario | null; cards: { front: string; back: string }[] };
export type Module = { id: string; title: string; lessons: Lesson[] };
export type Track = {
  id: string; name: string; short: string; blurb: string;
  setup: { title: string; cta: string; why: string; steps: string[]; copyLabel: string; note: string; data: string };
  drills: Mcq[];
  build: { title: string; what: string; steps: string[]; howYouKnow: string[]; doneLabel?: string };
};
export type Job = {
  id: string; url: string; company: string; title: string; location: string;
  src: 'naukri' | 'linkedin' | 'internshala' | 'indeed';
  fit: number; firstSeen: string; isNew: boolean;
  posted?: string; salary?: string; exp?: string;
};

// Today's one suggestion: first unfinished lesson → else first unfinished
// track step → else new jobs → else caught up. Candidates are cycled by the
// "Something else instead" button.
export type Suggestion =
  | { kind: 'lesson'; label: string; to: string; note: string }
  | { kind: 'track'; label: string; to: string; note: string }
  | { kind: 'jobs'; label: string; to: string; note: string };

export function suggestions(p: Progress, modules: Module[], tracks: Track[], jobs: Job[]): Suggestion[] {
  const out: Suggestion[] = [];
  for (const m of modules) {
    for (const l of m.lessons) {
      if (!p.lessons[l.id]?.done) {
        out.push({
          kind: 'lesson',
          label: `${m.title}, ${l.title}`,
          to: `/course/${m.id}/${l.id}`,
          note: 'A short lesson, then a few questions. You can stop after the video and the questions will wait.',
        });
      }
    }
  }
  for (const t of tracks) {
    const st = p.tracks[t.id];
    const firstOpen = t.drills.findIndex((_, n) => st?.drills[n] === undefined);
    if (firstOpen > -1 || !st?.built) {
      out.push({
        kind: 'track',
        label: t.name,
        to: `/skills/${t.id}`,
        note: 'Build the thing first, then answer a few questions about it.',
      });
    }
  }
  const fresh = jobs.filter((j) => j.isNew && !p.jobs[j.id]).length;
  if (fresh > 0) {
    out.push({
      kind: 'jobs',
      label: fresh === 1 ? 'One new opening in Chennai' : `${fresh} new openings in Chennai`,
      to: '/jobs',
      note: 'Fresher HR roles, refreshed weekly. Read one and decide later.',
    });
  }
  return out;
}

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
