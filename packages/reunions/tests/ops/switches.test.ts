import { array as AR } from 'fp-ts';
import * as data from '../../src/data.js';
import * as switches from '../../src/ops/switches.js';
import { showMatrix, Matrix, PxRow } from '../../index.js';
import { Endo } from 'commons';
import { tuple as TUs } from 'fp-ts-std';

const { dup } = TUs;
const { show } = showMatrix;

const check = (name: string, sw: Endo<Matrix>, expect: Matrix) =>
  test(name, () => assert.deepEqual(show(sw(data.fullMatrix)), show(expect)));

suite('bitmap switch ops', () => {
  check('left', switches.left, [
    ...AR.replicate(3, data.fullRow),
    ...dup(Array.from('##⁺#####') as PxRow),
    ...AR.replicate(3, data.fullRow),
  ] as Matrix);

  check('right', switches.right, [
    ...AR.replicate(3, data.fullRow),
    ...dup(Array.from('#####⁺##') as PxRow),
    ...AR.replicate(3, data.fullRow),
  ] as Matrix);

  check('top', switches.top, [
    ...AR.replicate(2, data.fullRow),
    Array.from('###⁺⁺###') as PxRow,
    ...AR.replicate(5, data.fullRow),
  ] as Matrix);

  check('bottom', switches.bottom, [
    ...AR.replicate(5, data.fullRow),
    Array.from('###⁺⁺###') as PxRow,
    ...AR.replicate(2, data.fullRow),
  ] as Matrix);
});
