import { spacing } from '../index.js';
import * as laws from 'fp-ts-laws';
import { spacingArb } from './helpers.js';

const show = spacing.show.show;

suite('spacing', () => {
  test('basic', () => assert.equal(show(spacing(1, 2, 3, 4)), '▲1 ▶2 ▼3 ◀4'));

  suite('laws', () => {
    test('eq', () => laws.eq(spacing.eq, spacingArb));
    test('monoid', () => laws.monoid(spacing.monoid, spacing.eq, spacingArb));
  });
});
