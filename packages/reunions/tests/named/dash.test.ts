import { option as OP } from 'fp-ts';
import { named } from '../../index.js';

suite('bitmap named dash', () => {
  test('┆ → │', () => assert.deepEqual(named.undashLine('┆'), OP.some('│')));
});
