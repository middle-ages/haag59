import { option as OP } from 'fp-ts';
import { named } from '../../index.js';

suite('bitmap named double', () => {
  test('╔ → ┏', () => assert.deepEqual(named.doubleToThick('╔'), OP.some('┏')));
});
