import { BinOpC, membershipTest, Unary } from 'commons';
import {
  predicate as PRE,
  array as AR,
  function as FN,
  nonEmptyArray as NEA,
  option as OP,
} from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { solid, space } from '../glyph.js';
import { named } from '../named.js';
import { tryCachedStack } from './cachedStack.js';
import { Nem, Nem2 } from './types.js';

const { toSnd } = TUs;

/**
 * Convert a non-empty list of runes from box drawing & block elements to a 2D
 * table showing for every pair how they combine into a new rune:
 *
 * 1. 1st row is column header showing the _left_ rune that will be combined
 * 2. The cell in the 1st column of body rows is the row header showing the _right_ rune
 * 3. The rest of body rows are the result of combining the rune at the row header
 *    of the cell and the rune at the column header of the cell
 *
 */
export const cartesian: Unary<Nem<string>, Nem2<string>> = rawRunes => {
  const runes = filterBoring(rawRunes);

  const stackRunes: BinOpC<string> = left => right =>
    FN.pipe(
      [left, right],
      tryCachedStack,
      FN.pipe(named.space, FN.constant, OP.getOrElse),
    );

  const runeRow: Unary<number, Nem<string>> = dataRowIdx => {
    const rune = runes[dataRowIdx - 1];
    if (rune === undefined) throw new Error('Undefined rune in cartesian');
    const [left, makeCell] = FN.pipe(rune, toSnd(stackRunes));
    return [left, ...FN.pipe(runes, NEA.map(makeCell))];
  };

  const colHeaders: Nem<string> = [named.space, ...runes];

  const body: Nem2<string> = FN.pipe(
    NEA.range(1, runes.length),
    NEA.map(runeRow),
  );

  return [colHeaders, ...body];
};

// characters that do not stack with 100% of all registered characters
// once removed, the cartesian of remaining characters has no holes
const missingStacks = membershipTest(
  Array.from(
    '-▔▀▁▂▃▄▅▆▇▕▐▏▎▍▌▋▊▉╭╮╰╯▛▜▙▟▗▖▝▘⎡⎤⎣⎦⎧⎫⎩⎭⎛⎞⎝⎠╱╲▚▞+╳░▒▓',
  ) as readonly string[],
);

/**
 * Same as `cartesian`, but filters out any characters that do stack. The result
 * is a table that is no longer sparse.
 *
 */
export const denseCartesian: Unary<Nem<string>, Nem2<string>> = runes =>
  FN.pipe(
    runes,
    filterBoring,
    AR.filter(PRE.not(missingStacks)),
    orEmpty,
    cartesian,
  );

function filterBoring(runes: Nem<string>) {
  return FN.pipe(
    runes,
    AR.filter(c => c !== space.char && c !== solid.char),
    orEmpty,
  );
}

function orEmpty(row: string[]): Nem<string> {
  return FN.pipe(
    row,
    NEA.fromArray,
    FN.pipe(
      ['N', 'O', 'R', 'U', 'N', 'E', 'S'] as Nem<string>,
      FN.constant,
      OP.getOrElse,
    ),
  );
}
