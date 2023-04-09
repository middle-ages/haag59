import { N } from 'ts-toolbelt';
import { FN, Unary } from './fp-ts.js';

export type Pair<T> = [T, T];
export type Tuple3<T> = [T, T, T];
export type Tuple4<T> = [T, T, T, T];
export type TupleN<T, Len extends number> = readonly [T, ...T[]] & {
  length: Len;
};

export type AnyTuple = readonly any[];

/**
 * Reverse a tuple type
 *
 * Given these tuple types:
 * ```ts
 * type EmptyTuple = readonly [];
 * type OneType    = readonly [number];
 * type ThreeTypes = readonly [number, string, RegExp];
 * ```
 *
 * We can reverse their order:
 * ```ts
 * type EmptyTupleReversed = Reverse<EmptyTuple>;
 * type OneTypeReversed    = Reverse<OneType>;
 * type ThreeTypesReversed = Reverse<ThreeTypes>;
 * ```
 *
 * To get new tuple types:
 * ```ts
 * type EmptyTupleReversed = readonly [];
 * type OneTypeReversed    = readonly [number];
 * type ThreeTypesReversed = readonly [RegExp, string, number];
 * ```
 *
 */
export type Reverse<T extends AnyTuple> = T['length'] extends 0
  ? []
  : T['length'] extends 1
  ? T
  : [...Reverse<Tail<T>>, Head<T>];

export type Head<T extends AnyTuple> = T[0];

export type Tail<T extends AnyTuple> = T extends readonly [any?, ...infer U]
  ? U
  : [...T];

export type DropLast<T extends AnyTuple> = T extends readonly [...infer L, any]
  ? L
  : [];

export type Last<T extends AnyTuple> = T extends readonly [
  ...DropLast<T>,
  infer L,
]
  ? L
  : [];

export type WithKeys<K1 extends string, K2 extends string, A, B> = {
  [k in K1]: A;
} & { [k in K2]: B };

export const withKeys =
  <K1 extends string, K2 extends string>(k1: K1, k2: K2) =>
  <A, B>([a, b]: [A, B]) =>
    ({
      [k1]: a,
      [k2]: b,
    } as WithKeys<K1, K2, A, B>);

export const pairApply = <A, B>([a, f]: [A, Unary<A, B>]): B => f(a),
  applyPair = <A, B>([f, a]: [Unary<A, B>, A]): B => f(a);

export const pairFlow = <A, B, C>([f, g]: [Unary<A, B>, Unary<B, C>]): Unary<
    A,
    C
  > => FN.flow(f, g),
  flowPair = <A, B, C>([f, g]: [Unary<B, C>, Unary<A, B>]): Unary<A, C> =>
    FN.flow(g, f);

export const tuple3Map =
  <T, U>(f: Unary<T, U>): Unary<Tuple3<T>, Tuple3<U>> =>
  ([a, b, c]) =>
    [f(a), f(b), f(c)];

export const tuple4Map =
  <T, U>(f: Unary<T, U>): Unary<Tuple4<T>, Tuple4<U>> =>
  ([a, b, c, d]) =>
    [f(a), f(b), f(c), f(d)];

export const pairAp =
  <A, B, C>(f: Unary<A, B>, g: Unary<A, C>): Unary<[A, A], [B, C, B, C]> =>
  ([a, b]) =>
    [f(a), g(a), f(b), g(b)];

export const tupleAppend =
  <A>(a: A) =>
  <T extends readonly [...any[]]>(tuple: T): readonly [...T, A] =>
    [...tuple, a];

export const appendTuple =
  <T, TLen extends number>(fst: TupleN<T, TLen>) =>
  <ULen extends number>(snd: TupleN<T, ULen>) =>
    [...fst, ...snd] as const as TupleN<T, N.Add<TLen, ULen>>;

export const flattenPair = <T>([fst, snd]: Pair<Pair<T>>): Tuple4<T> => [
  ...fst,
  ...snd,
];

export const pairCartesian = <A, B, C, D>([[a, b], [c, d]]: readonly [
  readonly [A, B],
  readonly [C, D],
]): [[A, C], [B, C], [A, D], [B, D]] => [
  [a, c],
  [b, c],
  [a, d],
  [b, d],
];
