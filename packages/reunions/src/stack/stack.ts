import { BinaryC, Endo, Pair, pairFlow, Unary } from 'commons';
import {
  array as AR,
  function as FN,
  monoid as MO,
  option as OP,
  predicate as PRE,
  tuple as TU,
} from 'fp-ts';
import { function as FNs, array as ARs, tuple as TUs } from 'fp-ts-std';
import { bitmapRegistry as reg } from '../bitmap.js';
import { Matrix, toBin } from '../data.js';
import { named } from '../named.js';
import { monoid, switches } from '../ops.js';

const { join } = ARs,
  { mapBoth, toSnd } = TUs,
  { fork } = FNs;

type Stack = Unary<Pair<string>, OP.Option<string>>;

type Replace = Unary<string, OP.Option<string>>;

const replace: Pair<Replace> = [named.doubleToThick, named.undashLine];

/**
 * Given a set of `Bitmap⇒Bitmap` functions, and a pair of bitmaps, for each
 * function, run it on the bitmap and return a character if found.  If no
 * characters found for any of the functions, returns `None`.
 */
const stackMatrices: Unary<Pair<Matrix>, OP.Option<string>> = bms => {
  const stacked = FN.pipe(bms, MO.concatAll(monoid));

  for (const pixelSwitch of switches.centered) {
    const switched: Matrix = pixelSwitch(stacked);
    const res = reg.charByMatrix(switched);
    if (OP.isSome(res)) return res;
  }
  return OP.none;
};

const stackCache = new Map<string, OP.Option<string>>();

const makeKey: Unary<Pair<Matrix>, string> = FN.flow(mapBoth(toBin), join(''));

const stackChars: Stack = chars => {
  if (!reg.hasCharPair(chars)) return OP.none;
  const bms = reg.pairCharToMatrix(chars);

  const maybeOrUndefChar = stackCache.get(makeKey(bms));
  if (maybeOrUndefChar !== undefined) return maybeOrUndefChar;

  const res: OP.Option<string> = stackMatrices(bms);
  stackCache.set(makeKey(bms), res);

  return res;
};

const tryStack: Unary<Replace, Stack> = f =>
  FN.flow(
    mapBoth<string, string>(char =>
      FN.pipe(char, f, FN.pipe(char, FN.constant, OP.getOrElse)),
    ),
    stackChars,
  );

const tryBoth: Stack = pair => {
  const makePair: Unary<Pair<string>, OP.Option<Pair<string>>> = pair =>
    FN.pipe(
      pair,
      TU.bimap(...replace),
      AR.sequence(OP.Applicative),
    ) as OP.Option<Pair<string>>;

  const [forward, reverse] = FN.pipe(
    pair,
    toSnd(TU.swap),
    mapBoth(FN.flow(makePair, OP.chain(stackChars))),
  );

  return FN.pipe(forward, OP.fold(FN.constant(reverse), OP.some));
};

const orTryStack: BinaryC<Replace, Pair<string>, Endo<OP.Option<string>>> =
  f => pair =>
    OP.fold(() => FN.pipe(pair, tryStack(f)), OP.some);

const stacks = FN.flow(fork(FN.pipe(replace, mapBoth(orTryStack))), pairFlow);

const isEmpty: PRE.Predicate<string> = char => char === ' ' || char === '';

/** Try to stack a pair of characters */
export const tryStacks: Stack = pair => {
  const [below, above] = pair;

  return isEmpty(below)
    ? OP.some(above)
    : isEmpty(above)
    ? OP.some(below)
    : above === '█' || below === '█'
    ? OP.some('█')
    : above === below
    ? OP.some(above)
    : FN.pipe(
        pair,
        stackChars,
        stacks(pair),
        OP.fold(() => tryBoth(pair), OP.some),
      );
};
