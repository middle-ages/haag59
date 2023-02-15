import { function as FN } from 'fp-ts';
import { callWith } from '../index.js';

suite('function ops', () => {
  test('doc example', () => {
    const n: number = FN.pipe(
      'foo',
      callWith(s => t => (s + t).length),
    );
    assert.equal(n, 6);
  });
});
