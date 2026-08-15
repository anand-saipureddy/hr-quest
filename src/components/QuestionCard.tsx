import { useState } from 'react';
import { copy } from '../lib/copy';
import { markMcq, unmarkMcq, type Mcq } from '../lib/progress';
import { useProgress } from '../lib/progress-context';
import { pushUndo } from './UndoBar';

// One question at a time. teach before options; why after answering, for
// right AND wrong. Wrong = strikethrough + one-line why, never "Incorrect".
// "Change my answer" is always available.
export default function QuestionCard({ lessonId, n, mcq, onNext, isLast }: { lessonId: string; n: number; mcq: Mcq; onNext: () => void; isLast: boolean }) {
  const { progress, set } = useProgress();
  const picked = progress.lessons[lessonId]?.mcqs[n];
  const answered = picked !== undefined;
  const right = answered && picked === mcq.answer;

  const choose = (i: number) => {
    const prev = progress;
    set(markMcq(progress, lessonId, n, i));
    pushUndo(() => set(prev === progress ? unmarkMcq(progress, lessonId, n) : prev));
  };
  const change = () => {
    set(unmarkMcq(progress, lessonId, n));
  };

  return (
    <div style={{ border: '2px solid var(--ink)', borderRadius: 'var(--r-sticker)', padding: 20, background: '#fff' }}>
      <p className="kicker">Recall</p>
      <p style={{ font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)', margin: '0 0 14px' }}>{mcq.teach}</p>
      <p style={{ font: '600 16px/1.45 var(--font-ui)', margin: '0 0 16px' }}>{mcq.q}</p>
      <div style={{ display: 'grid', gap: 8 }}>
        {mcq.options.map((o, i) => {
          const isPick = picked === i;
          const isAnswer = i === mcq.answer;
          const style: React.CSSProperties = answered
            ? isAnswer
              ? { border: '2px solid var(--sky-700)', background: 'var(--sky-100)', fontWeight: 600 }
              : isPick
                ? { border: '1px solid var(--line)', textDecoration: 'line-through', color: 'var(--muted)' }
                : { border: '1px solid var(--line)', color: 'var(--muted)' }
            : { border: '1px solid var(--line)' };
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => choose(i)}
              style={{ display: 'block', textAlign: 'left', padding: '13px 15px', borderRadius: 'var(--r-sticker)', background: '#fff', font: '400 14px/1.4 var(--font-ui)', cursor: answered ? 'default' : 'pointer', ...style }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {answered && (
        <p style={{ margin: '16px 0 0', font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
          <b style={{ color: 'var(--ink)' }}>{right ? copy.lesson.thatsIt : copy.lesson.notQuite}</b> {mcq.why}{' '}
          <span style={{ fontSize: 12 }}>({mcq.source})</span>
        </p>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
        {answered && (
          <button className="btn primary" type="button" onClick={onNext}>
            {isLast ? 'On to the scenario' : copy.lesson.nextQuestion}
          </button>
        )}
        {answered && (
          <button className="btn quiet" type="button" onClick={change}>
            {copy.lesson.changeMyAnswer}
          </button>
        )}
      </div>
    </div>
  );
}
