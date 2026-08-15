// Phase 9 check: fit scoring + merge rules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreFit, mergeJobs, jobId } from './fetch-jobs.mjs';

test('scoring: HR title + Chennai + no exp bar scores high', () => {
  const strong = scoreFit({ title: 'HR Executive', location: 'Chennai', exp: '0-1 Yrs' });
  const weak = scoreFit({ title: 'Telecalling Executive', location: 'Mumbai', exp: '3-5 Yrs' });
  assert.ok(strong >= 85, `expected strong >= 85, got ${strong}`);
  assert.ok(weak < 70, `expected weak < 70, got ${weak}`);
  assert.ok(scoreFit({ title: 'Talent Acquisition Trainee', location: 'Chennai' }) >= 85);
});

test('jobId is a stable hash of the URL', () => {
  assert.equal(jobId('https://example.com/j/1'), jobId('https://example.com/j/1'));
  assert.notEqual(jobId('https://example.com/j/1'), jobId('https://example.com/j/2'));
  assert.equal(jobId('https://example.com/j/1').length, 10);
});

test('merge preserves firstSeen on existing jobs', () => {
  const existing = [{ id: jobId('https://x/1'), url: 'https://x/1', title: 'HR Exec', company: 'A', location: 'Chennai', src: 'naukri', fit: 90, firstSeen: '2026-08-01', isNew: true }];
  const merged = mergeJobs(existing, [], {}, '2026-08-15');
  assert.equal(merged[0].firstSeen, '2026-08-01');
  assert.equal(merged[0].isNew, false);
});

test('merge never drops a job that has saved/applied/note progress', () => {
  const j = { id: 'abc', url: 'https://x/1', title: 'HR Exec', company: 'A', location: 'Chennai', src: 'naukri', fit: 90, firstSeen: '2026-08-01', isNew: false };
  const merged = mergeJobs([j], [], { jobs: { abc: { applied: true } } }, '2026-08-15');
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, 'abc');
});

test('merge dedupes across title variants by id', () => {
  const raw = { url: 'https://x/1', title: 'HR Executive', company: 'A', location: 'Chennai' };
  const merged = mergeJobs([], [raw, raw, raw], {}, '2026-08-15');
  assert.equal(merged.length, 1);
  assert.equal(merged[0].isNew, true);
  assert.equal(merged[0].firstSeen, '2026-08-15');
});

test('main refuses to run without APIFY_TOKEN', async () => {
  const { execFileSync } = await import('node:child_process');
  assert.throws(
    () => execFileSync(process.execPath, ['scripts/fetch-jobs.mjs'], { env: { PATH: process.env.PATH }, cwd: new URL('..', import.meta.url).pathname, stdio: 'pipe' }),
    /Command failed/
  );
});
