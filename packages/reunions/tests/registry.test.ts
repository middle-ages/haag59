import * as DA from '../src/data.js';
import { bitmapRegistry as reg } from '../index.js';

suite('matrix registry', () => {
  test('rolesByChar', () => assert.deepEqual(reg.rolesByChar('╯'), ['elbow']));

  test('chars', () => assert.isAbove(reg.chars.length, 100));

  test('getMatrix', () =>
    assert.deepEqual(reg.matrixByChar('█'), DA.fullMatrix));

  test('char with >1 roles', () =>
    assert.deepEqual(reg.rolesByChar(' '), ['hLine', 'vLine', 'halftone']));
});
