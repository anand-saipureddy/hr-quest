import { useEffect, useRef, useState } from 'react';
import { saveJobNote } from '../lib/progress';
import { useProgress } from '../lib/progress-context';
import { pushUndo } from './UndoBar';

// Notes expand in place, saved on this laptop.
export default function JobNote({ jobId }: { jobId: string }) {
  const { progress, set } = useProgress();
  const note = progress.jobs[jobId]?.note ?? '';
  const [open, setOpen] = useState(!!note);
  const [text, setText] = useState(note);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setText(note), [jobId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (v: string) => {
    setText(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const prev = progress;
      set(saveJobNote(progress, jobId, v));
      pushUndo(() => set(prev));
    }, 500);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ background: 'none', border: 'none', padding: 0, font: '500 12px/1 var(--font-ui)', color: 'var(--sky-700)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}
      >
        Add a note
      </button>
    );
  }
  return (
    <div style={{ marginTop: 14, padding: 14, border: '1px dashed var(--sky-300)', borderRadius: 'var(--r-sticker)', background: '#fff' }}>
      <p className="kicker" style={{ color: 'var(--sky-700)' }}>Your note · saved on this laptop</p>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        aria-label="Note about this job"
        placeholder="Recruiter's name, what they said, when."
        style={{ width: '100%', padding: 10, border: '1px solid var(--line)', font: '400 13px/1.6 var(--font-ui)', resize: 'vertical' }}
      />
    </div>
  );
}
