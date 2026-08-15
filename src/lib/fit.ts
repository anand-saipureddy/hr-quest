import type { Job } from './progress';

// Fit is stored as a number; the app only maps it to a word.
// Word first, number second — a bare 62% reads as a verdict on her.
export function fitWord(fit: number): string {
  if (fit >= 85) return 'Strong';
  if (fit >= 70) return 'Good';
  return 'Worth a look';
}

export function whyThisOne(j: Job): string {
  const bits: string[] = [];
  bits.push('Matches a fresher HR profile in Chennai');
  if (j.src === 'internshala') bits.push('Internshala listing, so it leans entry-level');
  if (j.exp) bits.push(`asks for ${j.exp} experience`);
  if (j.salary) bits.push(`pay listed at ${j.salary}`);
  const first = bits.slice(0, 2).join('; ') + '.';
  const downside =
    j.fit < 70
      ? ' The match score is on the low side, so read the posting before deciding.'
      : j.src === 'indeed'
        ? ' This one came from Indeed, which is no longer refreshed — check that the listing is still open.'
        : '';
  return first + downside;
}
