import {
  AR,
  Binary,
  BinOp,
  BinOpC,
  BinOpT,
  Endo,
  EQ,
  FN,
  MO,
  modLens,
  NU,
  OD,
  Pair,
  pairCartesian,
  PRE,
  SH,
  TU,
  Tuple4,
  typedValues,
  Unary,
} from 'commons';
import { lens as LE } from 'monocle-ts';
import { build as buildSize, inc as incSize, Size } from './size.js';

export const keys = ['top', 'left'] as const;

export type PosKey = (typeof keys)[number];
export type Pos = Record<PosKey, number>;

//#region build

export const pos: Binary<number, number, Pos> = (top, left) => ({
  top,
  left,
});
export const tupledPos = FN.tupled(pos);
export const curriedPos = FN.curry2(pos);
export const topToPos: Unary<number, Pos> = FN.flow(TU.withSnd(0), tupledPos);
export const leftToPos: Unary<number, Pos> = FN.flow(TU.withFst(0), tupledPos);

/** The unit position at `{top=1, left=1}` */
export const unitPos = pos(1, 1);

/** The origin position at `{top=0, left=0}` */
export const originPos = pos(0, 0);

//#endregion

//#region query

const lens = LE.id<Pos>();

/** Position top lense */
export const posTop = FN.pipe(lens, LE.prop('top'), modLens);

/** Position left lense */
export const posLeft = FN.pipe(lens, LE.prop('left'), modLens);

/** Get the position as a `top`, `left` pair */
export const posPair: Unary<Pos, Pair<number>> = typedValues;

/** Compute size of rectangle between origin and this position */
export const sizeFromOrigin: Unary<Pos, Size> = ({ top, left }) =>
  buildSize(left + 1, top + 1);

/**
 * Compute bottom right position of rectangle with given height and with this
 * position at the top left
 */
export const posBottomRight: Unary<Size, Pos> = ({ width, height }) =>
  pos(height - 1, width - 1);

//#endregion

//#region instances

export const getPosMonoid: Unary<MO.Monoid<number>, MO.Monoid<Pos>> = (
  monoid: MO.Monoid<number>,
) => MO.struct({ top: monoid, left: monoid });

/** Max and sum monoid for position */
export const monoidPos: Record<'sum' | 'max', MO.Monoid<Pos>> = {
  max: FN.pipe(NU.Bounded, MO.max, getPosMonoid),
  sum: getPosMonoid(NU.MonoidSum),
};

export const ordPos: Record<PosKey, OD.Ord<Pos>> = {
    top: FN.pipe(NU.Ord, OD.contramap(posTop.get)),
    left: FN.pipe(NU.Ord, OD.contramap(posLeft.get)),
  },
  eqPos: EQ.Eq<Pos> = {
    equals: (fst, snd) =>
      ordPos.top.equals(fst, snd) && ordPos.left.equals(fst, snd),
  },
  showPos: SH.Show<Pos> = {
    show: ({ top, left }) => `▲${top}:◀${left}`,
  };

//#endregion

//#region modify

export const [addPosTop, addPosLeft] = [
    FN.flow(NU.add, posTop.mod),
    FN.flow(NU.add, posLeft.mod),
  ],
  [subPosTop, subPosLeft] = [
    FN.flow(NU.subtract, posTop.mod),
    FN.flow(NU.subtract, posLeft.mod),
  ],
  [addPos, subPos]: Pair<BinOp<Pos>> = [
    monoidPos.sum.concat,
    (fst, { top, left }) => FN.pipe(fst, subPosTop(top), subPosLeft(left)),
  ],
  [addPosT, addPosC]: [BinOpT<Pos>, BinOpC<Pos>] = [
    FN.tupled(addPos),
    FN.curry2(addPos),
  ],
  [subPosT, subPosC] = [FN.tupled(subPos), FN.curry2(subPos)],
  [addPosSize, subPosSize]: Pair<Unary<Size, Endo<Pos>>> = [
    FN.flow(posBottomRight, addPosC),
    FN.flow(incSize, posBottomRight, subPosC),
  ],
  [incPos, decPos]: Pair<Endo<Pos>> = [addPosC(unitPos), subPosC(unitPos)];

/**
 * Convert a  set of positions so that all coordinates are positive while keeping
 * the same distances between the positions.
 *
 * Origin is at top left and axes go right and down.
 */
export const translateToPositive: Endo<Pos[]> = ps => {
  const computeDelta: Endo<number> = coord => (coord >= 0 ? 0 : -1 * coord),
    topLeft = min(ps),
    delta = FN.pipe(topLeft, posPair, TU.mapBoth(computeDelta), tupledPos);

  return FN.pipe(ps, FN.pipe(delta, addPosC, AR.map));
};

//#endregion

//#region query

/** True if this is the origin position */
export const isOriginPos: PRE.Predicate<Pos> = FN.pipe(
  originPos,
  FN.curry2(eqPos.equals),
);

export const [minTop, minLeft, maxTop, maxLeft] = FN.pipe(
  [
    [ordPos.top, ordPos.left],
    [OD.min, OD.max],
  ] as const,
  pairCartesian,
  AR.map(
    ([order, cmp]): Unary<Pos[], Pos> =>
      ps => {
        const head = ps[0];
        if (head === undefined) throw new Error('Empty positions');
        return ps.slice(1, ps.length).reduce(cmp(order), head) as Pos;
      },
  ),
) as Tuple4<Unary<Pos[], Pos>>;

export const min = (ps: Pos[]) => pos(minTop(ps).top, minLeft(ps).left);

export const max = (ps: Pos[]) => pos(maxTop(ps).top, maxLeft(ps).left);

export const posRectSize: Unary<Pair<Pos>, Size> = ([tl, br]: Pair<Pos>) => {
  const { top, left } = subPos(br, tl);
  return buildSize(Math.abs(left) + 1, Math.abs(top) + 1);
};

/**
 * True if the given position is inside a rectangle of the given size with a
 * top-left corner at the origin
 *
 */
export const posFits: Unary<Pos, PRE.Predicate<Size>> =
  ({ top, left }) =>
  ({ width, height }) =>
    top < height && left < width;

//#endregion
