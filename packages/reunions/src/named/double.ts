import { option as OP } from 'fp-ts';
import { Pair, Unary } from 'commons';

const pairs = [
  ...['╬╋', '╪┿', '╫╂'],

  ...['═━', '║┃'],

  ...['╦┳', '╩┻', '╠┣', '╣┫'],

  ...['╔┏', '╚┗', '╗┓', '╝┛'],

  ...['╡┥', '╞┝', '╤┯', '╧┷'],

  ...['╥┰', '╨┸', '╟┠', '╢┨'],

  ...['╓┎', '╙┖', '╖┒', '╜┚'],

  ...['╒┍', '╘┕', '╕┑', '╛┙'],
];

export const doubleToThickMap = new Map<string, string>();

for (const pair of pairs) {
  const [fst, snd] = Array.from(pair) as Pair<string>;
  doubleToThickMap.set(fst, snd);
}

/** Convert from a _double_ rune to its equivalent _thick_ rune */
export const doubleToThick: Unary<string, OP.Option<string>> = double => {
  const res = doubleToThickMap.get(double);
  return OP.fromNullable(res);
};
