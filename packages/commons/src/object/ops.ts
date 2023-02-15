import {
  array as AR,
  function as FN,
  readonlyArray as RA,
  tuple as TU,
} from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { Unary } from '../function.js';
import { FromKeys, FromEntries, ObjectEntries, ObjectEntry } from './types.js';

const { toSnd, withSnd } = TUs;

export const typedEntries = <T extends {}>(o: T) =>
  Object.entries(o) as unknown as ObjectEntries<T>;

export const typedFromEntries = <
  T extends readonly [...(readonly [PropertyKey, any][])],
>(
  entries: T,
) => Object.fromEntries(entries) as FromEntries<T>;

export const monoObject =
  <V>(v: V) =>
  <K extends string>(keys: readonly K[]) =>
    FN.pipe(keys, RA.map<K, [K, V]>(withSnd(v)), Object.fromEntries) as Record<
      K,
      V
    >;

export const objectMono =
  <K extends string>(keys: readonly K[]) =>
  <V>(v: V): Record<K, V> =>
    monoObject(v)(keys);

export const mapValuesOf =
  <K extends PropertyKey, V>() =>
  <R>(f: (v: V) => R) =>
  (o: Record<K, V>) =>
    FN.pipe(
      Object.entries(o) as [K, V][],
      AR.map(TU.mapSnd(f)),
      Object.fromEntries,
    ) as Record<K, R>;

export const mapValues =
  <A, B>(f: (a: A) => B) =>
  <K extends PropertyKey>(o: Record<K, A>) =>
    FN.pipe(
      Object.entries(o) as [K, A][],
      AR.map(TU.mapSnd(f)),
      Object.fromEntries,
    ) as Record<K, B>;

export const mapEntriesOf =
  <T extends {}>() =>
  <R>(f: (o: ObjectEntry<T>) => R): ((t: T) => readonly R[]) =>
    FN.flow(typedEntries, RA.map(f));

export const fromKeys =
  <T extends readonly any[]>(keys: T): FromKeys<T[number]> =>
  <R>(f: Unary<T[number], R>) =>
    FN.pipe(
      keys,
      RA.map<T[number], [T[number], R]>(k => FN.pipe(k, toSnd(f))),
      typedFromEntries,
    );

export const selfMap = <T extends readonly any[]>(keys: T) =>
  fromKeys(keys)(FN.identity) as { [K in T[number]]: K };
