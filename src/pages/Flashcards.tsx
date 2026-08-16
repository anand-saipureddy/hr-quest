import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import Doodle from '../components/Doodle';
import { modules } from '../lib/content';
import { copy } from '../lib/copy';

// No deck ever goes overdue. Closing and reopening starts clean.
export default function Flashcards() {
  const { moduleId, lessonId } = useParams();
  const lesson = modules.find((m) => m.id === moduleId)?.lessons.find((l) => l.id === lessonId);
  const [idx, setIdx] = useState(0);

  if (!lesson) {
    return (
      <div>
        <p style={{ margin: '0 0 14px' }}>
          <Link to="/course" style={{ font: '500 13px/1 var(--font-ui)', color: 'var(--muted)', textDecoration: 'none' }}>{copy.app.backToCourse}</Link>
        </p>
        <Doodle mark="cloud" width={100} />
        <p style={{ color: 'var(--muted)' }}>That card set isn't here yet.</p>
      </div>
    );
  }

  const card = lesson.cards[idx];
  return (
    <div>
      <p style={{ margin: '0 0 14px' }}>
        <Link to={`/course/${moduleId}/${lessonId}`} style={{ font: '500 13px/1 var(--font-ui)', color: 'var(--muted)', textDecoration: 'none' }}>{copy.app.backToLesson}</Link>
      </p>
      <p className="kicker">{lesson.title} · {lesson.cards.length} cards</p>
      <h1 style={{ fontSize: 26, marginBottom: 22 }}>Terms from this lesson</h1>
      <div className="page">
        <div className="col" style={{ justifyContent: 'center' }}>
          <div style={{ position: 'relative', maxWidth: 520 }}>
            <div style={{ position: 'absolute', left: 10, top: 10, right: -10, bottom: -10, border: '1px solid var(--sky-200)', borderRadius: 'var(--r-sticker)', background: 'var(--bg)' }} aria-hidden="true" />
            <div style={{ position: 'relative' }}>
              <Flashcard key={`${lesson.id}-${idx}`} front={card.front} back={card.back} />
            </div>
            <div style={{ position: 'absolute', right: -46, top: -22 }}>
              <Doodle mark="star" width={54} />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 22 }}>
              <button className="btn quiet" type="button" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)} style={idx === 0 ? { opacity: 0.5 } : undefined}>
                Previous
              </button>
              <button className="btn primary" type="button" onClick={() => setIdx((i) => (i + 1) % lesson.cards.length)}>
                {idx === lesson.cards.length - 1 ? 'Back to the first card' : 'Next card'}
              </button>
            </div>
          </div>
        </div>
        <aside className="rail">
          <p style={{ font: '600 10px/1 var(--font-ui)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 12px' }}>This set</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {lesson.cards.map((c, n) => (
              <button
                key={n}
                type="button"
                onClick={() => setIdx(n)}
                style={{
                  padding: '9px 12px', borderRadius: 'var(--r-pill)', cursor: 'pointer', textAlign: 'left',
                  border: n === idx ? '2px solid var(--sky-700)' : '1px solid var(--line)',
                  background: n === idx ? '#fff' : n < idx ? 'var(--sky-100)' : '#fff',
                  font: `${n === idx ? 600 : 400} 12px/1.2 var(--font-ui)`,
                  color: n === idx ? 'var(--ink)' : 'var(--muted)',
                }}
              >
                {c.front}
              </button>
            ))}
          </div>
          <p className="hand" style={{ margin: '16px 0 0', fontSize: 17 }}>no deck ever goes "overdue"</p>
        </aside>
      </div>
    </div>
  );
}
