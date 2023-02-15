import {
  array as AR,
  function as FN,
  number as NU,
  readonlyArray as RA,
  string as STR,
  predicate as PRE,
} from 'fp-ts';
import { function as FNs, array as ARs, string as STRs } from 'fp-ts-std';
import { stringWidth } from 'tty-strings';
import { Binary, BinaryC, Endo, Unary } from './function.js';
import { floorMod } from './number.js';

const { maximum } = ARs;
const { curry2 } = FNs;
const { lines: splitLines } = STRs;

export const split =
    (re: RegExp): Unary<string, string[]> =>
    s =>
      s.split(re),
  stringEq: Unary<string, PRE.Predicate<string>> = curry2(STR.Eq.equals),
  ucFirst: Endo<string> = s => s.charAt(0).toUpperCase() + s.slice(1),
  lines: Unary<string, string[]> = s =>
    splitLines(s) as readonly string[] as string[];

export const around: Binary<string, string, Endo<string>> =
  (left, right) => s =>
    `${left}${s}${right}`;

export const nChars: BinaryC<string, number, string> = c => n =>
    RA.replicate(n, c).join(''),
  nSpaces: Unary<number, string> = nChars(' ');

export const widestLine: Unary<string[], number> = lines =>
  maximum(NU.Ord)([0, ...FN.pipe(lines, AR.map(stringWidth))]);

export const measureText: Unary<
  string[],
  Record<'width' | 'height', number>
> = text => ({
  width: widestLine(text),
  height: text.length,
});

export const pad =
  (total: number, align: 'left' | 'center' | 'right', padding?: string) =>
  (s: string) => {
    const Δ = total - stringWidth(s),
      nPad = nChars(padding ?? ' ');

    if (align === 'left') return s + nPad(Δ);
    else if (align === 'right') return nPad(Δ) + s;

    const [half, rem] = floorMod([Δ, 2]);
    return nPad(half + rem) + s + nPad(half);
  };
