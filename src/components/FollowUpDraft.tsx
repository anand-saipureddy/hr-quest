import { useState } from 'react';
import type { Job } from '../lib/progress';

// Copy-ready follow-up email, pre-filled with role, company and applied date.
export default function FollowUpDraft({ job, appliedOn }: { job: Job; appliedOn: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const draft = `Subject: Following up on my application — ${job.title}\n\nHello,\n\nI applied for the ${job.title} role at ${job.company} on ${appliedOn}, and I wanted to check whether the position is still being processed. I remain interested and would be glad to share anything else that would help.\n\nThank you for your time.`;

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ padding: '7px 12px', border: '1px solid var(--line)', borderRadius: 'var(--r-pill)', background: '#fff', font: '500 12px/1 var(--font-ui)', color: 'var(--muted)', cursor: 'pointer' }}
      >
        Copy a follow-up email
      </button>
    );
  }
  return (
    <div style={{ marginTop: 12, padding: 14, border: '1px solid var(--line)', borderRadius: 'var(--r-sticker)', background: 'var(--bg)' }}>
      <pre style={{ margin: 0, font: '400 12px/1.6 var(--font-ui)', whiteSpace: 'pre-wrap' }}>{draft}</pre>
      <button
        type="button"
        onClick={doCopy}
        style={{ marginTop: 10, padding: '7px 12px', border: '1px solid var(--line)', borderRadius: 'var(--r-pill)', background: '#fff', font: '500 12px/1 var(--font-ui)', cursor: 'pointer' }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
