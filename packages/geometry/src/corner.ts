import { Unary, Tuple4, FN, RA, SH, TU } from 'commons';

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

const sym: Corners = {
  topLeft: '↖',
  topRight: '↗',
  bottomLeft: '↙',
  bottomRight: '↘',
};

export const cornerValues = FN.pipe(
  allCorners,
  RA.map(TU.dup),
  Object.fromEntries,
) as {
  [K in Corner]: K;
};

/** `string` to corner type guard */
export const checkCorner = (d: string): d is Corner => d in sym;

/** Map over all corners to make a 4-tuple */
export const mapCorner = <R>(f: Unary<Corner, R>) =>
  FN.pipe(allCorners, RA.map(f)) as Tuple4<R>;

/** Zip a 4-tuple with the corners */
export const zipCorner = <R>(r: Tuple4<R>) =>
  FN.pipe(allCorners, RA.zip(r)) as Tuple4<[Corner, R]>;

/**
 * Create a cornered from a tuple in order: top left, top right, bottom left,
 * bottom right.
 */
export const cornerFromTuple = <T>([
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
export const singletonCorner = <T>(t: T): Cornered<T> =>
  cornerFromTuple([t, t, t, t]);

/** `Corner` `Show` instance */
export const showCorner: SH.Show<Corner> = { show: corner => sym[corner] };

/** Convert a string of 4 border characters to a `Corners` */
export const cornered: Unary<string, Corners> = quad => {
  if (quad.length !== 4) throw new Error(`quad with length≠4: ${quad}`);
  const [topLeft, topRight, bottomLeft, bottomRight] = Array.from(
    quad,
  ) as Tuple4<string>;
  return { topLeft, topRight, bottomLeft, bottomRight };
};
