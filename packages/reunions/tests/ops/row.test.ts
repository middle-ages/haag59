import { function as FN } from 'fp-ts';
import {
  emptyRow,
  fullRow,
  invertRow,
  isSymmetric,
  modRowPx,
  pxOff,
  countAt,
  resolution,
  resolutionRange,
} from '../../index.js';

suite('bitmap row ops', () => {
  suite('invert', () => {
    test('full', () => assert.deepEqual(invertRow(fullRow), emptyRow));
    test('empty', () => assert.deepEqual(invertRow(emptyRow), fullRow));
  });

  suite('countAt', () => {
    const countAll = countAt(resolutionRange);
    test('full', () => assert.equal(countAll(fullRow), resolution));
    test('empty', () => assert.equal(countAll(emptyRow), 0));
  });

  suite('isSymmetric', () => {
    test('full ⊤', () => assert.isTrue(isSymmetric(emptyRow)));
    test('empty ⊤', () => assert.isTrue(isSymmetric(emptyRow)));
    test('asymmetric ⊥', () =>
      test('asymmetric', () =>
        FN.pipe(
          fullRow,
          FN.pipe(2, FN.pipe(pxOff, FN.constant, modRowPx)),
          isSymmetric,
          assert.isFalse,
        )));
  });
});
