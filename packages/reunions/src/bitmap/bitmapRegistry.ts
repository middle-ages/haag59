import {
  array as AR,
  nonEmptyArray as NEA,
  function as FN,
  option as OP,
  predicate as PRE,
} from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { typedFromEntries, Unary, Pair } from 'commons';
import * as DA from '../data.js';
import * as RO from './role.js';

const { mapBoth } = TUs;

type MatrixByChar = Map<string, DA.Matrix>;
type CharByMatrix = Map<string, string>;

type RolesByChar = Map<string, RO.BitmapRole[]>;
type CharsByRole = Map<RO.BitmapRole, string[]>;

export interface BitmapRegistry {
  roles: RO.BitmapRole[];
  chars: NEA.NonEmptyArray<string>;

  matrixByChar: MatrixByChar;
  charByMatrix: CharByMatrix;

  rolesByChar: RolesByChar;
  charsByRole: CharsByRole;
}

export const makeBitmapRegistry: FN.Lazy<BitmapRegistry> = () => {
  const matrixByChar = new Map<string, DA.Matrix>();
  const charByMatrix = new Map<string, string>();

  const rolesByChar: RolesByChar = new Map<string, RO.BitmapRole[]>();
  const charsByRole: CharsByRole = new Map<RO.BitmapRole, string[]>();

  const parsed = RO.parseRoles();
  for (const [role, matrices] of parsed) {
    for (const [char, matrix] of matrices) {
      const key = DA.toBin(matrix);
      matrixByChar.set(char, matrix);
      charByMatrix.set(key, char);

      rolesByChar.set(char, [...(rolesByChar.get(char) ?? []), role]);
      charsByRole.set(role, [...(charsByRole.get(role) ?? []), char]);
    }
  }

  const chars: string[] = Array.from(matrixByChar.keys());
  if (chars.length <= 0)
    throw new Error('Cannot build a registry with no runes');

  return {
    chars: chars as NEA.NonEmptyArray<string>,
    roles: RO.bitmapRoles,

    matrixByChar,
    charByMatrix,

    rolesByChar,
    charsByRole,
  };
};
const reg: BitmapRegistry = makeBitmapRegistry();

const hasChar: PRE.Predicate<string> = c => reg.matrixByChar.has(c),
  hasCharPair: PRE.Predicate<Pair<string>> = ([fst, snd]) =>
    reg.matrixByChar.has(fst) && reg.matrixByChar.has(snd),
  hasMatrix: PRE.Predicate<DA.Matrix> = m => reg.charByMatrix.has(DA.toBin(m)),
  matrixByChar: Unary<string, DA.Matrix> = c =>
    reg.matrixByChar.get(c) ?? DA.emptyMatrix,
  charByMatrix: Unary<DA.Matrix, OP.Option<string>> = ma =>
    FN.pipe(ma, DA.toBin, k => reg.charByMatrix.get(k), OP.fromNullable),
  rolesByChar: Unary<string, RO.BitmapRole[]> = c =>
    reg.rolesByChar.get(c) ?? [],
  charsByRole: Unary<RO.BitmapRole, string[]> = r =>
    reg.charsByRole.get(r) ?? [],
  { chars, roles } = reg;

const collectPairs: Unary<Pair<string>[], string[]> = pairs => {
  const charSet = new Set<string>();
  for (const [fst, snd] of pairs) {
    charSet.add(fst);
    charSet.add(snd);
  }
  return Array.from(charSet.keys());
};

const pairMatrixToChar: Unary<Pair<DA.Matrix>, Pair<string>> = mapBoth(
  FN.flow(charByMatrix, FN.pipe(' ', FN.constant, OP.getOrElse)),
);

const pairCharToMatrix: Unary<Pair<string>, Pair<DA.Matrix>> = mapBoth(
  matrixByChar,
);

const roleToChar: FN.Lazy<
  Record<RO.BitmapRole, NEA.NonEmptyArray<string>>
> = () => {
  const chars: Unary<RO.BitmapRole, NEA.NonEmptyArray<string>> = role => {
    const res = charsByRole(role);
    if (res.length === 0) throw new Error(`empty bitmap role “${role}”`);
    return res as NEA.NonEmptyArray<string>;
  };
  const entries = FN.pipe(
    RO.bitmapRoles,
    AR.map(
      role => [role, chars(role)] as [RO.BitmapRole, NEA.NonEmptyArray<string>],
    ),
  );

  return typedFromEntries(entries);
};

export const bitmapRegistry = {
  chars,
  roles,
  reg,

  hasChar,
  hasCharPair,
  hasMatrix,

  matrixByChar,
  charByMatrix,

  rolesByChar,
  charsByRole,
  roleToChar,

  collectPairs,
  pairMatrixToChar,
  pairCharToMatrix,

  solid: '█',
} as const;
