import { function as FN } from 'fp-ts';
import { invertEq, emptyMatrix, fullMatrix } from '../../index.js';

suite('bitmap query ops', () => {
  suite('invertEq', () => {
    test('full→empty', () =>
      FN.pipe([fullMatrix, emptyMatrix], invertEq, assert.isTrue));
    test('empty→full', () =>
      FN.pipe([emptyMatrix, fullMatrix], invertEq, assert.isTrue));
  });
});
