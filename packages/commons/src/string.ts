import { AR, FN, NU, RA, STR, PRE, Unary, Endo } from './fp-ts.js';
import { stringWidth } from 'tty-strings';
import { Binary, BinaryC } from './function.js';
import { floorMod } from './number.js';

export const split =
    (re: RegExp): Unary<string, string[]> =>
    s =>
      s.split(re),
  stringEq: Unary<string, PRE.Predicate<string>> = FN.curry2(STR.Eq.equals),
  ucFirst: Endo<string> = s => s.charAt(0).toUpperCase() + s.slice(1),
  lines: Unary<string, string[]> = s =>
    STR.lines(s) as readonly string[] as string[];

export const around: Binary<string, string, Endo<string>> =
  (left, right) => s =>
    `${left}${s}${right}`;

export const nChars: BinaryC<string, number, string> = c => n =>
    RA.replicate(n, c).join(''),
  nSpaces: Unary<number, string> = nChars(' ');

export const widestLine: Unary<string[], number> = lines =>
  AR.maximum(NU.Ord)([0, ...FN.pipe(lines, AR.map(stringWidth))]);

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
