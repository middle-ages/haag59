import { Pair, split, Unary } from 'commons';
import { array as AR, function as FN, predicate as PRE } from 'fp-ts';
import { charCriteria, FixedCriteria } from './types.js';

export const defineChains = (lines: string[]): string[][] =>
  FN.pipe(
    lines,
    FN.pipe(/,/, split, AR.chain),
    AR.map(s => Array.from(s)),
  );

export const definePairs = (lines: string[]) =>
  defineChains(lines) as Pair<string>[];

export const isOneOf: Unary<string[], PRE.Predicate<Pair<string>>> =
  pairs =>
  ([fst, snd]) =>
    pairs.includes(fst + snd);

const codePoint: Unary<string, number> = c => c.codePointAt(0) ?? 0;

export const nextCodePointEq = charCriteria(
  ([fst, snd]) => codePoint(fst) + 1 === codePoint(snd),
);

export const fixedCriteria: Unary<Pair<string[]>, FixedCriteria> = ([
  pairs,
  chains,
]) => ({
  pairs: definePairs(pairs),
  chains: defineChains(chains),
});
