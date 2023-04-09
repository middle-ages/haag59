import { Lazy, FN, FunctionN, HKT, Unary, Endo } from './fp-ts.js';

export type EndoOf<T> = <U extends T>(src: U) => U;
export type UnaryRest<Q, R> = (...args: Q[]) => R;
export type PartialUnary<Q, R> = (q?: Q) => R;

/**
 * Example: a function that works only on arrays
 *
 * ```ts
 * const len: Unary1<array.URI> = arr => arr.length;
 * ```
 *
 * Is exactly the same as:
 *
 * ```ts
 * const len = <A>(arr: A[]): number => arr.length;
 * ```
 */
export type Unary1<F extends HKT.URIS, R> = <A>(fa: HKT.Kind<F, A>) => R;
export type Binary<P, Q, R> = FunctionN<[P, Q], R>;
export type BinaryC<P, Q, R> = Unary<P, Unary<Q, R>>;

export type BinOp<P> = Binary<P, P, P>;
export type BinOpC<P> = BinaryC<P, P, P>;
export type BinOpT<P> = Unary<[P, P], P>;

export type Ternary<S, P, Q, R> = FunctionN<[S, P, Q], R>;
export type TernaryC<S, P, Q, R> = Unary<S, Unary<P, Unary<Q, R>>>;

export const apply0 = <T>(fn: Lazy<T>): T => fn();

export const apply1: <A>(a: A) => <B>(fn: Unary<A, B>) => B = a => fn => fn(a);

/**
 * ```
 * const n: number = pipe('foo', callWith(s => t => (s + t).length)); // 6
 * ```
 */
export const callWith =
  <A, B>(f: Unary<A, Unary<A, B>>): Unary<A, B> =>
  a =>
    FN.pipe(a, f)(a);

/**
 * Uncurry and then untuple a function. E.g.:
 *
 * ```ts
 * const fᶦ  = (a: number) => (b: number): number => a + b;
 *
 * const fᶦᶦ = uncurry2T(fᶦ);
 *
 * // fᶦᶦ(1, 2) === 3
 * ```
 */
export type uncurry2T = <A, B, C>(f: BinaryC<A, B, C>) => Binary<A, B, C>;
export const uncurry2T: uncurry2T = FN.flow(FN.uncurry2, FN.untupled);

export type curry2F = <A, B, C>(f: Binary<A, B, C>) => BinaryC<B, A, C>;

/**
 * A flipped curry for binary functions
 *
 * curry2F = curry • flip
 */
export const curry2F: curry2F = f => b => a => f(a, b);

export type YF<A, R> = Endo<Unary<A, R>>;
export type Y = <A, R>(f: YF<A, R>) => Unary<A, R>;
export type YM<A, R> = (f: YM<A, R>) => Unary<A, R>;

export const self = <A, R>(f: YM<A, R>): Unary<A, R> => f(f);

/**
 * Typed Y-combinator
 *
 * ```ts
 * const fib = (f: Endo<number>) => (n: number): Endo<number> =>
 *     n < 2 ? n : f(n - 1) + f(n - 2);
 *
 * console.log(Y(fib)(7), Y(fib)(8));
 * ```
 */
export const Y: Y = (
  <A, R>(m: YM<A, R>) =>
  (f: YF<A, R>) =>
    m(n => f(x => self(n)(x)))
)(self);
