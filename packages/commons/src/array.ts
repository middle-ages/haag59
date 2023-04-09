import { AR, FN, NEA, OP, RA, RC, TU, Unary, Endo } from './fp-ts.js';
import { typedFromEntries } from './object.js';
import { Pair, Tuple3 } from './tuple.js';

const { flow, pipe, tupled, untupled } = FN;

export const last = <T>(arr: T[]) => arr.at(-1) as T,
  init = <T>(arr: T[]): T[] => arr.slice(0, arr.length - 1),
  initLast = <T>(arr: T[]): [T[], T] => [init(arr), last(arr)];

export const head = <T>(arr: T[]): T => arr[0] as T,
  tail = <T>(arr: T[]): T[] => arr.slice(1, arr.length),
  headTail = <T>(arr: T[]): [T, T[]] => [head(arr), tail(arr)];

export const splitAt =
  (n: number) =>
  <T>(xs: T[]): [T[], T, T[]] => {
    const len = xs.length;
    if (n < 0) {
      if (len < Math.abs(n))
        throw new Error(`splitAt #xs < |n|: “${len}” < |“${n}”|`);

      return [xs.slice(0, n), xs[len + n] as T, xs.slice(len + n + 1, len)];
    } else {
      if (len <= n) throw new Error(`splitAt #xs ≤ n: “${len}” ≤ “${n}”`);
      return [xs.slice(0, n), xs[n] as T, xs.slice(n + 1)];
    }
  };

export const append =
  <T>(parent: T[]): Unary<T, T[]> =>
  child =>
    parent.concat([child]);

export const addAfter =
    <T>(suffix: T[]): Endo<T[]> =>
    xs =>
      xs.concat(suffix),
  addBefore =
    <T>(prefix: T[]): Endo<T[]> =>
    xs =>
      prefix.concat(xs),
  addAround =
    <A>([prefix, suffix]: Pair<A[]>): Endo<A[]> =>
    xs =>
      pipe(xs, addBefore(prefix), addAfter(suffix));

/**
 * Repeat a subgrid as many time as required to fill the given area.
 *
 * If the given area is smaller than the given subgrid, we chop it.
 */
export const repeatSubgrid =
  ([width, height]: Pair<number>) =>
  <T>(from: T[][]): T[][] => {
    if (height === 0) return [];
    const from0 = from[0];
    if (from0 === undefined) throw new Error('repeating empty grid');
    const fromWidth = from0.length;
    const fromHeight = from.length;
    if (fromWidth <= 0) throw new Error('repeating empty subgrid row');

    const [widthN, heightN] = pipe(
        [width / fromWidth, height / fromHeight],
        TU.mapBoth(Math.floor),
      ),
      [widthRem, heightRem] = [
        width - widthN * fromWidth,
        height - heightN * fromHeight,
      ];

    const repeatRow: Endo<T[]> = row =>
      fromWidth === width
        ? row
        : fromWidth > width
        ? row.slice(0, width)
        : AR.flatten(AR.replicate(widthN, row)).concat(row.slice(0, widthRem));

    const body = height < fromHeight ? [] : pipe(from, AR.map(repeatRow)),
      rem = pipe(from.slice(0, heightRem), AR.map(repeatRow));

    return AR.flatten(AR.replicate(heightN, body)).concat(rem);
  };

export const chunksOf =
  (n: number) =>
  <T>(ts: T[]) =>
    pipe(ts, AR.chunksOf(n)) as T[][];

export const zipU = <A, B>(bs: Array<B>, as: Array<A>): Array<[A, B]> =>
  AR.zip(as, bs);

/**
 * Chunk a matrix into 2x2 adjacent squares.
 *
 * Convert a 2D matrix of `T` into a 2D matrix of `Pair<Pair<T>>`.
 *
 * There will be ¼th cells in the new matrix. Each cell will be a pair of
 * columns with two cells each, one for each row.
 *
 * Cells are in a `Some` value. If the original grid is not divisible by four,
 * there will also some `None` values.
 */
export const chunk4x = <T>(rows: T[][]): Pair<Pair<OP.Option<T>>>[][] => {
  const zipAll = <U, V>(u: U[], v: V[]): [OP.Option<U>, OP.Option<V>][] => {
    const max = Math.max(u.length, v.length),
      delta = AR.replicate(max - Math.min(u.length, v.length), OP.none);

    const [opU, opV]: [OP.Option<U>[], OP.Option<V>[]] = [
      pipe(u, AR.map(OP.some), arr =>
        u.length === max ? arr : [...arr, ...delta],
      ),
      pipe(v, AR.map(OP.some), arr =>
        v.length === max ? arr : [...arr, ...delta],
      ),
    ];
    return zipU(opV, opU);
  };

  // each pair is the char in the row + the char below it
  const rowPairs = pipe(
    rows,
    chunksOf(2),
    AR.map(p => (p.length === 2 ? p : [head(p), []])),
  ) as Pair<T[]>[];

  // each pair is the char in the row + the char below it
  const cellPairs: Pair<OP.Option<T>>[][] = pipe(
    rowPairs,
    AR.map(tupled(zipAll)),
  );

  return pipe(
    cellPairs,
    AR.map(
      flow(
        chunksOf(2),
        AR.map(p => (p.length === 2 ? p : [head(p), TU.dup(OP.none)])),
      ),
    ),
  ) as Pair<Pair<OP.Option<T>>>[][];
};

export const mapRange =
  <R>(f: Unary<number, R>): Unary<Pair<number>, R[]> =>
  range =>
    pipe([...NEA.range(...range)], AR.map(f));

export type AdjEntry<T> = [target: T, prevNext: Pair<T[]>];

export const withAdjacent = <T>(chain: T[]): AdjEntry<T>[] => {
  if (chain.length === 2)
    return [
      [head(chain), [[], [last(chain)]]],
      [last(chain), [[head(chain)], []]],
    ];

  /**
   * ```txt
   *               rem   mapped  rem
   *
   *     before       | A B C | D E
   *     at    →    A | B C D | E
   *     after    A B | C D E |
   *
   * ```
   */
  const [before, at, after]: Tuple3<T[]> = pipe(
    chain,
    FN.fork([flow(init, init), flow(init, tail), flow(tail, tail)]),
  );

  return [
    [head(chain), [[], [head(at)]]],

    ...pipe(
      before,
      AR.zip(after),
      AR.zip(at),
      AR.map<[Pair<T>, T], AdjEntry<T>>(([[prev, next], at]) => [
        at,
        [[prev], [next]],
      ]),
    ),

    [last(chain), [[last(at)], []]],
  ];
};

export const toTrueRecord = <K extends string>(ks: readonly K[]) =>
  pipe(ks, RA.map(TU.withSnd(true)), typedFromEntries);

/** Index a list and returns a function for testing membership  */
export const membershipTest = <A extends string>(xs: readonly A[]) => {
  const dict = toTrueRecord(xs);
  return (k: string) => k in dict;
};

/** Index a list and return a record from value to index */
export const indexRecord = <A extends string>(xs: readonly A[]) =>
  RC.fromEntries([...pipe(xs, RA.mapWithIndex(untupled(TU.swap)))]) as Record<
    A,
    number
  >;

export type ByteArray = Uint8ClampedArray;

export const ByteArray = Uint8ClampedArray;

export const emptyByteArray: Unary<number, ByteArray> = n =>
  new Uint8ClampedArray(n);

export type Mapper2D<A, B> = ([rowIdx, colIdx]: [number, number], a: A) => B;

export const mapWithIndex2 = <A, B>(f: Mapper2D<A, B>): Unary<A[][], B[][]> =>
  AR.mapWithIndex((rowIdx, row) =>
    pipe(
      row,
      AR.mapWithIndex((colIdx, cell) => f([rowIdx, colIdx], cell)),
    ),
  );

export const neMapWithIndex2 = <A, B>(
  f: Mapper2D<A, B>,
): Unary<
  NEA.NonEmptyArray<NEA.NonEmptyArray<A>>,
  NEA.NonEmptyArray<NEA.NonEmptyArray<B>>
> =>
  NEA.mapWithIndex((rowIdx, row) =>
    pipe(
      row,
      NEA.mapWithIndex((colIdx, cell) => f([rowIdx, colIdx], cell)),
    ),
  );
