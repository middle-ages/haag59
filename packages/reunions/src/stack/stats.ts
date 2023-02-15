import { tuple3Map, Unary, withKeys } from 'commons';
import {
  array as AR,
  function as FN,
  nonEmptyArray as NEA,
  predicate as PRE,
  string as STR,
} from 'fp-ts';
import { function as FNs, tuple as TUs } from 'fp-ts-std';
import { matrixEq, pxCount } from '../ops.js';
import { allStacks, entryMatrices } from './all.js';
import {
  EntryReport,
  Nem,
  StackCounts,
  StackEntry,
  StackTag,
} from './types.js';

const { fork } = FNs,
  { mapBoth, toSnd } = TUs;

/**
 *
 * We tag each rune combination with 0..n `StackTag`s for classification.
 *
 * A rune combination is a 3-tuple `[L, R, Result]` that encodes the stacking of
 * the runes `L` and `R` into the `Result` rune. Rune combinations are
 * classified by the relations between the members of this tuple.
 *
 * - `superset A ⊆ B` - when the result is equal to one of the stacked pair.
 *    Every pixel in the covered rune exists in the covering rune. Example:
 *    `“┃” ⊕ “╷” ⇒ “┃”`. The left (`L`) rune is identical to the result
 *    rune because every pixel of the `R` rune is in the `L` rune
 *
 * - `disjoint A ∩ B = ∅` - when there are no shared pixels between `L` and `R`.
 *   The result rune pixel count will be the sum of the `L` and `R` counts.
 *   Example: `“▗” ⊕ “▘” = “▚”`. A stack cannot be both _disjoint_ and _superset_
 *
 */
export const isSuperset: PRE.Predicate<StackEntry> = entry => {
  const [fstMat, sndMat, resMat] = entryMatrices(entry);
  return matrixEq.equals(fstMat, resMat) || matrixEq.equals(sndMat, resMat);
};

export const isDisjoint: PRE.Predicate<StackEntry> = entry => {
  const [fstCount, sndCount, resCount] = FN.pipe(
    entry,
    entryMatrices,
    tuple3Map(pxCount),
  );
  return fstCount + sndCount === resCount;
};

export const stackTags: Unary<StackEntry, StackTag[]> = entry => [
  ...(isSuperset(entry) ? (['superset'] as StackTag[]) : []),
  ...(isDisjoint(entry) ? (['disjoint'] as StackTag[]) : []),
];

export const stats: FN.Lazy<StackCounts> = () => {
  const entries = allStacks();

  const [superset, disjoint] = FN.pipe(
    entries,
    fork(
      FN.pipe(
        [isSuperset, isDisjoint],
        mapBoth(x => AR.filter(x)),
      ),
    ),
    mapBoth(AR.size),
  );

  // count unique
  const uniqSize = FN.flow(AR.uniq(STR.Eq), AR.size);

  // rune count
  const rune = FN.pipe(
    entries,
    AR.chain(([[fst, snd], res]) => [fst, snd, res]),
    uniqSize,
  );

  return {
    stack: entries.length,
    superset,
    disjoint,
    rune,
  };
};

export const allStackReports: FN.Lazy<Nem<EntryReport>> = () =>
  FN.pipe(
    allStacks(),
    NEA.map(toSnd(stackTags)),
    NEA.map<[StackEntry, StackTag[]], EntryReport>(withKeys('entry', 'tags')),
  );
