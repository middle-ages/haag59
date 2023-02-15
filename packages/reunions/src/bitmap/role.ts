import { array as AR, function as FN } from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { typedFromEntries, typedKeys, Unary } from 'commons';
import { Matrix, parse } from '../data.js';
import { cross } from '../data/cross.js';
import { elbow } from '../data/elbow.js';
import { halftone } from '../data/halftone.js';
import { line } from '../data/line.js';
import { tee } from '../data/tee.js';

const { dup, toSnd } = TUs;

const roleToData = {
  hLine: line.horizontal,
  vLine: line.vertical,
  elbow,
  hTee: tee.horizontal,
  vTee: tee.vertical,
  cross,
  halftone,
} as const;

export type BitmapRole = keyof typeof roleToData;

export const bitmapRoles: BitmapRole[] = typedKeys(roleToData) as BitmapRole[];

export const bitmapRole = FN.pipe(
  bitmapRoles,
  AR.map(dup),
  typedFromEntries,
) as {
  [K in BitmapRole]: K;
};

const parseRole: Unary<BitmapRole, [string, Matrix][]> = role =>
  parse(roleToData[role]);

export const parseRoles: FN.Lazy<[BitmapRole, [string, Matrix][]][]> = () =>
  FN.pipe(bitmapRoles, FN.pipe(parseRole, toSnd, AR.map));
