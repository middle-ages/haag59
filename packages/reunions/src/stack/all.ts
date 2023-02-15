import { Tuple3, tuple3Map, Unary } from 'commons';
import {
  array as AR,
  function as FN,
  nonEmptyArray as NEA,
  option as OP,
  ord as OD,
  string as STR,
  tuple as TU,
} from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { bitmapRegistry as bitmapRegistry } from '../bitmap.js';
import { Matrix } from '../data.js';
import { named } from '../named.js';
import { computeUniquePairs } from '../relation.js';
import { tryStacks } from './stack.js';
import { GroupedStack, Nem, StackEntry } from './types.js';

const { toSnd, withFst } = TUs;

/** All possible successful glyph stackings as a non-empty list of entries */
export const allStacks: FN.Lazy<Nem<StackEntry>> = () => {
  const res = FN.pipe(
    bitmapRegistry.reg,
    computeUniquePairs,
    TU.fst,
    FN.pipe(tryStacks, toSnd, AR.map),
    AR.map(([pair, res]) =>
      FN.pipe(
        res,
        OP.fold(FN.constant(OP.none), FN.flow(withFst(pair), OP.some)),
      ),
    ),
    AR.compact,
    // stacks with some characters are boring
    AR.filter(([, res]) => res !== named.solid && res !== named.space),
  );

  if (res.length === 0) throw new Error('Got zero stacks');

  return res as Nem<StackEntry>;
};

/** An `Ord` for sorting rune combinations by _left_ */
export const pairOrd: OD.Ord<StackEntry> = OD.contramap<string, StackEntry>(
  FN.flow(TU.fst, ([fst, snd]) => fst + snd),
)(STR.Ord);

/** An `Ord` for sorting rune combinations by the combination _result_ */
export const resultOrd: OD.Ord<StackEntry> = OD.contramap<string, StackEntry>(
  TU.snd,
)(STR.Ord);

export const emptyGrouped = (): GroupedStack => ({}),
  groupByFst: Unary<Nem<StackEntry>, GroupedStack> = NEA.groupBy(
    FN.flow(TU.fst, TU.fst),
  ),
  groupByResult: Unary<Nem<StackEntry>, GroupedStack> = NEA.groupBy(TU.snd);

/** Convert a `StackEntry` into a 3-tuple of their bitmaps */
export const entryMatrices: Unary<StackEntry, Tuple3<Matrix>> = ([
  [fst, snd],
  result,
]) =>
  FN.pipe(
    [fst, snd, result],
    tuple3Map(char => {
      const res = bitmapRegistry.reg.matrixByChar.get(char);
      if (res === undefined)
        throw new Error(`stack with no matrix for “${char}”`);
      return res;
    }),
  );
