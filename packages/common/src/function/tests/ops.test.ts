import { assert, suite, test } from 'vitest';
import { callWith } from '../ops.js';

suite('function ops', () => {
  test('doc example', () => {
    const n: number = pipe('foo', callWith(s => t => (s + t).length));
    assert.equal(n, 6);
 });
});
