import { NavLink, Outlet } from 'react-router-dom';
import UndoBar from './components/UndoBar';
import { modules, tracks, jobs } from './lib/content';
import { suggestions } from './lib/progress';
import { useProgress } from './lib/progress-context';
import { copy } from './lib/copy';

export default function App() {
  const { progress } = useProgress();

  // Sidebar figures — sizes of her own lists, never scores.
  const todayN = suggestions(progress, modules, tracks, jobs).length;
  const courseN = modules.reduce((n, m) => n + m.lessons.length, 0);
  const skillsN = tracks.length;
  const jobsN = jobs.filter((j) => j.isNew).length;

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">
          <p className="brand-name">{copy.app.name}</p>
          <p className="hi">{copy.app.greeting}</p>
        </div>
        <nav aria-label="Sections">
          <NavLink to="/" end>
            <span>Today</span>
            <span className="fig">{copy.nav.today(todayN)}</span>
          </NavLink>
          <NavLink to="/course">
            <span>Course</span>
            <span className="fig">{copy.nav.course(courseN)}</span>
          </NavLink>
          <NavLink to="/skills">
            <span>Skills</span>
            <span className="fig">{copy.nav.skills(skillsN)}</span>
          </NavLink>
          <NavLink to="/jobs">
            <span>Jobs</span>
            <span className="fig">{copy.nav.jobs(jobsN)}</span>
          </NavLink>
        </nav>
        <div className="foot">
          <span className="dot" aria-hidden="true" />
          <p>{copy.app.footnote}</p>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
      <UndoBar />
    </div>
  );
}
