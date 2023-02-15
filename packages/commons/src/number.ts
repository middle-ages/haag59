import {
  function as FN,
  monoid as MO,
  number as NU,
  ord as OD,
  predicate as PRE,
} from 'fp-ts';
import { function as FNs, tuple as TUs } from 'fp-ts-std';
import { Pair } from './tuple.js';
import { Unary, Endo } from './function.js';

const { mapBoth } = TUs;
const { fork } = FNs;

export const max: Unary<number[], number> = FN.pipe(
    NU.Bounded,
    MO.max,
    MO.concatAll,
  ),
  min: Unary<number[], number> = FN.pipe(NU.Bounded, MO.min, MO.concatAll);

export const monoidMax: MO.Monoid<number> = MO.max(NU.Bounded),
  monoidMin: MO.Monoid<number> = MO.min(NU.Bounded);

export const halfInt: Unary<number, Pair<number>> = n => {
  const fst = Math.floor(n / 2);
  return [fst, n - fst];
};

export const [geq, leq]: Pair<PRE.Predicate<Pair<number>>> = FN.pipe(
  NU.Ord,
  fork([OD.geq, OD.leq]),
  mapBoth(FN.tupled),
);

export const floorMod: Endo<Pair<number>> = ([numerator, divisor]) => [
  Math.floor(numerator / divisor),
  numerator % divisor,
];

export const ceilMod: Endo<Pair<number>> = ([numerator, divisor]) => [
  Math.ceil(numerator / divisor),
  numerator % divisor,
];
