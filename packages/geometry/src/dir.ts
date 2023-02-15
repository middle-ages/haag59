import {
  array as AR,
  function as FN,
  readonlyArray as RA,
  show as SH,
} from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { Orientation, Oriented } from './orientation.js';
import { picksT, Unary, Pair, Tuple4 } from 'commons';

export const hDirs = ['left', 'right'] as const,
  vDirs = ['top', 'bottom'] as const,
  allDirs = ['top', 'right', 'bottom', 'left'] as const,
  orientDirMap = { horizontal: hDirs, vertical: vDirs } as const;

export interface OrientDir {
  horizontal: ['left', 'right'];
  vertical: ['top', 'bottom'];
}

export type OrientDirs<O extends Orientation> = OrientDir[O];

export const orientDirs = <O extends Orientation>(o: O) =>
  orientDirMap[o] as (typeof orientDirMap)[O] & OrientDirs<O>;

export type Dirs = typeof allDirs;
export type Dir = Dirs[number];
export type Directed<T> = Record<Dir, T>;
export type Direct = Directed<string>;

export type Horizontal = typeof hDirs;
export type HDir = Horizontal[number];
export type Vertical = typeof vDirs;
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
    }),
  /** Flip the vertical entries top ⇒ bottom & bottom ⇒ top */
  vFlip =
    <T>() =>
    <D extends Directed<T>>({ top, bottom, ...rest }: D): Directed<T> => ({
      top: bottom,
      bottom: top,
      ...rest,
    }),
  /** Flip horizontal and vertical entries: top ↔ bottom and left ↔ right */
  flip =
    <T>() =>
    <D extends Directed<T>>(d: D): Directed<T> =>
      FN.pipe(d, hFlip<T>(), vFlip<T>());

const reversedDirMap = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const;

export type ReversedDir = typeof reversedDirMap;

const snugDirMap: Record<Dir, Readonly<Pair<Dir>>> = {
  top: hDirs,
  right: vDirs,
  bottom: hDirs,
  left: vDirs,
};

/** The snug dirs of a direction are the two adjacent directions */
export const snug: Unary<Dir, Pair<Dir>> = dir => snugDirMap[dir] as Pair<Dir>;

export const singleton = <T>(t: T): Directed<T> => ({
    top: t,
    right: t,
    bottom: t,
    left: t,
  }),
  check = (d: string): d is Dir => d in dirSym,
  [withHDirs, withVDirs] = [
    <T>([left, right]: Pair<T>): Record<HDir, T> => ({ left, right }),
    <T>([top, bottom]: Pair<T>): Record<VDir, T> => ({ top, bottom }),
  ],
  dirSym = {
    top: '↑',
    right: '→',
    bottom: '↓',
    left: '←',
  } as const,
  value = FN.pipe(allDirs, RA.map(TUs.dup), Object.fromEntries) as {
    [K in Dir]: K;
  };

export const [mapDir, zipDir] = [
    <R>(f: Unary<Dir, R>) => FN.pipe([...allDirs], AR.map(f)) as Tuple4<R>,
    <R>(r: Tuple4<R>) => FN.pipe([...allDirs], AR.zip(r)) as Tuple4<[Dir, R]>,
  ],
  [mapHDir, mapVDir] = [
    <R>(f: Unary<'left' | 'right', R>) =>
      FN.pipe([...hDirs], AR.map(f)) as Pair<R>,
    <R>(f: Unary<'top' | 'bottom', R>) =>
      FN.pipe([...vDirs], AR.map(f)) as Pair<R>,
  ],
  reversed = <D extends Dir>(d: D): ReversedDir[D] => reversedDirMap[d],
  pairReversed = <D extends Dir>(d: D) =>
    [d, reversed(d)] as [D, ReversedDir[D]];

export const matchDir =
  <R>(top: R, right: R, bottom: R, left: R): Unary<Dir, R> =>
  dir =>
    dir === 'top'
      ? top
      : dir === 'right'
      ? right
      : dir === 'bottom'
      ? bottom
      : left;

export const show: SH.Show<Dir> = { show: dir => dirSym[dir] };

/** Convert a string of 4 border characters to a `Direct` */
export const direct: Unary<string, Direct> = quad => {
  if (quad.length !== 4) throw new Error(`quad with length≠4: ${quad}`);
  const [top, right, bottom, left] = Array.from(quad) as Tuple4<string>;
  return { top, right, bottom, left };
};
