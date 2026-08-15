// A ring, never a checkbox. done = filled sky-200 with tick,
// current = 2px sky-700 outline, untouched = 1px grey.
export default function Ring({ state }: { state: 'done' | 'current' | 'untouched' }) {
  const style: React.CSSProperties =
    state === 'done'
      ? { background: 'var(--sky-200)', border: '2px solid var(--sky-200)' }
      : state === 'current'
        ? { background: '#fff', border: '2px solid var(--sky-700)' }
        : { background: '#fff', border: '1px solid var(--line)' };
  return (
    <span
      aria-hidden="true"
      style={{
        flex: 'none', width: 30, height: 30, borderRadius: 'var(--r-pill)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        font: '700 12px/1 var(--font-ui)', color: 'var(--ink)', ...style,
      }}
    >
      {state === 'done' ? '✓' : ''}
    </span>
  );
}
