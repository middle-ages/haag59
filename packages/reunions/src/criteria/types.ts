import { predicate as PRE } from 'fp-ts';
import { Pair, Unary } from 'commons';
import { RelCheck } from '../data.js';

export type CharCheck = PRE.Predicate<Pair<string>>;

export interface MatrixCriteria {
  matrixCheck: RelCheck;
}

export interface CharCriteria {
  charCheck: CharCheck;
}

export interface FixedCriteria {
  pairs: Pair<string>[];
  chains: string[][];
}

export type Criteria = MatrixCriteria | CharCriteria | FixedCriteria;

export const matrixCriteria: Unary<RelCheck, MatrixCriteria> = matrixCheck => ({
    matrixCheck,
  }),
  charCriteria: Unary<CharCheck, CharCriteria> = charCheck => ({ charCheck });

const isMatrixCriteria = (c: Criteria): c is MatrixCriteria =>
    'matrixCheck' in c,
  isCharCriteria = (c: Criteria): c is CharCriteria => 'charCheck' in c;

export const matchCriteria =
  <R>(
    matrix: Unary<RelCheck, R>,
    char: Unary<CharCheck, R>,
    fixed: Unary<[Pair<string>[], string[][]], R>,
  ): Unary<Criteria, R> =>
  c =>
    isMatrixCriteria(c)
      ? matrix(c.matrixCheck)
      : isCharCriteria(c)
      ? char(c.charCheck)
      : fixed([c.pairs, c.chains]);
