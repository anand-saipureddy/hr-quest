import { NavLink, Outlet } from 'react-router-dom';
import UndoBar from './components/UndoBar';

export default function App() {
  return (
    <div className="shell">
      <aside className="side">
        <p className="brand">HR Quest</p>
        <p className="hi">hi Anu</p>
        <nav aria-label="Sections">
          <NavLink to="/" end>Today</NavLink>
          <NavLink to="/course">Course</NavLink>
          <NavLink to="/skills">Skills</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
        </nav>
        <div className="foot">
          <span style={{ font: '500 13px/1 var(--font-ui)', color: 'var(--muted)' }}>Take a break</span>
          <p>Everything stays on this laptop.</p>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
      <UndoBar />
    </div>
  );
}
