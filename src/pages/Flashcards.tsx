import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import Doodle from '../components/Doodle';
import { modules } from '../lib/content';

// No deck ever goes overdue. Closing and reopening starts clean.
export default function Flashcards() {
  const { moduleId, lessonId } = useParams();
  const lesson = modules.find((m) => m.id === moduleId)?.lessons.find((l) => l.id === lessonId);
  const [idx, setIdx] = useState(0);

  if (!lesson) {
    return (
      <div>
        <Doodle mark="circle" />
        <p style={{ color: 'var(--muted)' }}>That card set isn't here yet.</p>
        <Link to="/course">Back to the course</Link>
      </div>
    );
  }

  const card = lesson.cards[idx];
  return (
    <div style={{ maxWidth: 640 }}>
      <p className="kicker">{lesson.title} · {lesson.cards.length} cards</p>
      <h1 style={{ fontSize: 26 }}>Terms from this lesson</h1>
      <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
        <Flashcard key={`${lesson.id}-${idx}`} front={card.front} back={card.back} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn quiet" type="button" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)} style={idx === 0 ? { opacity: 0.5 } : undefined}>
            Previous
          </button>
          <button className="btn primary" type="button" onClick={() => setIdx((i) => (i + 1) % lesson.cards.length)}>
            {idx === lesson.cards.length - 1 ? 'Back to the first card' : 'Next card'}
          </button>
          <span style={{ font: '700 17px/1.3 var(--font-hand)', color: 'var(--sky-700)' }}>no deck ever goes "overdue"</span>
        </div>
        <p style={{ margin: '6px 0 0' }}>
          <Link to={`/course/${moduleId}/${lessonId}`} style={{ font: '500 13px/1 var(--font-ui)' }}>← Back to the lesson</Link>
        </p>
      </div>
    </div>
  );
}
