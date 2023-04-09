import {
  array as AR,
  function as FN,
  readonlyArray as RA,
  show as SH,
} from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { Orientation, Oriented } from './orientation.js';
import { picksT, Unary, Pair, Tuple4 } from 'commons';

/** The pair of horizontal directions: `left` and `right` */
export const hDirs = ['left', 'right'] as const;

/** The pair of vertical directions: `top` and `bottom` */
export const vDirs = ['top', 'bottom'] as const;

/** A 4-tuple of all directions in clockwise order */
export const allDirs = ['top', 'right', 'bottom', 'left'] as const;

/** A map from orientation to direction pair */
export const orientDirMap = { horizontal: hDirs, vertical: vDirs } as const;

/** A map from orientation to direction pair */
export interface OrientDir {
  horizontal: ['left', 'right'];
  vertical: ['top', 'bottom'];
}

/** The type of a map from orientation to direction pair */
export type OrientDirs<O extends Orientation> = OrientDir[O];

/** Given an orientation, return the matching direction pair */
export const orientDirs = <O extends Orientation>(o: O) =>
  orientDirMap[o] as (typeof orientDirMap)[O] & OrientDirs<O>;

/** The type of the list of all directions */
export type Dirs = typeof allDirs;

/** A direction is a member the union `top` | `right` | `bottom` | `left` */
export type Dir = Dirs[number];

/** A record with directions as keys */
export type Directed<T> = Record<Dir, T>;

/** A record of string per direction */
export type Direct = Directed<string>;

/** The type of the list of horizontal directions */
export type Horizontal = typeof hDirs;

/** A horizontal direction */
export type HDir = Horizontal[number];

/** The type of the list of vertical directions */
export type Vertical = typeof vDirs;

/** A vertical direction */
export type VDir = Vertical[number];

/**
 * Filter out all entries except those keyed by `top`, `right`, `bottom`, or
 * `left`
 */
export const pickDirs =
  <T>() =>
  <D extends Directed<T>>(d: D): Directed<T> =>
    picksT(allDirs)(d);

/**
 * Convert an object of type `{horizontal: T, vertical: T}` to an object of
 * type: `{top: T, right: T, bottom: T, left: T}`. Horizontal values go to
 * the horizontal directions left & right and vertical to the vertical
 * directions top & bottom.
 */
export const fromOriented =
  <T>() =>
  <O extends Oriented<T>>({ horizontal, vertical }: O): Directed<T> => ({
    top: horizontal,
    right: vertical,
    bottom: horizontal,
    left: vertical,
  });

/** Flip the horizontal entries left ⇒ right & right ⇒ left */
export const hFlip =
  <T>() =>
  <D extends Directed<T>>({ right, left, ...rest }: D): Directed<T> => ({
    right: left,
    left: right,
    ...rest,
  });

/** Flip the vertical entries top ⇒ bottom & bottom ⇒ top */
export const vFlip =
  <T>() =>
  <D extends Directed<T>>({ top, bottom, ...rest }: D): Directed<T> => ({
    top: bottom,
    bottom: top,
    ...rest,
  });

/** Flip horizontal and vertical entries: top ↔ bottom and left ↔ right */
export const flip =
  <T>() =>
  <D extends Directed<T>>(d: D): Directed<T> =>
    FN.pipe(d, hFlip<T>(), vFlip<T>());

const reversedDirMap = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const;

/** A record mapping directions to their reverse */
export type ReversedDir = typeof reversedDirMap;

const snugDirMap: Record<Dir, Readonly<Pair<Dir>>> = {
  top: hDirs,
  right: vDirs,
  bottom: hDirs,
  left: vDirs,
};

/** The snug dirs of a direction are the two adjacent directions */
export const snug: Unary<Dir, Pair<Dir>> = dir => snugDirMap[dir] as Pair<Dir>;

/** A `Directed<T>` of a single value */
export const singleton = <T>(t: T): Directed<T> => ({
  top: t,
  right: t,
  bottom: t,
  left: t,
});

/** Type guard from `string` to `Dir` */
export const check = (d: string): d is Dir => d in dirSym;

/** Add `left` and `right` keys to given pair to create a record */
export const withHDirs = <T>([left, right]: Pair<T>): Record<HDir, T> => ({
  left,
  right,
});

/** Add `top` and `bottom` keys to given pair to create a record */
export const withVDirs = <T>([top, bottom]: Pair<T>): Record<VDir, T> => ({
  top,
  bottom,
});

const dirSym = {
  top: '↑',
  right: '→',
  bottom: '↓',
  left: '←',
} as const;

/**
 * Access directions as fields on `dir` instead of as strings. For example:
 * `dir.top = “top”`
 */
export const values = FN.pipe(allDirs, RA.map(TUs.dup), Object.fromEntries) as {
  [K in Dir]: K;
};

/** Map over direction to make a 4-tuple */
export const map = <R>(f: Unary<Dir, R>) =>
  FN.pipe([...allDirs], AR.map(f)) as Tuple4<R>;

/** Zip a 4-tuple with the directions */
export const zip = <R>(r: Tuple4<R>) =>
  FN.pipe([...allDirs], AR.zip(r)) as Tuple4<[Dir, R]>;

/** Map over horizontal directions to make a pair */
export const mapHDir = <R>(f: Unary<'left' | 'right', R>) =>
  FN.pipe([...hDirs], AR.map(f)) as Pair<R>;

/** Map over vertical directions to make a pair */
export const mapVDir = <R>(f: Unary<'top' | 'bottom', R>) =>
  FN.pipe([...vDirs], AR.map(f)) as Pair<R>;

/** Find the reverse direction of a given `Dir` */
export const reversed = <D extends Dir>(d: D): ReversedDir[D] =>
  reversedDirMap[d];

/** Reverse a pair of directions */
export const pairReversed = <D extends Dir>(d: D) =>
  [d, reversed(d)] as [D, ReversedDir[D]];

/** Match by `Dir` */
export const match =
  <R>(top: R, right: R, bottom: R, left: R): Unary<Dir, R> =>
  dir =>
    dir === 'top'
      ? top
      : dir === 'right'
      ? right
      : dir === 'bottom'
      ? bottom
      : left;

/** `Dir` `Show` instance */
export const show: SH.Show<Dir> = { show: dir => dirSym[dir] };

/** Convert a string of 4 border characters to a `Direct` */
export const direct: Unary<string, Direct> = quad => {
  if (quad.length !== 4) throw new Error(`quad with length≠4: ${quad}`);
  const [top, right, bottom, left] = Array.from(quad) as Tuple4<string>;
  return { top, right, bottom, left };
};
