import { useState } from 'react';
import { Link } from 'react-router-dom';
import Doodle from '../components/Doodle';
import NextThing from '../components/NextThing';
import StatRow from '../components/StatRow';
import { copy } from '../lib/copy';
import { modules, tracks, jobs } from '../lib/content';
import { suggestions } from '../lib/progress';
import { useProgress } from '../lib/progress-context';

function todayLabel(): string {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function Today() {
  const { progress, blocked, hydrated } = useProgress();
  const [idx, setIdx] = useState(0);

  if (!hydrated) return null; // pre-hydration: render nothing yet

  if (blocked) {
    return (
      <div>
        <p className="kicker">{todayLabel()}</p>
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

  // Door cards: static area descriptors, never tallies of undone work
  const lessonsTotal = modules.reduce((n, m) => n + m.lessons.length, 0);
  const freshJobs = jobs.filter((j) => j.isNew && !progress.jobs[j.id]).length;
  const startedTrack = tracks.find((t) => {
    const st = progress.tracks[t.id];
    return st && !st.built && Object.keys(st.drills).length > 0;
  });

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', right: 0, top: -8 }} className="doodle-bob deco">
        <Doodle mark="cloud" width={110} />
      </div>
      <div style={{ position: 'absolute', right: 120, top: 40 }} className="deco">
        <Doodle mark="sparkle" width={34} />
      </div>
      <p className="kicker">{todayLabel()}</p>
      <h1 style={{ fontSize: 30, maxWidth: '20ch' }}>{copy.today.heading}</h1>
      <p style={{ margin: '12px 0 0', maxWidth: '58ch', font: '400 15px/1.65 var(--font-ui)', color: 'var(--muted)' }}>
        {copy.today.purpose}
      </p>

      <details className="how" style={{ marginTop: 18, maxWidth: 560 }}>
        <summary>{copy.today.howItWorks}</summary>
        <ul>
          <li>{copy.today.howCourse}</li>
          <li>{copy.today.howSkills}</li>
          <li>{copy.today.howJobs}</li>
        </ul>
      </details>

      <div style={{ marginTop: 24 }}>
        {cands.length === 0 ? (
          <div className="card ink sky" style={{ padding: 22, maxWidth: 520 }}>
            <p style={{ margin: 0, font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
              {doneAnything ? copy.today.allCaughtUp : copy.today.freshInstall}
            </p>
          </div>
        ) : (
          <NextThing s={cands[idx % cands.length]} hasMore={cands.length > 1} onShuffle={() => setIdx((i) => i + 1)} />
        )}
      </div>

      {doneAnything && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 26, flexWrap: 'wrap' }}>
          <StatRow
            items={[
              [lessonsDone, lessonsDone === 1 ? 'lesson done' : 'lessons done'],
              [skillsBuilt, skillsBuilt === 1 ? 'skill built' : 'skills built'],
              [applied, applied === 1 ? 'application sent' : 'applications sent'],
            ]}
          />
          <span className="hand" style={{ fontSize: 18, marginLeft: 'auto' }}>{copy.app.yoursOnly}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginTop: 26 }}>
        <Link to="/course" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p style={{ font: '600 15px/1.2 var(--font-ui)', margin: '0 0 6px' }}>Course</p>
          <p style={{ margin: 0, font: '400 12px/1.5 var(--font-ui)', color: 'var(--muted)' }}>
            {lessonsTotal === 1 ? '1 lesson ready' : `${lessonsTotal} lessons ready`}
          </p>
        </Link>
        <Link to="/skills" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p style={{ font: '600 15px/1.2 var(--font-ui)', margin: '0 0 6px' }}>Skills</p>
          <p style={{ margin: 0, font: '400 12px/1.5 var(--font-ui)', color: 'var(--muted)' }}>
            7 tracks{startedTrack ? ` · ${startedTrack.short} in progress` : ''}
          </p>
        </Link>
        <Link to="/jobs" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p style={{ font: '600 15px/1.2 var(--font-ui)', margin: '0 0 6px' }}>Jobs</p>
          <p style={{ margin: 0, font: '400 12px/1.5 var(--font-ui)', color: 'var(--muted)' }}>
            {freshJobs > 0 ? `${freshJobs} new in Chennai` : 'Chennai fresher roles'}
          </p>
        </Link>
      </div>
    </div>
  );
}
