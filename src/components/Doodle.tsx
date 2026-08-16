type Mark =
  | 'underline' | 'circle' | 'arrow' | 'star' | 'squiggle' | 'sparkle' | 'cloud' | 'clock' | 'book' | 'briefcase' | 'hammer'
  | 'desk' | 'clockArrow' | 'books' | 'toolbox' | 'skyline'
  | 'sheet' | 'chat' | 'person' | 'payslip' | 'board' | 'envelope' | 'bars';

const BOX: Record<Mark, [number, number]> = {
  desk: [220, 170], clockArrow: [140, 90], books: [200, 150], toolbox: [200, 150], skyline: [220, 140],
  sheet: [60, 44], chat: [60, 44], person: [60, 44], payslip: [60, 44], board: [60, 44], envelope: [60, 44], bars: [60, 44],
  underline: [90, 40], circle: [90, 40], arrow: [90, 40], star: [90, 40], squiggle: [90, 40], sparkle: [90, 40],
  cloud: [120, 60], clock: [120, 60], book: [90, 40], briefcase: [90, 40], hammer: [90, 40],
};

// The doodle kit. Decorative — aria-hidden, never the sole carrier of meaning.
// New scene marks are copied verbatim from the design (geometry) and translated
// to the app's token palette (--sky-*, --ink, --sun, --blush) and React attribute
// names (camelCase). Keeping them identical to the source so the rail scenes
// carry their visual weight.
export default function Doodle({ mark, color = 'var(--sky-300)', width = 90 }: { mark: Mark; color?: string; width?: number }) {
  const stroke = { fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round' as const };
  const [vbW, vbH] = BOX[mark];
  const h = (width * vbH) / vbW;
  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} width={width} height={h} aria-hidden="true" className="doodle">
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
      {mark === 'book' && (
        <>
          <path d="M45 9c-7-4-14-4-21 0v21c7-4 14-4 21 0 7-4 14-4 21 0V9c-7-4-14-4-21 0z" fill="var(--sky-100)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M45 9v21" stroke="var(--ink)" strokeWidth="2" />
        </>
      )}
      {mark === 'briefcase' && (
        <>
          <rect x="12" y="17" width="66" height="19" rx="3" fill="var(--sky-100)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M33 17v-4a5 5 0 0 1 5-5h14a5 5 0 0 1 5 5v4" {...stroke} />
          <path d="M41 26h8" stroke="var(--ink)" strokeWidth="2" />
        </>
      )}
      {mark === 'hammer' && (
        <>
          <path d="M34 14l10 22" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          <rect x="22" y="6" width="22" height="9" rx="2" fill="var(--sky-100)" stroke="var(--ink)" strokeWidth="2" />
        </>
      )}
      {mark === 'desk' && (
        <>
          <path d="M28 132h164" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="60" y="84" width="94" height="44" rx="3" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M64 88h86v34H64z" fill="var(--sky-200)" />
          <path d="M72 96h58M72 104h44M72 112h30" stroke="var(--sky-500)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 128h114l8 4H42z" fill="var(--sky-100)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M170 116h20v16h-20z" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M190 120c7 0 7 8 0 8" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M174 108c0-6 4-6 4-12M182 108c0-5 3-5 3-10" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M34 132c-2-14 2-24 10-30" stroke="var(--ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M44 102c-12-2-16-12-8-18 8-5 16 3 14 12 8-8 20-4 18 6-2 8-14 9-24 0z" fill="var(--sky-100)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M96 46c-14-6-26-4-34 2v34c8-6 20-8 34-2 14-6 26-4 34 2V44c-8-6-20-8-34 2z" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M96 46v34" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M72 58h16M104 58h16" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M160 34l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M40 62c6-2 6-10 12-10" stroke="var(--sky-300)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" fill="none" />
          <circle cx="186" cy="66" r="6" fill="var(--blush)" stroke="var(--ink)" strokeWidth="1.8" />
        </>
      )}
      {mark === 'clockArrow' && (
        <>
          <path d="M20 74c10-8 22-10 34-6" stroke="var(--sky-300)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" fill="none" />
          <path d="M62 78c18 2 34-6 44-22" stroke="var(--ink)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M106 56l-9 2M106 56l1 9" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="30" cy="30" r="14" fill="none" stroke="var(--sky-300)" strokeWidth="3" />
          <path d="M30 22v9l6 4" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M96 16l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
        </>
      )}
      {mark === 'books' && (
        <>
          <path d="M32 126h136" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="46" y="104" width="104" height="20" rx="2" fill="var(--sky-100)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M60 104v20M92 104v20" stroke="var(--sky-300)" strokeWidth="2" />
          <rect x="56" y="84" width="92" height="20" rx="2" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M70 84v20M114 84v20" stroke="var(--sky-300)" strokeWidth="2" />
          <rect x="64" y="64" width="76" height="20" rx="2" fill="var(--blush)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M86 64v20" stroke="var(--ink)" strokeWidth="2" opacity=".4" />
          <path d="M150 62c10-4 18-14 16-26" stroke="var(--sky-300)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" fill="none" />
          <path d="M42 44l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="164" cy="26" r="8" fill="none" stroke="var(--ink)" strokeWidth="2" />
        </>
      )}
      {mark === 'toolbox' && (
        <>
          <rect x="34" y="72" width="96" height="52" rx="3" fill="var(--sky-100)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M34 88h96" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M66 72V62a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v10" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M74 98h16" stroke="var(--sky-500)" strokeWidth="3" strokeLinecap="round" />
          <path d="M136 108l22-40" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          <rect x="146" y="42" width="30" height="14" rx="2" transform="rotate(-28 161 49)" fill="var(--sun)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M24 56c8-6 8-16 18-18" stroke="var(--sky-300)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" fill="none" />
          <circle cx="30" cy="120" r="7" fill="var(--blush)" stroke="var(--ink)" strokeWidth="2" />
        </>
      )}
      {mark === 'skyline' && (
        <>
          <path d="M10 118h200" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="24" y="66" width="34" height="52" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M32 78h6M46 78h6M32 92h6M46 92h6M32 106h6" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="64" y="44" width="40" height="74" fill="var(--sky-100)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M74 58h8M88 58h8M74 74h8M88 74h8M74 90h8M88 90h8" stroke="var(--sky-500)" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="110" y="80" width="30" height="38" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M118 92h6M130 92h4" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="150" y="86" width="52" height="32" rx="3" fill="var(--blush)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M166 86v-6a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v6" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M170 100h12" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M150 34l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M22 40c10-4 10-16 22-16" stroke="var(--sky-300)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" fill="none" />
        </>
      )}
      {mark === 'sheet' && (
        <>
          <rect x="6" y="6" width="48" height="32" rx="2" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M6 16h48M22 16v22M38 16v22" stroke="var(--sky-300)" strokeWidth="2" />
          <rect x="6" y="6" width="48" height="10" fill="var(--sky-200)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M42 26h8" stroke="var(--sky-500)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {mark === 'chat' && (
        <>
          <path d="M10 10h30a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H22l-9 7v-7h-3a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M17 18h16M17 24h10" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M49 6l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
        </>
      )}
      {mark === 'person' && (
        <>
          <circle cx="20" cy="16" r="8" fill="var(--blush)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M8 38c2-8 6-12 12-12s10 4 12 12" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 10h16a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-8l-6 5v-5h-2a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M43 16h8M43 21h5" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {mark === 'payslip' && (
        <>
          <rect x="12" y="6" width="34" height="32" rx="2" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M19 15h20M19 21h20M19 27h12" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M36 30h6" stroke="var(--sky-500)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="46" cy="12" r="7" fill="var(--sun)" stroke="var(--ink)" strokeWidth="2" />
          <path d="M43 12h6M46 9v6" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {mark === 'board' && (
        <>
          <rect x="6" y="8" width="14" height="28" rx="2" fill="var(--sky-200)" stroke="var(--ink)" strokeWidth="2.5" />
          <rect x="23" y="8" width="14" height="28" rx="2" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <rect x="40" y="8" width="14" height="28" rx="2" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M27 16h6M27 22h6M44 16h6" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {mark === 'envelope' && (
        <>
          <rect x="8" y="10" width="44" height="26" rx="2" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M8 12l22 14 22-14" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M14 32h12" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {mark === 'bars' && (
        <>
          <path d="M8 36h44" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="14" y="22" width="8" height="14" fill="var(--sky-200)" stroke="var(--ink)" strokeWidth="2.5" />
          <rect x="26" y="14" width="8" height="22" fill="#fff" stroke="var(--ink)" strokeWidth="2.5" />
          <rect x="38" y="26" width="8" height="10" fill="var(--blush)" stroke="var(--ink)" strokeWidth="2.5" />
          <path d="M12 12c8 2 14-4 20-6" stroke="var(--sky-300)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 7" fill="none" />
        </>
      )}
    </svg>
  );
}
