import { function as FN } from 'fp-ts';
import * as laws from 'fp-ts-laws';
import { number as NUs } from 'fp-ts-std';
import {
  height,
  tupledSize,
  buildSize,
  addSizeC,
  sizeMonoid,
  ordSize,
  fromHeight,
  eqSize,
} from '../index.js';
import { sizeArb } from './helpers.js';

const { add } = NUs;

suite('size', () => {
  test('basic', () => assert.deepEqual(buildSize(1, 2), tupledSize([1, 2])));

  test('lens', () =>
    assert.deepEqual(
      FN.pipe(fromHeight(3), height.mod(add(4)), height.get),
      7,
    ));

  test('addSize', () =>
    assert.deepEqual(
      FN.pipe(buildSize(1, 2), addSizeC(buildSize(3, 4))),
      buildSize(4, 6),
    ));

  suite('laws', () => {
    test('ord', () => laws.ord(ordSize.height, sizeArb));
    test('sum monoid', () => laws.monoid(sizeMonoid.sum, eqSize, sizeArb));
    test('max monoid', () => laws.monoid(sizeMonoid.max, eqSize, sizeArb));
  });
});
