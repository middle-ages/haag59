import { array as AR, function as FN } from 'fp-ts';
import { array as ARs, tuple as TUs, function as FNs } from 'fp-ts-std';
import { Pair, Endo, Unary, Tuple3, callWith } from 'commons';
import { Matrix } from '../data.js';
import * as matrix from './matrix.js';

const { cartesian } = ARs,
  { applyEvery, flip } = FNs,
  { mapBoth } = TUs;

const centerIdx = [3, 4],
  [leftIdx, rightIdx] = [2, 5];

const off: Unary<Pair<number>[], Endo<Matrix>> = FN.flow(
  AR.map(matrix.setPxOff),
  applyEvery,
);

const centerRowsOff: Unary<number[], Endo<Matrix>> = FN.flow(
  FN.pipe(centerIdx, flip<number[], number[], Pair<number>[]>(cartesian)),
  off,
);

export const [left, center, right] = FN.pipe(
    [[leftIdx], centerIdx, [rightIdx]],
    AR.map(centerRowsOff),
  ) as Tuple3<Endo<Matrix>>,
  [bottom, top] = FN.pipe(
    [right, left],
    mapBoth(f => FN.flow(matrix.antiTurn, f, matrix.turn)),
  );

const threeDirections: Endo<Matrix>[] = [
  FN.flow(top, right, bottom),
  FN.flow(right, bottom, left),
  FN.flow(bottom, left, top),
  FN.flow(left, top, right),
];

export const thinThickFix: Endo<Matrix>[] = FN.pipe(
  [leftIdx, rightIdx],
  callWith<Pair<number>, Pair<number>[]>(cartesian),
  AR.map(matrix.setPxOn),
);

export const centered: Endo<Matrix>[] = [
  FN.identity,
  ...thinThickFix,
  center,
  ...threeDirections,
  FN.flow(threeDirections[0] ?? FN.identity, left),
];
