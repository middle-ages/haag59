import { Endo, Unary, FN } from './fp-ts.js';
import { lens as LE } from 'monocle-ts';
import { Pair } from './tuple.js';

export type LensResult<L extends LE.Lens<any, any>> = ReturnType<L['get']>;

/** Convert a pair of lenses into a lens of a pair */
export const pairLens = <T, A, B>([fst, snd]: [
  LE.Lens<T, A>,
  LE.Lens<T, B>,
]): LE.Lens<T, [A, B]> => ({
  get: (t: T) => [fst.get(t), snd.get(t)] as [A, B],
  set: ([a, b]: [A, B]) => FN.flow(fst.set(a), snd.set(b)),
});

/**
 * Set the `toLens` with a value we get from `fromLens`, after running it
 * through `f`. Both lenses must be of the same type.
 */
export const copyFromLensWith =
  <R>(f: Endo<R>) =>
  <T>([fromLens, toLens]: Pair<LE.Lens<T, R>>): Unary<Pair<T>, T> =>
  ([from, to]) =>
    FN.pipe(to, FN.pipe(from, fromLens.get, f, toLens.set));

/** Sugar for a lense with a built-in modifier */
export interface ModLens<T, R> extends LE.Lens<T, R> {
  mod: Unary<Endo<R>, Endo<T>>;
}

export const modLens = <T, R>(src: LE.Lens<T, R>): ModLens<T, R> => {
  const mod = (f: Endo<R>) => FN.pipe(src, LE.modify(f));
  Object.assign(src, { mod });
  return src as ModLens<T, R>;
};
