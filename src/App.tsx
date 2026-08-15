import { NavLink, Outlet } from 'react-router-dom';
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
