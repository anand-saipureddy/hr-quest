import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Doodle from '../components/Doodle';
import QuestionCard from '../components/QuestionCard';
import ScenarioBox from '../components/ScenarioBox';
import { modules } from '../lib/content';
import { markLessonDone } from '../lib/progress';
import { useProgress } from '../lib/progress-context';
import { pushUndo } from '../components/UndoBar';

// The important one. Sequence: recall MCQs (one visible) → written interview
// scenario → flashcards link. Progress as dots, never "1 of 3".
export default function Lesson() {
  const { moduleId, lessonId } = useParams();
  const mod = modules.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  const { progress, set } = useProgress();
  const [q, setQ] = useState(0);

  if (!mod || !lesson) {
    return (
      <div>
        <Doodle mark="circle" />
        <p style={{ color: 'var(--muted)' }}>That lesson isn't here yet.</p>
        <Link to="/course">Back to the course</Link>
      </div>
    );
  }

  const answeredCount = lesson.mcqs.filter((_, n) => progress.lessons[lesson.id]?.mcqs[n] !== undefined).length;
  const allAnswered = answeredCount === lesson.mcqs.length;
  const done = !!progress.lessons[lesson.id]?.done;
  const showScenario = allAnswered || done;

  const finish = () => {
    const prev = progress;
    set(markLessonDone(progress, lesson.id, true));
    pushUndo(() => set(markLessonDone(prev, lesson.id, false)));
  };

  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: 16, marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p className="kicker">{mod.title} · {lesson.title}</p>
          <h1 style={{ fontSize: 24 }}>{lesson.title}</h1>
        </div>
        <Link to="/course" style={{ font: '500 12px/1 var(--font-ui)', color: 'var(--muted)', whiteSpace: 'nowrap' }}>Save &amp; come back</Link>
      </div>

      <div className="lesson-grid">
        <div className="lesson-left">
          <p style={{ margin: '0 0 4px', font: '600 12px/1 var(--font-ui)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--sky-700)' }}>Watch on Coursera first</p>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'grid', gap: 8 }}>
            {lesson.videos.map((v) => (
              <li key={v.n} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 'var(--r-sticker)', background: '#fff' }}>
                <span style={{ flex: 'none', width: 26, height: 26, borderRadius: 'var(--r-pill)', background: 'var(--sky-200)', font: '700 12px/26px var(--font-ui)', textAlign: 'center' }}>{v.n}</span>
                <span style={{ font: '500 14px/1.35 var(--font-ui)' }}>{v.title}</span>
              </li>
            ))}
          </ul>
          <p style={{ margin: '12px 0 0', font: '400 11px/1.5 var(--font-ui)', color: 'var(--muted)' }}>
            The videos live on Coursera; the questions below are from their transcripts.
          </p>
        </div>

        <div className="lesson-right">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {lesson.mcqs.map((_, n) => {
          const answered = progress.lessons[lesson.id]?.mcqs[n] !== undefined;
          const current = n === q && !showScenario;
          return (
            <button
              key={n}
              type="button"
              aria-label={`Question ${n + 1}${answered ? ', answered' : ''}`}
              onClick={() => setQ(n)}
              style={{
                width: 12, height: 12, borderRadius: 'var(--r-pill)', padding: 0, cursor: 'pointer',
                border: current ? '2px solid var(--sky-700)' : 'none',
                background: answered ? 'var(--sky-700)' : 'var(--sky-200)',
              }}
            />
          );
        })}
        <span style={{ marginLeft: 6, font: '400 12px/1 var(--font-ui)', color: 'var(--muted)' }}>
          {lesson.mcqs.length} questions, no timer
        </span>
      </div>

      {!showScenario && (
        <p className="hand" style={{ margin: '0 0 14px', fontSize: 18 }}>
          stop here any time — it's saved ✓
        </p>
      )}

      {!showScenario ? (
        <>
          <QuestionCard
            lessonId={lesson.id}
            n={q}
            mcq={lesson.mcqs[q]}
            isLast={q === lesson.mcqs.length - 1}
            onNext={() => (q < lesson.mcqs.length - 1 ? setQ(q + 1) : undefined)}
          />
          {lesson.scenario && (
            <div style={{ marginTop: 14, border: '1px dashed var(--sky-300)', borderRadius: 'var(--r-sticker)', padding: 16, background: 'var(--bg)' }}>
              <p className="kicker" style={{ color: 'var(--sky-700)' }}>Next up · interview scenario</p>
              <p style={{ margin: 0, font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
                A short written answer to a real interview question — nobody marks it but you.
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'grid', gap: 18 }}>
          {lesson.scenario && <ScenarioBox lessonId={lesson.id} scenario={lesson.scenario} />}
          {!done ? (
            <button className="btn primary" type="button" onClick={finish} style={{ justifySelf: 'start' }}>
              Mark this lesson done
            </button>
          ) : (
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Doodle mark="sparkle" width={40} />
              <span className="hand" style={{ fontSize: 18 }}>lesson done — you can still change any answer above</span>
            </p>
          )}
          <Link to={`/course/${mod.id}/${lesson.id}/cards`} style={{ font: '500 14px/1 var(--font-ui)' }}>
            Review the flashcards from this lesson →
          </Link>
          <p style={{ margin: 0 }}>
            <button
              type="button"
              onClick={() => setQ(0)}
              style={{ background: 'none', border: 'none', padding: 0, font: '500 13px/1 var(--font-ui)', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}
            >
              Go back over the questions
            </button>
          </p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
