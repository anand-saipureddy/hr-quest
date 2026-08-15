import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import UndoBar from './components/UndoBar';
import { copy } from './lib/copy';
import { loadPrefs, savePrefs } from './lib/prefs';

export default function App() {
  const [lowStim, setLowStim] = useState(false);

  useEffect(() => {
    const p = loadPrefs();
    setLowStim(p.lowStim);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.lowstim = lowStim ? 'true' : 'false';
    savePrefs({ lowStim });
  }, [lowStim]);

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
          <NavLink to="/break">{copy.app.takeABreak}</NavLink>
          <button
            type="button"
            className="quiet-toggle"
            aria-pressed={lowStim}
            onClick={() => setLowStim((v) => !v)}
            title={copy.app.quietHint}
          >
            {lowStim ? copy.app.lowStimOff : copy.app.lowStimOn}
          </button>
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
