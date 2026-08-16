// Copy guards. AGENTS.md bans a fixed list of words in user-facing
// copy, plus any exclamation marks. Comments at the top of copy.ts
// are allowed to mention the banned words (they're the rule itself),
// so the tests strip single-line comments before scanning.

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, '..', 'src', 'lib', 'copy.ts'), 'utf8');

// Strip single-line // comments (the rule note at the top of the file
// names the banned words and the no-! rule).
const stripped = src.replace(/\/\/[^\n]*/g, '');

const BANNED = ['streak', 'overdue', 'you missed', 'keep it up', "don't break the chain"];

test('AGENTS.md: no banned words in user-facing copy', () => {
  for (const word of BANNED) {
    assert.doesNotMatch(
      stripped,
      new RegExp(word, 'i'),
      `banned word "${word}" found in copy.ts — AGENTS.md forbids it in user-facing strings`,
    );
  }
});

test('no exclamation marks in user-facing string values', () => {
  // Iterate single-quoted string values (the file uses single quotes
  // for every value). Handle backslash escapes so a \' inside a
  // string doesn't terminate it.
  const stringRe = /'((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = stringRe.exec(stripped)) !== null) {
    const value = m[1];
    assert.ok(
      !value.includes('!'),
      `user-facing string contains "!" — AGENTS.md forbids exclamation marks in system copy\n  '${value}'`,
    );
  }
});
