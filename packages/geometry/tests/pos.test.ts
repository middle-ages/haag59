import * as laws from 'fp-ts-laws';
import {
  addPosSize,
  buildSize,
  eqPos,
  min,
  monoidPos,
  ordPos,
  pos,
  posRectSize,
  showPos,
  subPosSize,
  translateToPositive,
} from '../index.js';
import { posArb } from './helpers.js';

const show = showPos.show;

suite('pos', () => {
  test('basic', () => assert.equal(show(pos(1, 2)), '▲1:◀2'));

  test('minPos', () => {
    const actual = min([pos(1, 5), pos(3, 2), pos(3, 3)]);
    assert.deepEqual(actual, pos(1, 2));
  });

  suite('translateToPositive', () => {
    test('negative', () => {
      assert.deepEqual(
        translateToPositive([pos(-1, 5), pos(3, -2), pos(0, 0)]),
        [pos(0, 7), pos(4, 0), pos(1, 2)],
      );
    });

    test('all positive', () =>
      assert.deepEqual(translateToPositive([pos(1, 5), pos(3, 2)]), [
        pos(1, 5),
        pos(3, 2),
      ]));
  });

  suite('rectSize', () => {
    test('positive', () =>
      assert.deepEqual(posRectSize([pos(5, 4), pos(1, 2)]), buildSize(3, 5)));
    test('negative', () =>
      assert.deepEqual(posRectSize([pos(1, 2), pos(5, 4)]), buildSize(3, 5)));
  });

  test('addSize', () =>
    /**
     *  ```txt
     * ┌──2345──┐
     * 0⁺⁺░░░░⁺⁺│
     * 1⁺⁺░░░░⁺⁺│
     * │⁺⁺⁺⁺⁺⁺⁺⁺│
     * └────────┘
     * ```
     */
    assert.deepEqual(addPosSize(buildSize(4, 2))(pos(0, 2)), pos(1, 5)));
  test('subSize', () =>
    assert.deepEqual(subPosSize(buildSize(1, 2))(pos(3, 5)), pos(-1, -4)));

  suite('laws', () => {
    test('ord', () => laws.ord(ordPos.left, posArb));
    test('sum monoid', () => laws.monoid(monoidPos.sum, eqPos, posArb));
    test('max monoid', () => laws.monoid(monoidPos.max, eqPos, posArb));
  });
});
