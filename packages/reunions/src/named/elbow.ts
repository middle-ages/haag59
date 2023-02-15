import {
  Pair,
  typedEntries,
  typedFromEntries,
  typedValues,
  Unary,
} from 'commons';
import { array as AR, function as FN, tuple as TU } from 'fp-ts';
import { corner, Corners } from 'geometry';
import { line } from './line.js';
import { solid as solidChar, space as spaceChar } from './other.js';
import { ElbowGroup } from './types.js';

const { cornered } = corner;

export const diagonals = { fromTop: '╲', fromBottom: '╱' } as const;

export const roundBySharp = {
  '┌': '╭',
  '┐': '╮',
  '└': '╰',
  '┘': '╯',
} as const;

export const sharpByRound = FN.pipe(
  roundBySharp,
  typedEntries,
  AR.map(TU.swap),
  typedFromEntries,
);

/** The round corners by direction */
export const round = FN.pipe(roundBySharp, typedValues, corner.fromTuple);

/** The sharp corners by direction */
export const sharp = FN.pipe(sharpByRound, typedValues, corner.fromTuple);

const fromPair: Unary<string, Corners> = pair => {
  if (pair.length !== 4) throw new Error(`quad with length≠4: “${pair}”`);
  const [topLeft, topRight] = Array.from(pair) as Pair<string>;
  return { topLeft, topRight, bottomLeft: topRight, bottomRight: topLeft };
};

const singleton: Unary<string, Corners> = corner.cornerSingleton;

const halfSolid = line.halfSolid,
  dup = (s: string) => s + s;

export const elbows: Record<ElbowGroup, Corners> = {
  empty: singleton(''),
  space: singleton(spaceChar),
  solid: singleton(solidChar),

  line: cornered('┌┐└┘'),
  round: cornered('╭╮╰╯'),

  thick: cornered('┏┓┗┛'),
  hThick: cornered('┍┑┕┙'),
  vThick: cornered('┎┒┖┚'),

  near: singleton(spaceChar),
  beveled: fromPair(dup(diagonals.fromBottom + diagonals.fromTop)),

  hMcGugan: cornered(dup(line.bottom) + dup(line.top)),
  vMcGugan: cornered(dup(line.right + line.left)),

  double: cornered('╔╗╚╝'),
  hDouble: cornered('╒╕╘╛'),
  vDouble: cornered('╓╖╙╜'),

  halfSolid: cornered('▞▚▚▞'),
  halfSolidNear: cornered('▗▖▝▘'),
  halfSolidFar: cornered('▛▜▙▟'),

  hHalfSolid: cornered(dup(halfSolid.bottom) + dup(halfSolid.top)),
  vHalfSolid: cornered(dup(halfSolid.right + halfSolid.left)),
} as const;

export const elbowByGroup: Unary<ElbowGroup, Corners> = g => elbows[g];
