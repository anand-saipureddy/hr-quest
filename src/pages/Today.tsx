import { useState } from 'react';
import { Link } from 'react-router-dom';
import Doodle from '../components/Doodle';
import NextThing from '../components/NextThing';
import StatRow from '../components/StatRow';
import { copy } from '../lib/copy';
import { modules, tracks, jobs } from '../lib/content';
import { suggestions } from '../lib/progress';
import { useProgress } from '../lib/progress-context';

function fullDate(): string {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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

  if (!hydrated) return null;

  const cands = blocked ? [] : suggestions(progress, modules, tracks, jobs);
  const doneAnything =
    Object.keys(progress.lessons).length + Object.keys(progress.tracks).length + Object.keys(progress.jobs).length > 0;

  const lessonsDone = Object.values(progress.lessons).filter((l) => l.done).length;
  const skillsBuilt = Object.values(progress.tracks).filter((t) => t.built).length;
  const applied = Object.values(progress.jobs).filter((j) => j.applied).length;

  const lessonsTotal = modules.reduce((n, m) => n + m.lessons.length, 0);
  const freshJobs = jobs.filter((j) => j.isNew && !progress.jobs[j.id]).length;

  const doors: { key: 'course' | 'skills' | 'jobs'; to: string; title: string; line: string; cue: string }[] = [
    { key: 'course', to: '/course', title: 'Course', line: trimLead(copy.today.howCourse, 'Course — '), cue: lessonsTotal === 1 ? '1 lesson ready →' : `${lessonsTotal} lessons ready →` },
    { key: 'skills', to: '/skills', title: 'Skills', line: trimLead(copy.today.howSkills, 'Skills — '), cue: `${tracks.length} tracks →` },
    { key: 'jobs', to: '/jobs', title: 'Jobs', line: trimLead(copy.today.howJobs, 'Jobs — '), cue: freshJobs > 0 ? `${freshJobs} new in Chennai →` : 'Chennai fresher roles →' },
  ];

  const rail = (
    <aside className="rail">
      <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 20 }}>
        <p style={{ margin: 0, font: '400 14px/1.7 var(--font-ui)', color: 'var(--muted)' }}>{copy.today.purpose}</p>
      </div>
      <div>
        <p style={{ font: '600 10px/1 var(--font-ui)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 4px' }}>{copy.today.thingsDone}</p>
        <StatRow
          items={[
            [lessonsDone, lessonsDone === 1 ? 'lesson done' : 'lessons done'],
            [skillsBuilt, skillsBuilt === 1 ? 'skill built' : 'skills built'],
            [applied, applied === 1 ? 'application sent' : 'applications sent'],
          ]}
        />
      </div>
      <div style={{ background: 'var(--bg)', borderLeft: '2px solid var(--sky-700)', padding: 18 }}>
        <p style={{ font: '600 10px/1 var(--font-ui)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>{copy.today.privateLabel}</p>
        <p style={{ margin: 0, font: '400 12px/1.65 var(--font-ui)', color: 'var(--muted)' }}>{copy.app.yoursOnly}</p>
      </div>
      <div className="scene">
        <Doodle mark="clockArrow" width={280} />
      </div>
    </aside>
  );

  return (
    <div className="page">
      <div className="col">
        <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, marginBottom: 14 }}>
            <p className="kicker" style={{ color: 'var(--muted)', margin: 0, letterSpacing: '.18em' }}>Today</p>
            <p style={{ margin: 0, font: '500 11px/1 var(--font-ui)', letterSpacing: '.06em', color: 'var(--muted)' }}>{fullDate()}</p>
          </div>
          <h1 style={{ fontSize: 34, letterSpacing: '-0.03em', maxWidth: '22ch', margin: 0 }}>{copy.today.heading}</h1>
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

        <div>
          <p className="kicker" style={{ color: 'var(--muted)', margin: '0 0 12px', paddingBottom: 10, borderBottom: '2px solid var(--ink)', letterSpacing: '.18em' }}>{copy.today.spaces}</p>
          <div>
            {doors.map((d) => (
              <Link key={d.key} to={d.to} className="door-row">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Doodle mark={DOOR_ICON[d.key]} width={50} />
                </div>
                <div>
                  <p style={{ font: '600 17px/1.25 var(--font-ui)', margin: '0 0 4px' }}>{d.title}</p>
                  <p style={{ margin: 0, font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>{d.line}</p>
                </div>
                <span className="door-cue">{d.cue}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {rail}
    </div>
  );
}
