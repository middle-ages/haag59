import { function as FN } from 'fp-ts';
import { quadRes } from '../src/quadRes.js';
import { bitmapRegistry as reg } from '../index.js';

suite('quad resolution', () => {
  const iut = FN.flow(reg.matrixByChar, quadRes);
  suite('unframed', () => {
    test('solid', () =>
      assert.deepEqual(iut(reg.solid), [
        '████', //
        '████',
        '████',
        '████',
      ]));

    test('cross', () =>
      assert.deepEqual(iut('┼'), [
        ' ▐▌ ', //
        '▄▟▙▄',
        '▀▜▛▀',
        ' ▐▌ ',
      ]));
  });
});
