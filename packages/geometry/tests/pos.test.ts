import * as laws from 'fp-ts-laws';
import { pos, size } from '../index.js';
import { posArb } from './helpers.js';

const show = pos.show.show;

suite('pos', () => {
  test('basic', () => assert.equal(show(pos(1, 2)), '▲1:◀2'));

  test('minPos', () => {
    const actual = pos.min([pos(1, 5), pos(3, 2), pos(3, 3)]);
    assert.deepEqual(actual, pos(1, 2));
  });

  suite('translateToPositive', () => {
    test('negative', () => {
      assert.deepEqual(
        pos.translateToPositive([pos(-1, 5), pos(3, -2), pos(0, 0)]),
        [pos(0, 7), pos(4, 0), pos(1, 2)],
      );
    });

    test('all positive', () =>
      assert.deepEqual(pos.translateToPositive([pos(1, 5), pos(3, 2)]), [
        pos(1, 5),
        pos(3, 2),
      ]));
  });

  suite('rectSize', () => {
    test('positive', () =>
      assert.deepEqual(pos.rectSize([pos(5, 4), pos(1, 2)]), size(3, 5)));
    test('negative', () =>
      assert.deepEqual(pos.rectSize([pos(1, 2), pos(5, 4)]), size(3, 5)));
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
    assert.deepEqual(pos.addSize(size(4, 2))(pos(0, 2)), pos(1, 5)));
  test('subSize', () =>
    assert.deepEqual(pos.subSize(size(1, 2))(pos(3, 5)), pos(-1, -4)));

  suite('laws', () => {
    test('ord', () => laws.ord(pos.ord.left, posArb));
    test('sum monoid', () => laws.monoid(pos.monoid.sum, pos.eq, posArb));
    test('max monoid', () => laws.monoid(pos.monoid.max, pos.eq, posArb));
  });
});
