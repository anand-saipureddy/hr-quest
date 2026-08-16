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

const DOOR_ICON: Record<'course' | 'skills' | 'jobs', 'book' | 'hammer' | 'briefcase'> = {
  course: 'book',
  skills: 'hammer',
  jobs: 'briefcase',
};

const trimLead = (s: string, lead: string) => (s.startsWith(lead) ? s.slice(lead.length) : s);

export default function Today() {
  const { progress, blocked, hydrated } = useProgress();
  const [idx, setIdx] = useState(0);

  if (!hydrated) return null; // pre-hydration: render nothing yet

  const cands = blocked ? [] : suggestions(progress, modules, tracks, jobs);
  const doneAnything =
    Object.keys(progress.lessons).length + Object.keys(progress.tracks).length + Object.keys(progress.jobs).length > 0;

  const lessonsDone = Object.values(progress.lessons).filter((l) => l.done).length;
  const skillsBuilt = Object.values(progress.tracks).filter((t) => t.built).length;
  const applied = Object.values(progress.jobs).filter((j) => j.applied).length;

  // Door cards: static area descriptors, never tallies of undone work
  const lessonsTotal = modules.reduce((n, m) => n + m.lessons.length, 0);
  const freshJobs = jobs.filter((j) => j.isNew && !progress.jobs[j.id]).length;

  const doors: { key: 'course' | 'skills' | 'jobs'; to: string; title: string; line: string; cue: string }[] = [
    {
      key: 'course',
      to: '/course',
      title: 'Course',
      line: trimLead(copy.today.howCourse, 'Course — '),
      cue: lessonsTotal === 1 ? '1 lesson ready →' : `${lessonsTotal} lessons ready →`,
    },
    {
      key: 'skills',
      to: '/skills',
      title: 'Skills',
      line: trimLead(copy.today.howSkills, 'Skills — '),
      cue: `${tracks.length} tracks →`,
    },
    {
      key: 'jobs',
      to: '/jobs',
      title: 'Jobs',
      line: trimLead(copy.today.howJobs, 'Jobs — '),
      cue: freshJobs > 0 ? `${freshJobs} new in Chennai →` : 'Chennai fresher roles →',
    },
  ];

  const rail = (
    <aside className="rail">
      <p style={{ margin: 0, font: '400 14px/1.7 var(--font-ui)', color: 'var(--muted)' }}>{copy.today.purpose}</p>
      {doneAnything && (
        <>
          <hr />
          <div>
            <p style={{ font: '600 10px/1 var(--font-ui)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 14px' }}>{copy.today.thingsDone}</p>
            <StatRow
              items={[
                [lessonsDone, lessonsDone === 1 ? 'lesson done' : 'lessons done'],
                [skillsBuilt, skillsBuilt === 1 ? 'skill built' : 'skills built'],
                [applied, applied === 1 ? 'application sent' : 'applications sent'],
              ]}
            />
          </div>
        </>
      )}
      <hr />
      <div style={{ background: 'var(--bg)', border: '1px dashed var(--sky-300)', padding: '18px 18px 20px' }}>
        <p className="hand" style={{ fontSize: 20, margin: 0 }}>{copy.app.yoursOnly}</p>
      </div>
      <div className="spacer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Doodle mark="clockArrow" width={150} />
      </div>
    </aside>
  );

  return (
    <div className="page">
      <div className="col" style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div>
          <p className="kicker">{todayLabel()}</p>
          <h1 style={{ fontSize: 32, maxWidth: '22ch' }}>{copy.today.heading}</h1>
        </div>

        {blocked ? (
          <p style={{ maxWidth: '56ch', color: 'var(--muted)' }}>{copy.today.storageBlocked}</p>
        ) : cands.length === 0 ? (
          <div className="card ink sky" style={{ padding: 22, maxWidth: 560 }}>
            <p style={{ margin: 0, font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
              {doneAnything ? copy.today.allCaughtUp : copy.today.freshInstall}
            </p>
          </div>
        ) : (
          <NextThing s={cands[idx % cands.length]} hasMore={cands.length > 1} onShuffle={() => setIdx((i) => i + 1)} />
        )}

        <div style={{ display: 'grid', gap: 10 }}>
          {doors.map((d) => (
            <Link
              key={d.key}
              to={d.to}
              style={{ display: 'grid', gridTemplateColumns: '56px minmax(0,1fr) auto', alignItems: 'center', gap: 18, border: '1px solid var(--line)', background: '#fff', padding: '18px 20px', textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Doodle mark={DOOR_ICON[d.key]} width={50} />
              </div>
              <div>
                <p style={{ font: '600 17px/1.25 var(--font-ui)', margin: '0 0 4px' }}>{d.title}</p>
                <p style={{ margin: 0, font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>{d.line}</p>
              </div>
              <span style={{ font: '500 13px/1 var(--font-ui)', color: 'var(--sky-700)', whiteSpace: 'nowrap' }}>{d.cue}</span>
            </Link>
          ))}
        </div>
      </div>
      {rail}
    </div>
  );
}
