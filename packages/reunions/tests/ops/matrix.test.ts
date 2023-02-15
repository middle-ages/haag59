import { array as AR, function as FN, option as OP } from 'fp-ts';
import {
  fullMatrix,
  fullRow,
  invertPxAt,
  Matrix,
  pxOff,
  pxOn,
  PxRow,
  bitmapRegistry as reg,
  showMatrix,
  turn,
} from '../../index.js';

suite('bitmap matrix ops', () => {
  test('invertPxAt', () => {
    const actual = FN.pipe(
      fullMatrix,
      invertPxAt([0, 3]),
      invertPxAt([0, 4]),
      showMatrix.show,
    );

    const expect = showMatrix.show([
      [
        ...AR.replicate(3, pxOn),
        pxOff,
        pxOff,
        ...AR.replicate(3, pxOn),
      ] as PxRow,
      ...AR.replicate(7, fullRow),
    ] as Matrix);

    assert.deepEqual(actual, expect);
  });

  suite('turn', () => {
    const turnChar = FN.flow(reg.matrixByChar, turn, reg.charByMatrix);
    test('─', () => assert.deepEqual(turnChar('─'), OP.some('│')));
    test('│', () => assert.deepEqual(turnChar('│'), OP.some('─')));
    test('┾', () => assert.deepEqual(turnChar('┾'), OP.some('╁')));
  });
});
