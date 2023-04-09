/**
 * Combine fp-ts and fp-ts-std for easier importing
 */

import {
  array as AR1,
  function as FN1,
  string as STR1,
  tuple as TU1,
  number as NU1,
  applicative as AP,
  bifunctor as BI,
  either as EI,
  endomorphism as EO,
  eq as EQ,
  hkt as HKT,
  monoid as MO,
  nonEmptyArray as NEA,
  option as OP,
  ord as OD,
  predicate as PRE,
  reader as RE,
  readonlyArray as RA,
  record as RC,
  show as SH,
} from 'fp-ts';

import {
  array as AR2,
  tuple as TU2,
  function as FN2,
  number as NU2,
  string as STR2,
} from 'fp-ts-std';

export type Effect<T> = Unary<T, void>;
export type Unary<Q, R> = FN1.FunctionN<[Q], R>;
export type Endo<T> = EO.Endomorphism<T>;
export type FunctionN<A extends unknown[], B> = FN1.FunctionN<A, B>;
export type Lazy<A> = FN1.Lazy<A>;
export type NonEmptyArray<A> = NEA.NonEmptyArray<A>;

export const AR = { ...AR1, ...AR2 };
export const TU = { ...TU1, ...TU2 };
export const FN = { ...FN1, ...FN2 };
export const STR = { ...STR1, ...STR2 };
export const NU = { ...NU1, ...NU2 };

export { AP, BI, EI, EO, EQ, HKT, MO, NEA, OD, OP, PRE, RA, RC, RE, SH };
