import {
  array as AR,
  function as FN,
  nonEmptyArray as NE,
  predicate as PRE,
} from 'fp-ts';
import { BinOp, Endo, Unary, Pair, stringEq } from 'commons';
import { tuple as TUs } from 'fp-ts-std';

const { mapBoth } = TUs;

export type Px = '#' | '⁺';
export type PxRow = TupleRes<Px>;
export type Matrix = TupleRes<PxRow>;
export type MatrixRow = `${Px}${Px}${Px}${Px}${Px}${Px}${Px}${Px}`;
export type TupleRes<T> = [T, T, T, T, T, T, T, T];

export type RowOp = BinOp<PxRow>;
export type RowCheck = PRE.Predicate<PxRow>;
export type Check = PRE.Predicate<Matrix>;

/** Check if two bitmaps are related */
export type RelCheck = PRE.Predicate<Pair<Matrix>>;

export const resolution = 8,
  resolutionRange = NE.range(0, resolution - 1);

export const [pxOn, pxOff]: Pair<Px> = ['#', '⁺'];

export const [emptyRow, fullRow]: Pair<PxRow> = [
    ['⁺', '⁺', '⁺', '⁺', '⁺', '⁺', '⁺', '⁺'],
    ['#', '#', '#', '#', '#', '#', '#', '#'],
  ],
  [emptyMatrix, fullMatrix]: Pair<Matrix> = FN.pipe(
    [emptyRow, fullRow],
    mapBoth(<T>(t: T) => AR.replicate(resolution, t) as TupleRes<T>),
  );

export const isOn: PRE.Predicate<Px> = stringEq('#'),
  isOff: PRE.Predicate<Px> = PRE.not(isOn),
  invertPx: Endo<Px> = px => (isOn(px) ? pxOff : pxOn);

/**
 * Convert matrix to binary number in a string useful as a bitmap key for
 * caching
 *
 * @param matrix - the bitmap matrix to serialize
 * @returns
 * String representation of the matrix as a binary number.
 */
export const toBin: Unary<Matrix, string> = matrix =>
  FN.pipe(matrix, AR.chain(AR.map(p => (isOn(p) ? '1' : '0')))).join('');
