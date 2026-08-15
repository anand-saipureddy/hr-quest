import { fitWord } from '../lib/fit';

// Word first, number second — a bare 62% reads as a verdict on her.
export default function FitBadge({ fit }: { fit: number }) {
  const strong = fit >= 85;
  return (
    <div style={{ width: 74 }}>
      <span
        style={{
          display: 'inline-block', padding: '4px 9px',
          background: strong ? 'var(--sky-200)' : 'transparent',
          border: strong ? 'none' : '1px solid var(--line)',
          font: '700 11px/1.2 var(--font-ui)', letterSpacing: '.04em', textTransform: 'uppercase',
          color: strong ? 'var(--ink)' : 'var(--muted)',
        }}
      >
        {fitWord(fit)}
      </span>
      <p style={{ margin: '6px 0 0', font: '500 11px/1 var(--font-ui)', color: 'var(--muted)' }}>{fit}% match</p>
    </div>
  );
}
