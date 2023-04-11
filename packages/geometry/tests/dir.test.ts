import { function as FN } from 'fp-ts';
import { Dir, showDir, snugDir, reversed } from '../index.js';
import { tuple as TUs } from 'fp-ts-std';

const { mapBoth } = TUs;

suite('dir', () => {
  test('show', () => assert.equal(showDir.show('bottom'), '↓'));

  test('snug', () =>
    assert.deepEqual(FN.pipe('left', snugDir, mapBoth(showDir.show)), [
      '↑',
      '↓',
    ]));

  test('reverse', () =>
    assert.equal(FN.pipe('top' as Dir, reversed, showDir.show), '↓'));
});
