import { function as FN } from 'fp-ts';
import * as laws from 'fp-ts-laws';
import { number as NUs } from 'fp-ts-std';
import { size } from '../index.js';
import { sizeArb } from './helpers.js';

const { add } = NUs;

suite('size', () => {
  test('basic', () => assert.deepEqual(size(1, 2), size.tupled([1, 2])));

  test('lens', () =>
    assert.deepEqual(
      FN.pipe(size.fromHeight(3), size.height.mod(add(4)), size.height.get),
      7,
    ));

  test('addSize', () =>
    assert.deepEqual(FN.pipe(size(1, 2), size.addC(size(3, 4))), size(4, 6)));

  suite('laws', () => {
    test('ord', () => laws.ord(size.ord.height, sizeArb));
    test('sum monoid', () => laws.monoid(size.monoid.sum, size.eq, sizeArb));
    test('max monoid', () => laws.monoid(size.monoid.max, size.eq, sizeArb));
  });
});
