import {
  AR,
  Binary,
  BinOp,
  BinOpC,
  BinOpT,
  Endo,
  EQ,
  flattenPair,
  FN,
  LensResult,
  ModLens,
  modLens,
  NU,
  Pair,
  PRE,
  SH,
  TU,
  Tuple4,
  Unary,
  uncurry2T,
  MO,
} from 'commons';
import { lens as LE } from 'monocle-ts';
import * as PO from './pos.js';
import { Pos } from './pos.js';
import * as SZ from './size.js';
import { Size } from './size.js';

export interface Rect {
  pos: Pos;
  size: Size;
  zOrder: number;
}

//#region build

export const rect: Binary<Pos, Size, Rect> = (pos, size) => ({
  pos,
  size,
  zOrder: 0,
});

export const tupled: Unary<[Pos, Size], Rect> = FN.tupled(rect);

export const fromPos: Unary<Pos, Rect> = p => rect(p, SZ.empty);

export const atOrigin: Unary<Size, Rect> = sz => rect(PO.originPos, sz);

export const empty = rect(PO.originPos, SZ.empty);

export const fromQuad: Unary<Pair<Pair<number>>, Rect> = FN.flow(
  TU.bimap(SZ.tupled, PO.tupledPos),
  tupled,
);

export const fromTuple: Unary<Tuple4<number>, Rect> = ([a, b, c, d]) =>
  fromQuad([
    [a, b],
    [c, d],
  ]);

/* Build from the given top left and bottom right corner position */
export const fromCorners: Unary<Pair<Pos>, Rect> = ([fst, snd]) =>
  rect(fst, PO.posRectSize([fst, snd]));

//#endregion

//#region query

/** Chop width by half */
export const halfWidth: Unary<Rect, number> = ({ size: { width } }) =>
  Math.floor((width - 1) / 2);

/** Chop height by half */
export const halfHeight: Unary<Rect, number> = ({ size: { height } }) =>
  Math.floor((height - 1) / 2);

/** True if rectangle is cornered on origin and has no size or zOrder */
export const isEmpty: PRE.Predicate<Rect> = ({ pos, size, zOrder }) =>
  PO.isOriginPos(pos) && SZ.isEmpty(size) && zOrder === 0;

export const minTopLeft: Unary<Rect[], Pos> = rs =>
  FN.pipe(rs, AR.map(pos.get), rs => PO.min(rs));

export const maxBottomRight = (rs: Rect[]): Pos =>
  FN.pipe(rs, AR.map(bottomRight.get), rs => PO.max(rs));

//#endregion

//#region direct lenses

const id = LE.id<Rect>();

/** Rectangle size lens */
export const size = FN.pipe(id, LE.prop('size'), modLens);

/** Rectangle position lens */
export const pos = FN.pipe(id, LE.prop('pos'), modLens);

/** Rectangle zOrder lens */
export const zOrder = FN.pipe(id, LE.prop('zOrder'), modLens);

/** Rectangle distance from x-axis lens */
export const top = FN.pipe(pos, LE.compose(PO.posTop), modLens);

/** Rectangle distance from y-axis lens */
export const left = FN.pipe(pos, LE.compose(PO.posLeft), modLens);

/** Rectangle width lens */
export const width = FN.pipe(size, LE.compose(SZ.width), modLens);

/** Rectangle height lens */
export const height = FN.pipe(size, LE.compose(SZ.height), modLens);

const directLenses = { size, pos, zOrder, top, left, width, height } as const;

//#endregion

//#region computed lenses

/** Rectangle right edge lense */
export const right: ModLens<Rect, number> = modLens({
  get: r => left.get(r) + width.get(r) - 1,
  set: n => r => FN.pipe(r, left.set(n - width.get(r) + 1)),
});

/** Rectangle bottom edge lense */
export const bottom: ModLens<Rect, number> = modLens({
  get: r => top.get(r) + height.get(r) - 1,
  set: n => r => FN.pipe(r, top.set(n - height.get(r) + 1)),
});

/** Rectangle bottom right position lense */
export const bottomRight: ModLens<Rect, Pos> = modLens({
  get: r => PO.pos(bottom.get(r), right.get(r)),
  set: p => r => FN.pipe(r, bottom.set(p.top), right.set(p.left)),
});

/** Rectangle top right position lense */
export const topRight: ModLens<Rect, Pos> = modLens({
  get: r => PO.pos(top.get(r), right.get(r)),
  set: p => r => FN.pipe(r, top.set(p.top), right.set(p.left)),
});

/** Rectangle bottom left position lense */
export const bottomLeft: ModLens<Rect, Pos> = modLens({
  get: r => PO.pos(bottom.get(r), left.get(r)),
  set: p => r => FN.pipe(r, bottom.set(p.top), left.set(p.left)),
});

/** Rectangle horizontal rectangle center value lense */
export const center: ModLens<Rect, number> = modLens({
  get: r => left.get(r) + halfWidth(r),
  set: n => r => FN.pipe(r, left.set(n - halfWidth(r))),
});

/** Rectangle vertical rectangle middle value lense */
export const middle: ModLens<Rect, number> = modLens({
  get: r => top.get(r) + halfHeight(r),
  set: n => r => FN.pipe(r, top.set(n - halfHeight(r))),
});

/** Rectangle middle-center position lense */
export const middleCenter: ModLens<Rect, Pos> = modLens({
  get: r => PO.pos(middle.get(r), center.get(r)),
  set: ({ top: givenTop, left: givenLeft }) =>
    FN.flow(middle.set(givenTop), center.set(givenLeft)),
});

const computedLenses = {
  right,
  bottom,
  bottomRight,
  topRight,
  bottomLeft,
  center,
  middle,
  middleCenter,
} as const;

//#endregion

//#region lenses

export const lenses = { ...directLenses, ...computedLenses } as const;

export type RectLens = typeof lenses;
export type RectLensKey = keyof RectLens;
export type RectLensResult<K extends RectLensKey> = LensResult<RectLens[K]>;

export const lensAt = <K extends RectLensKey>(k: K) =>
  lenses[k] as RectLens[K] & ModLens<Rect, RectLensResult<K>>;

//#endregion

//#region modify

/** Tupled version of `add` */
export const addT: BinOpT<Rect> = ([fst, snd]) =>
  isEmpty(fst)
    ? snd
    : isEmpty(snd)
    ? fst
    : fromCorners([minTopLeft([fst, snd]), maxBottomRight([fst, snd])]);

/** Get the bounding rectangle when two rectangles are stacked */
export const add: BinOp<Rect> = (fst, snd) => addT([fst, snd]);

/** Curried version of `add` */
export const addC: BinOpC<Rect> = FN.curry2(add);

type SetNum = Unary<number, Endo<Rect>>;

/** Add a position to the rectangle position */
export const addPos: Unary<Pos, Endo<Rect>> = FN.flow(PO.addPosC, pos.mod);

/** Get bounding box rect when added to another rectangle */
export const addRect: Unary<Rect, Endo<Rect>> = FN.curry2(add);

/** Subtract a position from the rectangle position */
export const subPos: Unary<Pos, Endo<Rect>> = FN.flow(PO.subPosC, pos.mod);

/** Add a size from the rectangle size */
export const addSize: Unary<Size, Endo<Rect>> = FN.flow(SZ.addC, size.mod);

/** Subtract a size from the rectangle size */
export const subSize: Unary<Size, Endo<Rect>> = FN.flow(SZ.subC, size.mod);

/** Add distance to the x-axis */
export const addTop: SetNum = FN.flow(PO.addPosTop, pos.mod);

/** Subtract distance from the x-axis */
export const subTop: SetNum = FN.flow(PO.subPosTop, pos.mod);

/** Add distance to the y-axis */
export const addLeft: SetNum = FN.flow(PO.addPosLeft, pos.mod);

/** Subtract distance from the y-axis */
export const subLeft: SetNum = FN.flow(PO.subPosLeft, pos.mod);

/** Add width to the rectangle size */
export const addWidth: SetNum = FN.flow(SZ.addWidth, size.mod);

/** Subtract width from the rectangle size */
export const subWidth: SetNum = FN.flow(SZ.subWidth, size.mod);

/** Add height to the rectangle size */
export const addHeight: SetNum = FN.flow(SZ.addHeight, size.mod);

/** Subtract height from the rectangle size */
export const subHeight: SetNum = FN.flow(SZ.subHeight, size.mod);

/** Increment width and height by one */
export const incSize: Endo<Rect> = FN.pipe(SZ.unitSquare, SZ.addC, size.mod);

/** width-- && height-- */
export const decSize: Endo<Rect> = FN.pipe(SZ.unitSquare, SZ.subC, size.mod);

/** Scale the rectangle size horizontally by given factor */
export const scaleH: SetNum = FN.flow(SZ.scaleH, size.mod);

/** Scale the rectangle size vertically by given factor */
export const scaleV: SetNum = FN.flow(SZ.scaleV, size.mod);

/** Scale the rectangle size by given factor */
export const scale: SetNum = FN.flow(SZ.scale, size.mod);

export const shifts = {
  addRect,
  addPos,
  subPos,
  addSize,
  subSize,
  addTop,
  subTop,
  addLeft,
  subLeft,
  addWidth,
  subWidth,
  addHeight,
  subHeight,
  scaleH,
  scaleV,
  scale,
} as const;

export type RectShift = typeof shifts;
export type RectShiftKey = keyof RectShift;
export type RectShiftArg<K extends RectShiftKey> = Parameters<RectShift[K]>[0];

export const shiftAt = <K extends RectShiftKey>(k: K) =>
  shifts[k] as RectShift[K] & Unary<RectShiftArg<K>, Endo<Rect>>;

//#endregion

//#region zOrder

/** zOrder++ */
export const incZOrder = zOrder.mod(FN.increment);

/** zOrder-- */
export const decZOrder = zOrder.mod(NU.decrement);

/** Reset zOrder to default 0 value */
export const unsetZOrder = zOrder.set(0);

//#endregion

//#region instances

/** Predicate for rectangle position equality */
export const eqPos: EQ.Eq<Rect> = FN.pipe(PO.eqPos, EQ.contramap(pos.get));

/** Predicate for rectangle size equality */
export const eqSize: EQ.Eq<Rect> = FN.pipe(SZ.eq, EQ.contramap(size.get));

/** `Rect` equality predicate */
export const equals: Unary<Rect, PRE.Predicate<Rect>> = fst => snd =>
  eqPos.equals(fst, snd) && eqSize.equals(fst, snd);

/** `Rect` `Eq` instance */
export const eq: EQ.Eq<Rect> = FN.pipe(equals, uncurry2T, EQ.fromEquals);

/** `Rect` `Show` instance */
export const show: SH.Show<Rect> = {
  show: ({ pos, size }) => PO.showPos.show(pos) + ' ' + SZ.show.show(size),
};
/** Monoid for the bounding rectangle operation */
export const monoid: MO.Monoid<Rect> = { concat: add, empty };

//#endregion

//#region query

/** Covert rect without zOrder to pair of pairs of size and position */
export const toQuad = <R extends Rect>({
  pos: { top, left },
  size: { width, height },
}: R): Pair<Pair<number>> => [
  [top, left],
  [width, height],
];

/** Covert rect without zOrder to 4-tuple of size and position */
export const toTuple = FN.flow(toQuad, flattenPair);

/** Get top left and bottom right positions of the rectangle */
export const getCorners: Unary<Rect, Pair<Pos>> = FN.fork([
  pos.get,
  bottomRight.get,
]);

/** Rectangle width * height */
export const area = FN.flow(size.get, SZ.area);

//#endregion

//#region operations

/**
 * Normalize positions of a non-empty list of rectangles
 *
 * Translates all rectangles to the positive quadrant
 */
export const translateToPositive = (rs: Rect[]): Rect[] =>
    FN.pipe(
      rs,
      AR.map(pos.get),
      PO.translateToPositive,
      AR.zip(rs),
      AR.map(([p, r]) => FN.pipe(r, pos.set(p))),
    ),
  stack: Unary<Rect[], Rect> = MO.concatAll(monoid);

//#endregion
