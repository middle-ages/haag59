import * as laws from 'fp-ts-laws';
import { function as FN } from 'fp-ts';
import {
  showRect,
  buildSize,
  getCorners,
  pos,
  rect,
  rectBottomRight,
  rectEq,
  rectFromCorners,
  rectRight,
  originPos,
  rectMiddleCenter,
  rectMonoid,
  stack,
  subRectWidth,
  subRectHeight,
  addRectHeight,
  addRectWidth,
  addRectC,
  addRectPos,
  rectEqSize,
  rectEqPos,
  posRectSize,
  rectSize,
  emptyRect,
  rectPos,
  rectFromTuple,
} from '../index.js';
import { tuple as TUs } from 'fp-ts-std';
import { rectArb } from './helpers.js';

const { mapBoth } = TUs;

/**
 *  ```txt
 *
 *  iut1235     iut1224
 * ┄┄┄┄┄┄┄┄┄   ┄┄┄┄┄┄┄┄┄
 * ┌──234──┐   ┌──23──┐
 * │⁺⁺⁺⁺⁺⁺⁺│   │⁺⁺⁺⁺⁺⁺│
 * 1⁺⁺░░░⁺⁺│   1⁺⁺░░⁺⁺│
 * 2⁺⁺░░░⁺⁺│   2⁺⁺░░⁺⁺│
 * 3⁺⁺░░░⁺⁺│   3⁺⁺░░⁺⁺│
 * 4⁺⁺░░░⁺⁺│   4⁺⁺░░⁺⁺│
 * 5⁺⁺░░░⁺⁺│   │⁺⁺⁺⁺⁺⁺│
 * │⁺⁺⁺⁺⁺⁺⁺│   └──────┘
 * └───────┘
 * ```
 */
const iut1235 = FN.pipe([1, 2, 3, 5], rectFromTuple),
  iut1224 = FN.pipe([1, 2, 2, 4], rectFromTuple);

suite('rect', () => {
  test('show', () => assert.equal(showRect.show(iut1235), '▲1:◀2 ↔3:↕5'));

  test('bottomRight', () =>
    assert.deepEqual(rectBottomRight.get(iut1235), pos(5, 4)));

  test('bottomRight on 1x1', () =>
    assert.deepEqual(
      rectBottomRight.get(rect(pos(0, 1), buildSize(1, 1))),
      pos(0, 1),
    ));

  test('equals', () => assert.isTrue(rectEq.equals(iut1235, iut1235)));

  test('fromCorners', () =>
    assert.deepEqual(rectFromCorners([pos(1, 2), pos(5, 4)]), iut1235));

  test('corners', () =>
    assert.deepEqual(getCorners(iut1235), [pos(1, 2), pos(5, 4)]));

  test('setRight', () =>
    assert.deepEqual(FN.pipe(iut1235, rectRight.set(0), getCorners), [
      pos(1, -2),
      pos(5, 0),
    ]));

  suite('center', () => {
    suite('get', () => {
      test('odd', () =>
        assert.deepEqual(rectMiddleCenter.get(iut1235), pos(3, 3)));

      test('even', () =>
        assert.deepEqual(rectMiddleCenter.get(iut1224), pos(2, 2)));
    });

    suite('set', () => {
      /**
       *  ```txt
       *          iut1235                      iut1224
       * ┄┄┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┄┄┄┄┄┄   ┄┄┄┄┄┄┄┄┄┄┄┄┬──┄┄┄┄┄┄┄┄┄┄┄
       * before move ┊  after center   before move ┊ after center
       *             ┊   on origin                 ┊  on origin
       *             ┊                             ┊
       *     ⁺⁺⁺     ┊     ⁻ ⁺             ⁺⁺      ┊      ⁺
       *  ┌──234──┐  ┊  ┌──101──┐       ┌──23──┐   ┊  ┌──01──┐
       *  │⁺⁺⁺⁺⁺⁺⁺│  ┊  │⁺⁺⁺⁺⁺⁺⁺│       │⁺⁺⁺⁺⁺⁺│   ┊  │⁺⁺⁺⁺⁺⁺│
       * ⁺1⁺⁺░░░⁺⁺│  ┊ ⁻2⁺⁺░░░⁺⁺│      ⁺1⁺⁺░░⁺⁺│   ┊ ⁻1⁺⁺░░⁺⁺│
       * ⁺2⁺⁺░░░⁺⁺│  ┊ ⁻1⁺⁺░░░⁺⁺│      ⁺2⁺⁺░░⁺⁺│   ┊  0⁺⁺░░⁺⁺│
       * ⁺3⁺⁺░░░⁺⁺│  ┊  0⁺⁺░░░⁺⁺│      ⁺3⁺⁺░░⁺⁺│   ┊ ⁺1⁺⁺░░⁺⁺│
       * ⁺4⁺⁺░░░⁺⁺│  ┊ ⁺1⁺⁺░░░⁺⁺│      ⁺4⁺⁺░░⁺⁺│   ┊ ⁺2⁺⁺░░⁺⁺│
       * ⁺5⁺⁺░░░⁺⁺│  ┊ ⁺2⁺⁺░░░⁺⁺│       │⁺⁺⁺⁺⁺⁺│   ┊  │⁺⁺⁺⁺⁺⁺│
       *  │⁺⁺⁺⁺⁺⁺⁺│  ┊  │⁺⁺⁺⁺⁺⁺⁺│       └──────┘   ┊  └──────┘
       *  └───────┘  ┊  └───────┘
       */
      const move = rectMiddleCenter.set(originPos),
        [movedOdd, movedEven] = FN.pipe([iut1235, iut1224], mapBoth(move));

      test('odd', () => assert.deepEqual(rectPos.get(movedOdd), pos(-2, -1)));

      test('even', () => assert.deepEqual(rectPos.get(movedEven), pos(-1, 0)));
    });
  });

  test('corners and size', () =>
    assert.deepEqual(
      FN.pipe(iut1235, getCorners, posRectSize),
      rectSize.get(iut1235),
    ));

  suite('equality', () => {
    test('eq', () => assert.isTrue(rectEq.equals(iut1235, iut1235)));
    test('eqPos', () => assert.isTrue(rectEqPos.equals(iut1235, iut1235)));
    test('eqSize', () => assert.isTrue(rectEqSize.equals(iut1235, iut1235)));
  });

  suite('add', () => {
    test('this ⊕ this = this', () =>
      assert.deepEqual(FN.pipe(iut1235, addRectC(iut1235)), iut1235));

    test('this ⊕ ∅ = this', () =>
      assert.deepEqual(FN.pipe(iut1235, addRectC(emptyRect)), iut1235));

    test('∅ ⊕ this = this', () =>
      assert.deepEqual(FN.pipe(emptyRect, addRectC(iut1235)), iut1235));

    test('this ⊕ translate(this)', () => {
      const translated = FN.pipe(iut1235, FN.flow(pos, addRectPos)(1, 1));

      assert.deepEqual(
        FN.pipe(iut1235, addRectC(translated)),
        FN.pipe(iut1235, addRectWidth(1), addRectHeight(1)),
      );
    });

    test('this ⊕ smaller(this) = this', () =>
      assert.deepEqual(
        stack([iut1235, FN.pipe(iut1235, subRectWidth(1), subRectHeight(2))]),
        iut1235,
      ));

    test('stack', () => {
      /**
       *  ```txt
       *         ←─╴7╶─→
       *      ┌──2345678─┐
       *      │⁺⁺⁺⁺⁺⁺⁺⁺⁺⁺│
       *      1⁺⁺░░░⁺⁺⁺⁺⁺1 ↑
       *      2⁺⁺░░▒░░░░⁺2 │
       *      3⁺⁺░a▒░b░░⁺3 │
       *      4⁺⁺░░▒░░░░⁺4 ╵
       *      5⁺⁺░░░⁺⁺⁺⁺⁺5 9
       *      │⁺⁺⁺⁺⁺⁺⁺⁺⁺⁺│ ╷
       *      7⁺⁺⁺⁺⁺⁺░░░⁺7 │
       *      8⁺⁺⁺⁺⁺⁺░c░⁺8 │
       *      9⁺⁺⁺⁺⁺⁺░░░⁺9 ↓
       *      └──2345678─┘
       * ```
       */
      const abc = [
        rectFromCorners([pos(1, 2), pos(5, 4)]),
        rectFromCorners([pos(2, 4), pos(4, 8)]),
        rectFromCorners([pos(7, 6), pos(9, 8)]),
      ];

      const actual = stack(abc);

      assert.deepEqual(actual, rectFromCorners([pos(1, 2), pos(9, 8)]));
    });
  });

  suite('laws', () => {
    test('eq', () => laws.eq(rectEq, rectArb));
    test('monoid', () => laws.monoid(rectMonoid, rectEq, rectArb));
  });
});
