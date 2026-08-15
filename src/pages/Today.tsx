import { useState } from 'react';
import Doodle from '../components/Doodle';
import NextThing from '../components/NextThing';
import StatRow from '../components/StatRow';
import { copy } from '../lib/copy';
import { modules, tracks, jobs } from '../lib/content';
import { suggestions } from '../lib/progress';
import { useProgress } from '../lib/progress-context';

export default function Today() {
  const { progress, blocked, hydrated } = useProgress();
  const [idx, setIdx] = useState(0);

  if (!hydrated) return null; // pre-hydration: render nothing yet

  if (blocked) {
    return (
      <div>
        <p className="kicker">Today</p>
        <h1 style={{ fontSize: 30, maxWidth: '22ch' }}>{copy.today.heading}</h1>
        <p style={{ maxWidth: '56ch', color: 'var(--muted)' }}>{copy.today.storageBlocked}</p>
      </div>
    );
  }

  const cands = suggestions(progress, modules, tracks, jobs);
  const doneAnything =
    Object.keys(progress.lessons).length + Object.keys(progress.tracks).length + Object.keys(progress.jobs).length > 0;

  const lessonsDone = Object.values(progress.lessons).filter((l) => l.done).length;
  const skillsBuilt = Object.values(progress.tracks).filter((t) => t.built).length;
  const applied = Object.values(progress.jobs).filter((j) => j.applied).length;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', right: 18, top: 0 }}>
        <Doodle mark="circle" color="var(--sky-200)" />
      </div>
      <p className="kicker">Today</p>
      <h1 style={{ fontSize: 30, maxWidth: '22ch' }}>{copy.today.heading}</h1>

      <div style={{ marginTop: 24 }}>
        {cands.length === 0 ? (
          <div style={{ border: '2px solid var(--ink)', borderRadius: 'var(--r-sticker)', background: 'var(--sky-100)', padding: 22, maxWidth: 520 }}>
            <p style={{ margin: 0, font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
              {doneAnything ? copy.today.allCaughtUp : copy.today.freshInstall}
            </p>
          </div>
        ) : (
          <NextThing s={cands[idx % cands.length]} hasMore={cands.length > 1} onShuffle={() => setIdx((i) => i + 1)} />
        )}
      </div>

      {doneAnything && (
        <StatRow
          items={[
            [lessonsDone, lessonsDone === 1 ? 'lesson done' : 'lessons done'],
            [skillsBuilt, skillsBuilt === 1 ? 'skill built' : 'skills built'],
            [applied, applied === 1 ? 'application sent' : 'applications sent'],
          ]}
        />
      )}
    </div>
  );
}
