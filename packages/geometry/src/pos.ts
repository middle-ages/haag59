import {
  array as AR,
  eq as EQ,
  function as FN,
  monoid as MO,
  number as NU,
  ord as OD,
  predicate as PRE,
  show as SH,
} from 'fp-ts';
import { tuple as TUs, function as FNs, number as NUs } from 'fp-ts-std';
import { lens as LE } from 'monocle-ts';
import {
  Binary,
  BinOp,
  BinOpC,
  BinOpT,
  Endo,
  Unary,
  modLens,
  typedValues,
  Pair,
  pairCartesian,
  Tuple4,
} from 'commons';
import { build as buildSize, inc as incSize, Size } from './size.js';

const { curry2 } = FNs,
  { add: plus, subtract } = NUs,
  { mapBoth, withFst, withSnd } = TUs;

export const keys = ['top', 'left'] as const;

export type PosKey = (typeof keys)[number];
export type Pos = Record<PosKey, number>;

//#region build

export const build: Binary<number, number, Pos> = (top, left) => ({
  top,
  left,
});
export const tupled = FN.tupled(build);
export const curried = curry2(build);
export const fromTop: Unary<number, Pos> = FN.flow(withSnd(0), tupled);
export const fromLeft: Unary<number, Pos> = FN.flow(withFst(0), tupled);

/** The unit position at `{top=1, left=1}` */
export const unit = build(1, 1);

/** The origin position at `{top=0, left=0}` */
export const origin = build(0, 0);

//#endregion

//#region query

const lens = LE.id<Pos>();

/** Position top lense */
export const top = FN.pipe(lens, LE.prop('top'), modLens);

/** Position left lense */
export const left = FN.pipe(lens, LE.prop('left'), modLens);

/** Get the position as a `top`, `left` pair */
export const pair: Unary<Pos, Pair<number>> = typedValues;

/** Compute size of rectangle between origin and this position */
export const sizeFromOrigin: Unary<Pos, Size> = ({ top, left }) =>
  buildSize(left + 1, top + 1);

/**
 * Compute bottom right position of rectangle with given height and with this
 * position at the top left
 */
export const bottomRight: Unary<Size, Pos> = ({ width, height }) =>
  build(height - 1, width - 1);

//#endregion

//#region instances

export const getMonoid: Unary<MO.Monoid<number>, MO.Monoid<Pos>> = (
  monoid: MO.Monoid<number>,
) => MO.struct({ top: monoid, left: monoid });

/** Max and sum monoid for position */
export const monoid: Record<'sum' | 'max', MO.Monoid<Pos>> = {
  max: FN.pipe(NU.Bounded, MO.max, getMonoid),
  sum: getMonoid(NU.MonoidSum),
};

export const ord: Record<PosKey, OD.Ord<Pos>> = {
    top: FN.pipe(NU.Ord, OD.contramap(top.get)),
    left: FN.pipe(NU.Ord, OD.contramap(left.get)),
  },
  eq: EQ.Eq<Pos> = {
    equals: (fst, snd) => ord.top.equals(fst, snd) && ord.left.equals(fst, snd),
  },
  show: SH.Show<Pos> = {
    show: ({ top, left }) => `▲${top}:◀${left}`,
  };
//#endregion

//#region modify
export const [addTop, addLeft] = [
    FN.flow(plus, top.mod),
    FN.flow(plus, left.mod),
  ],
  [subTop, subLeft] = [FN.flow(subtract, top.mod), FN.flow(subtract, left.mod)],
  [add, sub]: Pair<BinOp<Pos>> = [
    monoid.sum.concat,
    (fst, { top, left }) => FN.pipe(fst, subTop(top), subLeft(left)),
  ],
  [subT, subC] = [FN.tupled(sub), curry2(sub)],
  [addT, addC]: [BinOpT<Pos>, BinOpC<Pos>] = [FN.tupled(add), curry2(add)],
  [addSize, subSize]: Pair<Unary<Size, Endo<Pos>>> = [
    FN.flow(bottomRight, addC),
    FN.flow(incSize, bottomRight, subC),
  ],
  [inc, dec]: Pair<Endo<Pos>> = [addC(unit), subC(unit)];

/**
 * Convert a  set of positions so that all coordinates are positive while keeping
 * the same distances between the positions.
 *
 * Origin is at top left and axes go right and down.
 */
export const translateToPositive: Endo<Pos[]> = ps => {
  const computeDelta: Endo<number> = coord => (coord >= 0 ? 0 : -1 * coord),
    topLeft = min(ps),
    delta = FN.pipe(topLeft, pair, mapBoth(computeDelta), tupled);

  return FN.pipe(ps, FN.pipe(delta, addC, AR.map));
};

//#endregion

//#region query

/** True if this is the origin position */
export const isOrigin: PRE.Predicate<Pos> = FN.pipe(origin, curry2(eq.equals));

export const [minTop, minLeft, maxTop, maxLeft] = FN.pipe(
  [
    [ord.top, ord.left],
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

export const min = (ps: Pos[]) => build(minTop(ps).top, minLeft(ps).left);

export const max = (ps: Pos[]) => build(maxTop(ps).top, maxLeft(ps).left);

export const rectSize: Unary<Pair<Pos>, Size> = ([tl, br]: Pair<Pos>) => {
  const { top, left } = sub(br, tl);
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
