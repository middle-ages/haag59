import { function as FN } from 'fp-ts';
import { lens as LE } from 'monocle-ts';
import { Endo, Unary } from './function.js';
import { Pair } from './tuple.js';

type Lens<S, A> = LE.Lens<S, A>;

export type LensResult<L extends Lens<any, any>> = ReturnType<L['get']>;

/** Convert a pair of lenses into a lens of a pair */
export const pairLens = <T, A, B>([fst, snd]: [Lens<T, A>, Lens<T, B>]): Lens<
  T,
  [A, B]
> => ({
  get: (t: T) => [fst.get(t), snd.get(t)] as [A, B],
  set: ([a, b]: [A, B]) => FN.flow(fst.set(a), snd.set(b)),
});

/**
 * Set the `toLens` with a value we get from `fromLens`, after running it
 * through `f`. Both lenses must be of the same type.
 */
export const copyFromLensWith =
  <R>(f: Endo<R>) =>
  <T>([fromLens, toLens]: Pair<Lens<T, R>>): Unary<Pair<T>, T> =>
  ([from, to]) =>
    FN.pipe(to, FN.pipe(from, fromLens.get, f, toLens.set));

/** Sugar for a lense with a built-in modifier */
export interface ModLens<T, R> extends Lens<T, R> {
  mod: Unary<Endo<R>, Endo<T>>;
}

export const modLens = <T, R>(src: Lens<T, R>): ModLens<T, R> => {
  const mod = (f: Endo<R>) => FN.pipe(src, LE.modify(f));
  Object.assign(src, { mod });
  return src as ModLens<T, R>;
};
