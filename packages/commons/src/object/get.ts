import { HasKey, KeyList, ValueList } from './types.js';

/**
 *
 * Pick a subset of an exact type by keys
 *
 * ```ts
 * const a = 1;
 * ```
 *
 */
export const picks =
  <KS extends readonly PropertyKey[]>(...keys: KS) =>
  <T extends { [K in KS[number]]?: T[K] }>(o: T): Pick<T, KS[number]> => {
    const res = {} as Pick<T, KS[number]>;
    keys.forEach((key: KS[number]) => {
      res[key] = o[key];
    });
    return res;
  };

/** Tupled version of `picks` */
export const picksT = <KS extends readonly PropertyKey[]>(keys: KS) =>
  picks(...keys);

export const typedKeys = <T extends {}>(o: T) =>
  Object.keys(o) as unknown as KeyList<T>;

export const typedValues = <T extends {}>(o: T) =>
  Object.values(o) as unknown as ValueList<T>;

export const pluck =
  <K extends string>(k: K) =>
  <T extends HasKey<K, T[K]>>(o: T): T[K] =>
    o[k];

/** Flipped version of pluck */
export const pluckF =
  <T extends {}>(o: T) =>
  <K extends string & keyof T>(k: K): T[K] =>
    o[k];

export const pluckFrom =
  <K extends string>(k: K) =>
  <T extends HasKey<K, T[K]>>(): ((t: T) => T[K]) =>
    pluck(k);

/*

 * const picked: { a: number; b: string } = picks(
 *   'a',
 *   'b',
 * )({ a: 1, b: 'foo', c: /re/ });
    */
