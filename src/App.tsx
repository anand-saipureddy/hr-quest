import { NavLink, Outlet } from 'react-router-dom';
import Doodle from './components/Doodle';
import UndoBar from './components/UndoBar';
import { copy } from './lib/copy';

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
          <div className="doodle-bob" style={{ display: 'flex', justifyContent: 'flex-start' }}><Doodle mark="sparkle" width={50} /></div>
          <p className="hand" style={{ fontSize: 17, margin: '6px 0 0' }}>{copy.app.footnote}</p>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
      <UndoBar />
    </div>
  );
}
