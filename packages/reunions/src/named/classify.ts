import {
  string as STR,
  function as FN,
  option as OP,
  predicate as PRE,
} from 'fp-ts';
import { Unary, typedValues, Tuple4, Pair } from 'commons';
import { elbows } from './elbow.js';
import { line } from './line.js';
import { solid as solidChar, space as spaceChar, tee } from './other.js';
import { LineGroup } from './types.js';

const [lineH, lineV, thickH, thickV, nearH, nearV, halfSolidH, halfSolidV] = [
  '─╌┄┈',

  '│╎┆┊',

  '━╍┅┉',

  '┃╏┇┋',

  '▁▔',

  '▕▏',

  '▄▀',

  '▐▌',
] as const;

export const [isLineH, isLineV, isThickH, isThickV]: Tuple4<
  PRE.Predicate<string>
> = [
  STR.includes(lineH),
  STR.includes(lineV),
  STR.includes(thickH),
  STR.includes(thickV),
];

export const [isNearH, isNearV, isHalfSolidH, isHalfSolidV]: Tuple4<
  PRE.Predicate<string>
> = [
  STR.includes(nearH),
  STR.includes(nearV),
  STR.includes(halfSolidH),
  STR.includes(halfSolidV),
];

export const [isLine, isThin, isThick, isHalfSolid] = [
  FN.pipe(isLineH, PRE.or(isLineV)),
  FN.pipe(isNearH, PRE.or(isNearV)),
  FN.pipe(isThickH, PRE.or(isThickV)),
  FN.pipe(isHalfSolidH, PRE.or(isHalfSolidV)),
];

export const hGroup: Unary<string, OP.Option<LineGroup>> = s =>
  s === spaceChar
    ? OP.some('space')
    : s === solidChar
    ? OP.some('solid')
    : s === line.double.horizontal
    ? OP.some('double')
    : isLineH(s)
    ? OP.some('line')
    : isThickH(s)
    ? OP.some('thick')
    : isNearH(s)
    ? OP.some('near')
    : isHalfSolidH(s)
    ? OP.some('halfSolid')
    : OP.none;

export const vGroup: Unary<string, OP.Option<LineGroup>> = s =>
  s === spaceChar
    ? OP.some('space')
    : s === solidChar
    ? OP.some('solid')
    : s === line.double.vertical
    ? OP.some('double')
    : isLineV(s)
    ? OP.some('line')
    : isThickV(s)
    ? OP.some('thick')
    : isNearV(s)
    ? OP.some('near')
    : isHalfSolidV(s)
    ? OP.some('halfSolid')
    : OP.none;

export const [isDoubleLineH, isDoubleLineV]: Pair<PRE.Predicate<string>> = [
  s => s === line.double.horizontal,
  s => s === line.double.vertical,
];

export const isDoubleLine: PRE.Predicate<string> = s =>
  isDoubleLineH(s) || isDoubleLineV(s);

const [doubleElbows, hDoubleElbows, vDoubleElbows, doubleTees] = [
  new Set<string>(),
  new Set<string>(),
  new Set<string>(),
  new Set<string>(),
];

typedValues(elbows.double).forEach(s => doubleElbows.add(s));
typedValues(elbows.hDouble).forEach(s => hDoubleElbows.add(s));
typedValues(elbows.vDouble).forEach(s => vDoubleElbows.add(s));
typedValues(tee.double).forEach(s => doubleTees.add(s));

export const [
  isDoubleElbow,
  isHDoubleElbow,
  isVDoubleElbow,
  isDoubleTee,
]: Tuple4<PRE.Predicate<string>> = [
  doubleElbows.has,
  hDoubleElbows.has,
  vDoubleElbows.has,
  doubleTees.has,
];
