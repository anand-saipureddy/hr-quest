import { useEffect, useState } from 'react';
import { copy } from '../lib/copy';

// After any state change, a quiet bar offers Undo. No confirmation dialogs
// anywhere — undo replaces them.
type Entry = { undo: () => void } | null;
let current: Entry = null;
const subs = new Set<() => void>();

export function pushUndo(undo: () => void) {
  current = { undo };
  subs.forEach((f) => f());
}

export default function UndoBar() {
  const [, tick] = useState(0);
  const [entry, setEntry] = useState<Entry>(current);

  useEffect(() => {
    const sync = () => {
      setEntry(current);
      tick((n) => n + 1);
    };
    subs.add(sync);
    return () => void subs.delete(sync);
  }, []);

  useEffect(() => {
    if (!entry) return;
    const t = setTimeout(() => {
      current = null;
      setEntry(null);
    }, 8000);
    return () => clearTimeout(t);
  }, [entry]);

  if (!entry) return null;
  return (
    <div
      role="status"
      style={{
        position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)',
        background: 'var(--ink)', color: '#fff', padding: '10px 18px',
        borderRadius: 'var(--r-pill)', font: '500 13px/1 var(--font-ui)',
        display: 'flex', gap: 14, alignItems: 'center', zIndex: 50,
      }}
    >
      Done.
      <button
        onClick={() => {
          entry.undo();
          current = null;
          setEntry(null);
        }}
        style={{
          background: 'none', border: 'none', color: 'var(--sky-200)',
          font: '600 13px/1 var(--font-ui)', padding: 8, cursor: 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 2,
        }}
      >
        {copy.undo}
      </button>
    </div>
  );
}
