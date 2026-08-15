// Phase 3 check: storage migration, mark/unmark inverses, blocked storage.
// Bundles the TS libs with esbuild (already in node_modules via vite) because
// node --test can't import TypeScript directly.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..';
let storage, progress;

before(() => {
  const tsc = path.join(root, 'node_modules/typescript/lib/tsc.js');
  // transpile the two lib files to plain JS in /tmp (tsc CLI, no bundling
  // needed: progress.ts only imports a type from storage.ts)
  execFileSync(process.execPath, [
    tsc, '--ignoreConfig', '--outDir', '/tmp/hrq-lib', '--module', 'esnext', '--target', 'es2022',
    '--skipLibCheck', path.join(root, 'src/lib/storage.ts'), path.join(root, 'src/lib/progress.ts'),
  ]);
  // .js files with ESM syntax; copy to .mjs so node imports them as ESM
  for (const name of ['storage', 'progress']) {
    writeFileSync(`/tmp/hrq-${name}.mjs`, readFileSync(`/tmp/hrq-lib/${name}.js`));
  }
  return (async () => {
    storage = await import('/tmp/hrq-storage.mjs');
    progress = await import('/tmp/hrq-progress.mjs');
  })();
});

const v1blob = {
  lessons: {},
  skills: { excel: { drills: [{ pick: 2 }, null, { pick: 0 }], built: true } },
  jobs: { abc123: { applied: '2026-08-10', replied: true }, def456: { applied: '2026-08-12', replied: false } },
  counters: { lessons: 0, skills: 1, applied: 2 },
};

test('a hrq.v1 blob migrates to hrq.v2 without loss', () => {
  const store = storage.memStore();
  store.set('hrq.v1', JSON.stringify(v1blob));
  const { progress: p } = storage.load(store);
  assert.equal(p.tracks.excel.built, true);
  assert.deepEqual(p.tracks.excel.drills, { 0: 2, 2: 0 });
  assert.equal(p.jobs.abc123.applied, true);
  assert.equal(p.jobs.abc123.appliedOn, '2026-08-10');
  assert.equal(p.jobs.abc123.note, 'They replied');
  assert.equal(p.jobs.def456.applied, true);
  // migration wrote the v2 key and left v1 in place
  assert.ok(store.get('hrq.v2.progress'));
  assert.ok(store.get('hrq.v1'));
});

test('every mark has a working unmark', () => {
  let p = storage.structuredClone ? structuredClone(storage.blank) : storage.blank;
  p = progress.markMcq(p, 'm1/l1', 0, 2);
  assert.equal(p.lessons['m1/l1'].mcqs[0], 2);
  p = progress.unmarkMcq(p, 'm1/l1', 0);
  assert.equal(p.lessons['m1/l1'].mcqs[0], undefined);

  p = progress.markDrill(p, 'excel', 1, 3);
  assert.equal(p.tracks.excel.drills[1], 3);
  p = progress.unmarkDrill(p, 'excel', 1);
  assert.equal(p.tracks.excel.drills[1], undefined);

  p = progress.markBuilt(p, 'excel', true);
  assert.equal(p.tracks.excel.built, true);
  p = progress.markBuilt(p, 'excel', false);
  assert.equal(p.tracks.excel.built, false);

  p = progress.markJob(p, 'j1', 'notMe', true);
  assert.equal(p.jobs.j1.notMe, true);
  p = progress.markJob(p, 'j1', 'notMe', false);
  assert.equal(p.jobs.j1.notMe, false);

  p = progress.markJob(p, 'j1', 'applied', true, '2026-08-15');
  assert.equal(p.jobs.j1.appliedOn, '2026-08-15');
  p = progress.markJob(p, 'j1', 'applied', false);
  assert.equal(p.jobs.j1.appliedOn, undefined);
});

test('a throwing localStorage returns defaults instead of propagating', () => {
  const throwing = {
    ok: false,
    get() { throw new Error('blocked'); },
    set() { throw new Error('blocked'); },
  };
  const { progress: p, blocked } = storage.load(throwing);
  assert.equal(blocked, true);
  assert.deepEqual(p, storage.blank);
  assert.equal(storage.save(storage.blank, throwing), false);
});
