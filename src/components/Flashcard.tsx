import { useState } from 'react';

// Front/back flip. No spaced repetition, no due dates, nothing accumulates
// between visits — deck state lives only in this component's useState.
export default function Flashcard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      style={{
        position: 'relative', width: '100%', minHeight: 200, textAlign: 'left',
        border: '2px solid var(--ink)', borderRadius: 'var(--r-sticker)',
        background: '#fff', padding: '32px 28px', cursor: 'pointer',
        transition: 'background 180ms ease',
      }}
    >
      <p className="kicker">{flipped ? 'Back' : 'Front'}</p>
      <p style={{ font: flipped ? '400 15px/1.65 var(--font-ui)' : '700 24px/1.25 var(--font-ui)', letterSpacing: flipped ? 0 : '-0.02em', margin: 0 }}>
        {flipped ? back : front}
      </p>
      <p style={{ margin: '18px 0 0', font: '400 12px/1.5 var(--font-ui)', color: 'var(--muted)' }}>
        {flipped ? 'Tap to see the term again.' : "Tap the card to see what it means. Or don't — reading the terms is useful on its own."}
      </p>
    </button>
  );
}
