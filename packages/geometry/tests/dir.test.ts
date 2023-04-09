import { function as FN } from 'fp-ts';
import * as dir from '../index.js';
import { tuple as TUs } from 'fp-ts-std';

const { mapBoth } = TUs;

suite('dir', () => {
  test('basic', () => assert.equal(dir.left, 'left'));

  test('show', () => assert.equal(dir.show.show(dir.bottom), '↓'));

  test('snug', () =>
    assert.deepEqual(FN.pipe('left', dir.snug, mapBoth(dir.show.show)), [
      '↑',
      '↓',
    ]));

  test('reverse', () =>
    assert.equal(FN.pipe(dir.top, dir.reversed, dir.show.show), '↓'));
});
