type Mark = 'underline' | 'circle' | 'arrow' | 'star' | 'squiggle' | 'sparkle' | 'cloud' | 'clock';

// The doodle kit from the spec. Decorative — aria-hidden, never the sole
// carrier of meaning. Blush and sun fills are doodle-only.
export default function Doodle({ mark, color = 'var(--sky-300)', width = 90 }: { mark: Mark; color?: string; width?: number }) {
  const stroke = { fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round' as const };
  const vb = mark === 'cloud' || mark === 'clock' ? '0 0 120 60' : '0 0 90 40';
  const h = mark === 'cloud' || mark === 'clock' ? width / 2 : (width * 40) / 90;
  return (
    <svg viewBox={vb} width={width} height={h} aria-hidden="true" className="doodle">
      {mark === 'underline' && <path d="M4 30c8-12 16 4 24-6s14 8 22-2 12 4 16 0" {...stroke} />}
      {mark === 'squiggle' && <path d="M6 34c14-2 10-22 24-22s10 18 22 14 8-18 20-14" {...stroke} strokeDasharray="1 7" />}
      {mark === 'circle' && <circle cx="45" cy="20" r="15" {...stroke} />}
      {mark === 'star' && <path d="M45 4l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.5" />}
      {mark === 'arrow' && <path d="M8 8c18 0 30 8 30 18M38 26l-8-4M38 26l2-9" {...stroke} stroke="var(--ink)" strokeWidth="2" />}
      {mark === 'sparkle' && (
        <>
          <path d="M22 4l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="62" cy="14" r="5" {...stroke} strokeWidth="2.5" />
          <path d="M56 30h16" {...stroke} strokeWidth="2.5" />
        </>
      )}
      {mark === 'cloud' && (
        <>
          <path d="M18 44h66a14 14 0 0 0 0-22 19 19 0 0 0-36-5 13 13 0 0 0-26 8 9 9 0 0 0-4 19z" fill="var(--sky-100)" stroke="var(--ink)" strokeWidth="1.5" />
          <path d="M100 8l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.2" />
        </>
      )}
      {mark === 'clock' && (
        <>
          <circle cx="60" cy="30" r="18" {...stroke} />
          <path d="M60 20v10l7 5" {...stroke} stroke="var(--ink)" strokeWidth="2.5" />
        </>
      )}
    </svg>
  );
}
