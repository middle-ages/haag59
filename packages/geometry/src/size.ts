import {
  AR,
  Binary,
  BinOp,
  BinOpC,
  BinOpT,
  Endo,
  EQ,
  FN,
  maxPositiveMonoid,
  MO,
  modLens,
  NU,
  objectMono,
  OD,
  Pair,
  pairFlow,
  PRE,
  SH,
  TU,
  typedValues,
  Unary,
} from 'commons';
import { lens as LE } from 'monocle-ts';

export const sizeKeys = ['width', 'height'] as const;

export type SizeKey = (typeof sizeKeys)[number];

export type Size = Record<SizeKey, number>;

//#region build

export const build: Binary<number, number, Size> = (width, height) => ({
  width,
  height,
});

export const tupled = FN.tupled(build);

export const fromWidth: Unary<number, Size> = FN.flow(TU.withSnd(0), tupled);

export const fromHeight: Unary<number, Size> = FN.flow(TU.withFst(0), tupled);

export const square: Unary<number, Size> = FN.flow(TU.dup, tupled);

export const [empty, unitSquare] = FN.pipe([0, 1], TU.mapBoth(square));

export const fromPartial =
  (fallback: Size) =>
  (size?: Partial<Size>, w?: number, h?: number): Size =>
    FN.pipe({ ...fallback, ...size }, width.set(w ?? 1), height.set(h ?? 1));

//#endregion

//#region query

const lens = (k: SizeKey) => FN.pipe(LE.id<Size>(), LE.prop(k), modLens);

export const pair: Unary<Size, Pair<number>> = typedValues;

export const width = lens('width');

export const height = lens('height');

export const area: Unary<Size, number> = ({ width, height }) => width * height;

export const hasArea: PRE.Predicate<Size> = ({ width, height }) =>
  width !== 0 || height !== 0;

export const isEmpty: PRE.Predicate<Size> = ({ width, height }) =>
  width === 0 && height === 0;

/** True if the 2nd given size fits inside the 1st */
export const fitsInside: Unary<Size, PRE.Predicate<Size>> =
  ({ width: parentWidth, height: parentHeight }) =>
  ({ width: childWidth, height: childHeight }) =>
    parentWidth >= childWidth && parentHeight >= childHeight;

//#endregion

//#region modify

export const addWidth = FN.flow(NU.add, width.mod);

export const addHeight = FN.flow(NU.add, height.mod);

export const subWidth = FN.flow(NU.subtract, width.mod);

export const subHeight = FN.flow(NU.subtract, height.mod);

export const add: BinOp<Size> = (fst, { width, height }) =>
  FN.pipe(fst, addWidth(width), addHeight(height));

export const sub: BinOp<Size> = (fst, { width, height }) =>
  FN.pipe(fst, subWidth(width), subHeight(height));

export const subT = FN.tupled(sub);

export const subC = FN.curry2(sub);

export const addT: BinOpT<Size> = FN.tupled(add);

export const addC: BinOpC<Size> = FN.curry2(add);

export const addAll: Unary<Size[], Size> = AR.reduce(empty, add);

export const inc: Endo<Size> = FN.pipe([1, 1], tupled, addC);

export const dec: Endo<Size> = FN.pipe([1, 1], tupled, subC);

export const halfWidth = width.mod(n => Math.floor(n / 2));

export const halfHeight = height.mod(n => Math.floor(n / 2));

export const half: Endo<Size> = FN.flow(halfWidth, halfHeight);

export const scaleH: Unary<number, Endo<Size>> =
  n =>
  ({ width, height }) => ({ width: width * n, height });

export const scaleV: Unary<number, Endo<Size>> =
  n =>
  ({ width, height }) => ({ width, height: height * n });

export const scale: Unary<number, Endo<Size>> = FN.flow(
  FN.fork([scaleH, scaleV]),
  pairFlow,
);
export const double: Endo<Size> = scale(2);

export const abs: Endo<Size> = ({ width, height }) => ({
  width: Math.abs(width),
  height: Math.abs(height),
});

export const clamped: Unary<Pair<Pair<number>>, Endo<Size>> =
  ([[minW, maxW], [minH, maxH]]) =>
  ({ width, height }) =>
    build(
      width < minW ? minW : width > maxW ? maxW : width,
      height < minH ? minH : height > maxH ? maxH : height,
    );

//#endregion

//#region instances

export const getMonoid: Unary<MO.Monoid<number>, MO.Monoid<Size>> = (
  monoid: MO.Monoid<number>,
) => FN.pipe(monoid, objectMono(sizeKeys), MO.struct);

/** Record of `max | sum` to `Monoid` of `Size` for the operation */
export const monoid: Record<'sum' | 'max', MO.Monoid<Size>> = {
  max: getMonoid(maxPositiveMonoid), // size≥0
  sum: getMonoid(NU.MonoidSum),
};

/** Record of `width | height` to `Ord` instance for that axis */
export const ord: Record<SizeKey, OD.Ord<Size>> = {
  width: FN.pipe(NU.Ord, OD.contramap(width.get)),
  height: FN.pipe(NU.Ord, OD.contramap(height.get)),
};

/** Size `Eq` instance */
export const eq: EQ.Eq<Size> = {
  equals: (fst, snd) =>
    ord.width.equals(fst, snd) && ord.height.equals(fst, snd),
};

/** Size `Show` instance */
export const show: SH.Show<Size> = {
  show: ({ width, height }) => `↔${width}:↕${height}`,
};

//#endregion

//#region operations

/** Fill the area defined by the size with the given value */
export const fill =
  <T>(t: T): Unary<Size, T[][]> =>
  s =>
    AR.replicate(height.get(s), AR.replicate(width.get(s), t));

//#endregion
