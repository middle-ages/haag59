import { showSpacing, spacing, spacingEq, spacingMonoid } from '../index.js';
import * as laws from 'fp-ts-laws';
import { spacingArb } from './helpers.js';

const show = showSpacing.show;

suite('spacing', () => {
  test('basic', () => assert.equal(show(spacing(1, 2, 3, 4)), '▲1 ▶2 ▼3 ◀4'));

  suite('laws', () => {
    test('eq', () => laws.eq(spacingEq, spacingArb));
    test('monoid', () => laws.monoid(spacingMonoid, spacingEq, spacingArb));
  });
});
