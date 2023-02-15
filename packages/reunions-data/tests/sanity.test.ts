import { suite, test, assert } from 'vitest';
import { execSync } from 'child_process';

suite('reunions-data', () =>
  test('basic', () => {
    execSync('pnpm exec tsx app/index.ts');
    assert.isTrue(true);
  }),
);
