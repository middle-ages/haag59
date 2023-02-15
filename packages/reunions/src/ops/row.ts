import { BinaryC, Endo, splitAt, stringEq, Unary } from 'commons';
import { array as AR, function as FN, predicate as PRE } from 'fp-ts';
import { array as ARs } from 'fp-ts-std';
import { invertPx, isOn, MatrixRow, Px, PxRow, TupleRes } from '../data.js';

const { join, sum } = ARs;

export const [splitPx, joinPx]: [
  Unary<MatrixRow, PxRow>,
  Unary<PxRow, MatrixRow>,
] = [row => Array.from(row) as TupleRes<Px>, row => row.join('') as MatrixRow];

export const invertRow: Endo<PxRow> = row =>
  FN.pipe(row, AR.map(invertPx)) as PxRow;

export const isRowOnAt: Unary<PxRow, PRE.Predicate<number>> = row => left => {
  const px = row[left];
  if (px === undefined) throw new Error('Out of range pixel access');
  return isOn(px);
};

export const modRowPx: BinaryC<Endo<Px>, number, Endo<PxRow>> =
  f => i => row => {
    const [before, px, after] = FN.pipe(row, splitAt(i));
    return [...before, f(px), ...after] as PxRow;
  };

export const countPx: Unary<PxRow, number> = row =>
  FN.pipe(
    row,
    AR.map(px => (isOn(px) ? 1 : 0)),
    sum,
  );

export const countAt: BinaryC<number[], PxRow, number> = indexes => row =>
  FN.pipe(
    indexes,
    FN.pipe(row, isRowOnAt, AR.map),
    AR.map(t => (t ? 1 : 0)),
    sum,
  );

export const flip: Endo<PxRow> = px => FN.pipe(px, AR.reverse) as PxRow;

export const isSymmetric: PRE.Predicate<PxRow> = row =>
  FN.pipe(row, AR.reverse, join(''), FN.pipe(row, join(''), stringEq));
