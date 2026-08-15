import { useState } from 'react';
import Doodle from '../components/Doodle';

// Empty states name the reason, remove blame, offer exactly two doors.
export default function EmptyState({ title, body, doors }: { title: string; body: string; doors: { label: string; onClick: () => void }[] }) {
  return (
    <div style={{ border: '2px solid var(--ink)', background: '#fff', padding: '34px 30px 30px', maxWidth: 480 }}>
      <Doodle mark="circle" />
      <h2 style={{ fontSize: 23, margin: '14px 0 10px' }}>{title}</h2>
      <p style={{ margin: '0 0 16px', font: '400 14px/1.65 var(--font-ui)', color: 'var(--muted)', maxWidth: '44ch' }}>{body}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {doors.map((d, i) => (
          <button key={d.label} type="button" onClick={d.onClick} className={i === 0 ? 'btn' : 'btn quiet'}>
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
