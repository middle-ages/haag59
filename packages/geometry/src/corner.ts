import { function as FN, readonlyArray as RA, show as SH } from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { Unary, Tuple4 } from 'commons';

const { dup } = TUs;

/** 4-tuple of all corner names */
export const allCorners = [
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
] as const;

/** One of 4 corner positions on a rectangle */
export type Corner = (typeof allCorners)[number];

/** Dictionary of `Corner` ⇒ `T` */
export type Cornered<T> = Record<Corner, T>;

/** 4-tuple of corner positions on a rectangle */
export type Corners = Cornered<string>;

export const sym: Corners = {
  topLeft: '↖',
  topRight: '↗',
  bottomLeft: '↙',
  bottomRight: '↘',
};

export const value = FN.pipe(allCorners, RA.map(dup), Object.fromEntries) as {
  [K in Corner]: K;
};

/** `string` to corner type guard */
export const checkCorner = (d: string): d is Corner => d in sym;

/** Map over all corners to make a 4-tuple */
export const mapCorners = <R>(f: Unary<Corner, R>) =>
  FN.pipe(allCorners, RA.map(f)) as Tuple4<R>;

/** Zip a 4-tuple with the corners */
export const zipCorners = <R>(r: Tuple4<R>) =>
  FN.pipe(allCorners, RA.zip(r)) as Tuple4<[Corner, R]>;

/**
 * Create a cornered from a tuple in order: top left, top right, bottom left,
 * bottom right.
 */
export const fromTuple = <T>([
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
]: Tuple4<T>): Cornered<T> => ({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
});

/** Create a `Cornered<T>` of a single value */
export const cornerSingleton = <T>(t: T): Cornered<T> =>
  fromTuple([t, t, t, t]);

export const show: SH.Show<Corner> = { show: corner => sym[corner] };

/** Convert a string of 4 border characters to a `Corners` */
export const cornered: Unary<string, Corners> = quad => {
  if (quad.length !== 4) throw new Error(`quad with length≠4: ${quad}`);
  const [topLeft, topRight, bottomLeft, bottomRight] = Array.from(
    quad,
  ) as Tuple4<string>;
  return { topLeft, topRight, bottomLeft, bottomRight };
};
