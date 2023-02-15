import {
  function as FN,
  hkt as HKT,
  monoid as MO,
  nonEmptyArray as NEA,
  number as NU,
  ord as OD,
  readonlyArray as RA,
} from 'fp-ts';
import { ObjectEntry, setPropOf, typedEntries } from './object.js';

type Unary<A, B> = (a: A) => B;
type Endo<A> = (a: A) => A;

export type Extract<F extends HKT.URIS, B> = <A>(from: HKT.Kind<F, A>) => B;

export type Extract2<F extends HKT.URIS2, B> = <E, A>(
  from: HKT.Kind2<F, E, A>,
) => B;

export type Mapper<F extends HKT.URIS> = <A, B>(
  f: Unary<A, B>,
) => Unary<HKT.Kind<F, A>, HKT.Kind<F, B>>;

type OrdStruct<T> = { [K in keyof T]: OD.Ord<T[K]> };
type OrdEntry<T> = ObjectEntry<OrdStruct<T>>;

/** Convert a struct of `Ord`s into an ord of struct */
export const ordStruct = <T>(
  ord: MO.Monoid<OD.Ord<T>>,
): Unary<OrdStruct<T>, OD.Ord<T>> =>
  FN.flow(
    typedEntries,
    RA.map<OrdEntry<T>, OD.Ord<T>>(([a, b]) =>
      FN.pipe(
        b,
        OD.contramap(x => x[a]),
      ),
    ),
    MO.concatAll(ord),
  );

export const maxPositiveMonoid: MO.Monoid<number> = FN.pipe(
  NU.Bounded,
  MO.max,
  // fp-ts max zero is -∞, but for positives, 0 is correct
  FN.pipe(0, setPropOf<MO.Monoid<number>>()('empty')),
);

export const nonEmptyAppend = <T>(second: T[]): Endo<NEA.NonEmptyArray<T>> =>
  NEA.concat(second);

export const nonEmptyPrepend =
  <T>(first: T[]): Endo<NEA.NonEmptyArray<T>> =>
  second =>
    NEA.concat(second)(first);
