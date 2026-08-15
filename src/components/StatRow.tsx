// Plain counts of things she has done. Never outstanding, never a percentage.
export default function StatRow({ items }: { items: [number, string][] }) {
  return (
    <div style={{ display: 'flex', gap: 26, marginTop: 32, paddingTop: 22, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
      {items.map(([n, label]) => (
        <div key={label}>
          <b style={{ display: 'block', font: '700 24px/1 var(--font-ui)' }}>{n}</b>
          <span style={{ font: '400 12px/1.4 var(--font-ui)', color: 'var(--muted)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
