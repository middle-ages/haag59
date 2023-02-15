import { monoObject } from '../index.js';

suite('object ops', () => {
  test('monoObject', () =>
    assert.deepEqual(monoObject(42)(['a', 'b', 'c'] as const), {
      a: 42,
      b: 42,
      c: 42,
    }));
});
