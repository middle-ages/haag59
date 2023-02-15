import { either as EI, function as FN } from 'fp-ts';
import { Unary } from './function.js';

const { pipe } = FN;

const _tag = Symbol();

export type Thunk<T> = FN.Lazy<Trampoline<T>>;
export type Wrapped<T> = EI.Either<Thunk<T>, T>;

export interface Trampoline<T> {
  _tag: typeof _tag;
  wrapped: Wrapped<T>;
}

export type Tailcall<T> = Unary<T, Trampoline<T>>;

const wrap = <T>(wrapped: Wrapped<T>): Trampoline<T> => ({ _tag, wrapped });

export const finalResult = <T>(value: T): Trampoline<T> =>
  pipe(value, EI.right, wrap);

export const delayResult = <T>(thunk: FN.Lazy<Trampoline<T>>): Trampoline<T> =>
  pipe(thunk, EI.left, wrap);

/**
 * Trampoline combinator
 *
 * Given a trampolined (I.e. returns `Trampoline<T>` instead of `T`)
 * tail-recursive function, returns it's stack-safe version.
 *
 * A Trampolined function should return either:
 *
 * * `finalResult(value)` - on finalResult recursive call
 * * `delayResult(thunk)` - further recursion required
 *
 * ```ts
 * const safeFactorial: Endo<number> = n => {
 *   const factorial: Binary<number, number, Trampoline<number>> = (n, acc) =>
 *     n > 1 ? delayResult(() => factorial(n - 1, n * acc)) : finalResult(acc);
 * //          ↑↑
 * //          must not recurse, instead returns lazy recursion
 *
 *   return FN.flow(factorial, trampoline)(n, 1);
 * };
 *
 * const unsafeFactorial: Endo<number> = n =>
 *   n > 1 ? n * unsafeFactorial(n - 1) : 1;
 * //            ↑↑
 * //            unsafe version recurses oblivious to its impending doom
 *
 * const range = [1, 2, 3, 4 , 1_000_000];
 *
 * // Looking good, no issues with stack size
 * range.forEach(n => console.log({ n, safe: safeFactorial(n) }));
 *
 * // Final member of the range crashes with 'Maximum call stack size exceeded'
 * range.forEach(n => console.log({ n, unsafe: unsafeFactorial(n) }));
 * ```
 */
export const trampoline = <T>(res0: Trampoline<T>): T => {
  let { wrapped } = res0;
  while (EI.isLeft(wrapped)) wrapped = wrapped.left().wrapped;
  return wrapped.right;
};
