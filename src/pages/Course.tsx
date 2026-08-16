import { useSearchParams, Link } from 'react-router-dom';
import Doodle from '../components/Doodle';
import Ring from '../components/Ring';
import { modules } from '../lib/content';
import { useProgress } from '../lib/progress-context';
import { copy } from '../lib/copy';

// Accordion: one module open at a time, open module in the URL as ?m=1.
// Nothing is locked; modules with no authored lessons show as quiet placeholders.
export default function Course() {
  const { progress } = useProgress();
  const [params, setParams] = useSearchParams();
  const open = params.get('m');

  if (modules.length === 0) {
    return (
      <div>
        <Doodle mark="circle" />
        <p style={{ color: 'var(--muted)' }}>The lessons aren't loaded yet.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="col">
        <p className="kicker">Coursera · HR for People Managers</p>
        <h1 style={{ fontSize: 30 }}>The course</h1>
        <Doodle mark="underline" color="var(--sky-500)" />
        <p style={{ margin: '14px 0 26px', maxWidth: '56ch', font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
          Open one when you feel like it — nothing here expires and nothing is in a hurry.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {modules.map((m, i) => {
            const isOpen = open === m.id;
            const hasLessons = m.lessons.length > 0;
            if (!hasLessons) {
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '20px 22px', border: '1px solid var(--line)', background: '#fff', opacity: 0.8 }}>
                  <span style={{ font: '700 28px/1 var(--font-ui)', color: 'var(--sky-300)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ flex: 1, font: '600 18px/1.3 var(--font-ui)', color: 'var(--muted)' }}>{m.title}</span>
                  <span style={{ font: '500 12px/1 var(--font-ui)', color: 'var(--muted)' }}>{copy.course.notWritten}</span>
                </div>
              );
            }
            return (
              <div key={m.id} style={{ border: isOpen ? '2px solid var(--ink)' : '1px solid var(--line)', background: '#fff' }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setParams(isOpen ? {} : { m: m.id }, { replace: true })}
                  style={{
                    display: 'flex', alignItems: 'baseline', gap: 16, width: '100%', textAlign: 'left',
                    padding: '20px 22px', background: isOpen ? 'var(--sky-100)' : '#fff',
                    border: 0, borderBottom: isOpen ? '1px solid var(--line)' : 0, cursor: 'pointer',
                  }}
                >
                  <span style={{ font: '700 28px/1 var(--font-ui)', color: isOpen ? 'var(--sky-700)' : 'var(--sky-300)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ flex: 1, font: '600 18px/1.3 var(--font-ui)' }}>{m.title}</span>
                  <span style={{ font: '500 12px/1 var(--font-ui)', color: isOpen ? 'var(--sky-700)' : 'var(--muted)' }}>
                    {isOpen ? 'Close' : 'Open'}
                  </span>
                </button>
                {isOpen && (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {m.lessons.map((l) => {
                      const done = !!progress.lessons[l.id]?.done;
                      const started = !!progress.lessons[l.id];
                      const chips = [
                        `${l.videos.length} videos`,
                        `${l.mcqs.length} recall questions`,
                        ...(l.scenario ? ['1 interview scenario'] : []),
                        `${l.cards.length} flashcards`,
                      ];
                      return (
                        <li key={l.id} style={{ display: 'grid', gridTemplateColumns: '30px minmax(0,1fr) auto', gap: 16, alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--line)', background: started && !done ? 'var(--bg)' : '#fff' }}>
                          <Ring state={done ? 'done' : started ? 'current' : 'untouched'} />
                          <div>
                            <p style={{ font: '600 16px/1.3 var(--font-ui)', margin: '0 0 6px' }}>{l.title}</p>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {chips.map((c) => (
                                <span key={c} className="pill">{c}</span>
                              ))}
                            </div>
                          </div>
                          <Link to={`/course/${m.id}/${l.id}`} style={{ font: '500 13px/1 var(--font-ui)' }}>
                            {done ? 'Revisit →' : started ? 'Continue →' : 'Open →'}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <aside className="rail">
        <div className="scene">
          <Doodle mark="books" width={210} />
        </div>
        <div>
          <p style={{ font: '600 10px/1 var(--font-ui)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 14px' }}>{copy.course.shape.title}</p>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 14 }}>
            {copy.course.shape.steps.map((s, i) => (
              <li key={s.t} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr)', gap: 12, alignItems: 'start' }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, border: '1px solid var(--line)', background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: '700 12px/1 var(--font-ui)', color: 'var(--muted)' }}>{i + 1}</span>
                <div>
                  <p style={{ margin: 0, font: '600 14px/1.3 var(--font-ui)' }}>{s.t}</p>
                  <p style={{ margin: '3px 0 0', font: '400 12px/1.55 var(--font-ui)', color: 'var(--muted)' }}>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <hr />
        <p className="hand" style={{ fontSize: 19, margin: 0 }}>{copy.course.nothingExpires}</p>
      </aside>
    </div>
  );
}
