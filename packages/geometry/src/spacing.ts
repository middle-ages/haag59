import { Endo, ModLens, modLens, Pair, Tuple4, Unary } from 'commons';
import {
  eq as EQ,
  function as FN,
  monoid as MO,
  number as NU,
  predicate as PRE,
  show as SH,
} from 'fp-ts';
import { function as FNs, number as NUs } from 'fp-ts-std';
import { lens as LE } from 'monocle-ts';
import { Directed, HDir, VDir } from './dir.js';
import { tupled as buildSize } from './size.js';

const { fork } = FNs,
  { add } = NUs;

/** A `Directed<number>` - record of distance per direction */
export type Spacing = Directed<number>;

/** A record of horizontal direction to distance */
export type HSpacing = Record<HDir, number>;

/** A record of vertical direction to distance */
export type VSpacing = Record<VDir, number>;

//#region build

export const build = (top = 0, right = 0, bottom = 0, left = 0) => ({
  top,
  right,
  bottom,
  left,
});
export const empty = build();
export const of: Unary<Partial<Spacing>, Spacing> = args => ({
  ...empty,
  ...args,
});

/** Build from tuple in order `“top”, “right”, “bottom”, and “left” ` */
export const tupled = FN.tupled(build);

/** Create a spacing from a pair of horizontal and vertical values */
export const rect: Unary<Pair<number>, Spacing> = ([h, v]) => build(v, h, v, h);

/** Create a spacing from a single value */
export const square: Unary<number, Spacing> = n => rect([n, n]);

export const [fromTop, fromRight, fromLeft, fromBottom]: Tuple4<
  Unary<number, Spacing>
> = [
  n => build(n),
  n => build(0, n),
  n => build(0, 0, n),
  n => build(0, 0, 0, n),
];

export const [hSpacing, vSpacing]: Pair<Unary<number, Spacing>> = [
  h => rect([h, 0]),
  v => rect([0, v]),
];

export const [zeroWidth, zeroHeight]: Pair<Endo<Spacing>> = [
  ({ left, right }) => ({ top: 0, right, bottom: 0, left }),
  ({ top, bottom }) => ({ top, right: 0, bottom, left: 0 }),
];
//#endregion

//#region instances
const [nm, ne] = [NU.MonoidSum, NU.Eq];

export const monoid: MO.Monoid<Spacing> = MO.struct({
  top: nm,
  right: nm,
  bottom: nm,
  left: nm,
});

export const eq: EQ.Eq<Spacing> = EQ.struct({
  top: ne,
  right: ne,
  bottom: ne,
  left: ne,
});

export const show: SH.Show<Spacing> = {
  show: ({ top, right, bottom, left }) =>
    `▲${top} ▶${right} ▼${bottom} ◀${left}`,
};
//#endregion

//#region lens
const lens = LE.id<Spacing>();

export const [top, right, bottom, left]: Tuple4<ModLens<Spacing, number>> = [
  FN.pipe(lens, LE.prop('top'), modLens),
  FN.pipe(lens, LE.prop('right'), modLens),
  FN.pipe(lens, LE.prop('bottom'), modLens),
  FN.pipe(lens, LE.prop('left'), modLens),
];
//#endregion

//#region query
export const [width, height]: Pair<Unary<Spacing, number>> = [
    sp => FN.pipe(sp, left.get, FN.pipe(sp, right.get, add)),
    sp => FN.pipe(sp, top.get, FN.pipe(sp, bottom.get, add)),
  ],
  size = FN.flow(fork([width, height]), buildSize);

export const [hasWidth, hasHeight]: Pair<PRE.Predicate<Spacing>> = [
  sp => width(sp) > 0,
  sp => height(sp) > 0,
];
//#endregion
