import { BinOpT, Pair, Tuple3, Unary } from 'commons';
import { function as FN, option as OP, tuple as TU } from 'fp-ts';
import { tryStacks } from './stack.js';

const cache = new Map<string, OP.Option<string>>();

const customStacks = ['←→↔', '↓↑↕'];

for (const custom of customStacks) {
  const [fst, snd, stacked] = Array.from(custom) as Tuple3<string>;
  cache.set(fst + snd, OP.some(stacked));
}

export const tryCachedStack: Unary<Pair<string>, OP.Option<string>> = ([
  below,
  above,
]) => {
  const key = below + above,
    attempt = cache.get(key);

  if (attempt !== undefined) return attempt;

  const res = tryStacks([below, above]);

  cache.set(key, res);

  return res;
};

export const cachedStack: BinOpT<string> = pair =>
  FN.pipe(
    pair,
    tryCachedStack,
    FN.pipe(pair, TU.snd, FN.constant, OP.getOrElse),
  );
