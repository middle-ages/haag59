import { array as AR } from 'fp-ts';
import { parseDef } from '../../src/data/parse.js';
import { Matrix, resolution, toBin } from '../../index.js';

const matrix: Matrix = parseDef([
  '########',
  '########',
  '########',
  '########',
  '########',
  '########',
  '########',
  '########',
]);

suite('bitmap data parse', () => {
  test('basic', () =>
    assert.equal(
      toBin(matrix),
      AR.replicate(resolution * resolution, '1').join(''),
    ));
});
