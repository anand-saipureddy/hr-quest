import { NavLink, Outlet } from 'react-router-dom';
import Doodle from './components/Doodle';
import UndoBar from './components/UndoBar';
import { copy } from './lib/copy';

function todayShortLabel(): string {
  const d = new Date();
  const wd = d.toLocaleDateString('en-IN', { weekday: 'short' });
  const mo = d.toLocaleDateString('en-IN', { month: 'short' });
  return `${wd} \u00b7 ${d.getDate()} ${mo}`;
}

export default function App() {
  return (
    <div className="shell">
      <aside className="side">
        <p className="brand">{copy.app.name}</p>
        <p className="hi">{copy.app.greeting}</p>
        <nav aria-label="Sections">
          <NavLink to="/" end>Today</NavLink>
          <NavLink to="/course">Course</NavLink>
          <NavLink to="/skills">Skills</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
        </nav>
        <div className="foot">
          <div
            style={{
              background: 'var(--sky-100)',
              border: '1px solid var(--sky-300)',
              borderRadius: 'var(--r-sticker)',
              padding: '14px 14px 12px',
            }}
          >
            <div className="doodle-bob" style={{ display: 'flex' }}>
              <Doodle mark="sparkle" width={36} />
            </div>
            <p
              className="hand"
              style={{
                fontSize: 16,
                lineHeight: 1.25,
                margin: '6px 0 6px',
                color: 'var(--sky-700)',
              }}
            >
              {copy.app.footnote}
            </p>
            <p
              style={{
                margin: 0,
                font: '500 10px/1.4 var(--font-ui)',
                color: 'var(--muted)',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
              }}
            >
              {todayShortLabel()}
            </p>
          </div>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
      <UndoBar />
    </div>
  );
}
