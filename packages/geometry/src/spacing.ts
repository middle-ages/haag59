import {
  Endo,
  EQ,
  FN,
  MO,
  ModLens,
  modLens,
  NU,
  Pair,
  PRE,
  SH,
  Unary,
} from 'commons';
import { lens as LE } from 'monocle-ts';
import { Directed, HDir, VDir } from './dir.js';
import { tupledSize as buildSize } from './size.js';

/** A `Directed<number>` - record of distance per direction */
export type Spacing = Directed<number>;

/** A record of horizontal direction to distance */
export type HSpacing = Record<HDir, number>;

/** A record of vertical direction to distance */
export type VSpacing = Record<VDir, number>;

//#region build

export const spacing = (top = 0, right = 0, bottom = 0, left = 0) => ({
  top,
  right,
  bottom,
  left,
});
export const emptySpacing = spacing();
export const of: Unary<Partial<Spacing>, Spacing> = args => ({
  ...emptySpacing,
  ...args,
});

/** Build from tuple in order `“top”, “right”, “bottom”, and “left” ` */
export const tupledSpacing = FN.tupled(spacing);

/** Create a spacing from a pair of horizontal and vertical values */
export const rectSpacing: Unary<Pair<number>, Spacing> = ([h, v]) =>
  spacing(v, h, v, h);

/** Create a spacing from a single value */
export const squareSpacing: Unary<number, Spacing> = n => rectSpacing([n, n]);

/** Create top spacing */
export const spacingFromTop: Unary<number, Spacing> = n => spacing(n);

/** Create right spacing */
export const spacingFromRight: Unary<number, Spacing> = n => spacing(0, n);

/** Create bottom spacing */
export const spacingFromBottom: Unary<number, Spacing> = n => spacing(0, 0, n);

/** Create left spacing */
export const spacingFromLeft: Unary<number, Spacing> = n => spacing(0, 0, 0, n);

/** Create a horizontal spacing from a single value */
export const hSpacing: Unary<number, Spacing> = h => rectSpacing([h, 0]);

/** Create a vertical spacing from a single value */
export const vSpacing: Unary<number, Spacing> = v => rectSpacing([0, v]);

export const zeroWidthSpacing: Endo<Spacing> = ({ left, right }) => ({
  top: 0,
  right,
  bottom: 0,
  left,
});

export const zeroHeightSpacing: Endo<Spacing> = ({ top, bottom }) => ({
  top,
  right: 0,
  bottom,
  left: 0,
});

//#endregion

//#region instances

const [nm, ne] = [NU.MonoidSum, NU.Eq];

/** Sum monoid for `Spacing` */
export const spacingMonoid: MO.Monoid<Spacing> = MO.struct({
  top: nm,
  right: nm,
  bottom: nm,
  left: nm,
});

/** `Spacing` `Eq` instance */
export const spacingEq: EQ.Eq<Spacing> = EQ.struct({
  top: ne,
  right: ne,
  bottom: ne,
  left: ne,
});

/** `Spacing` `Show` instance */
export const showSpacing: SH.Show<Spacing> = {
  show: ({ top, right, bottom, left }) =>
    `▲${top} ▶${right} ▼${bottom} ◀${left}`,
};

//#endregion

//#region lens

const lens = LE.id<Spacing>();

/** Top spacing lens */
export const spacingTop: ModLens<Spacing, number> = FN.pipe(
  lens,
  LE.prop('top'),
  modLens,
);

/** Right spacing lens */
export const spacingRight: ModLens<Spacing, number> = FN.pipe(
  lens,
  LE.prop('right'),
  modLens,
);

/** Bottom spacing lens */
export const spacingBottom: ModLens<Spacing, number> = FN.pipe(
  lens,
  LE.prop('bottom'),
  modLens,
);

/** Left spacing lens */
export const spacingLeft: ModLens<Spacing, number> = FN.pipe(
  lens,
  LE.prop('left'),
  modLens,
);

//#endregion

//#region query

/** The width taken up by the spacing */
export const spacingWidth: Unary<Spacing, number> = sp =>
  FN.pipe(sp, spacingLeft.get, FN.pipe(sp, spacingRight.get, NU.add));

/** The height taken up by the spacing */
export const spacingHeight: Unary<Spacing, number> = sp =>
  FN.pipe(sp, spacingTop.get, FN.pipe(sp, spacingBottom.get, NU.add));

/** Get the sized taken by the spacing */
export const spacingSize = FN.flow(
  FN.fork([spacingWidth, spacingHeight]),
  buildSize,
);

/** True if spacing has width component */
export const spacingHasWidth: PRE.Predicate<Spacing> = sp =>
  spacingWidth(sp) > 0;

/** True if spacing has height component */
export const spacingHasHeight: PRE.Predicate<Spacing> = sp =>
  spacingHeight(sp) > 0;

//#endregion
