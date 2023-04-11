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

export const tupledRect: Unary<[Pos, Size], Rect> = FN.tupled(rect);

export const rectFromPos: Unary<Pos, Rect> = p => rect(p, SZ.emptySize);

export const rectAtOrigin: Unary<Size, Rect> = sz => rect(PO.originPos, sz);

export const emptyRect = rect(PO.originPos, SZ.emptySize);

export const rectFromQuad: Unary<Pair<Pair<number>>, Rect> = FN.flow(
  TU.bimap(SZ.tupledSize, PO.tupledPos),
  tupledRect,
);

export const rectFromTuple: Unary<Tuple4<number>, Rect> = ([a, b, c, d]) =>
  rectFromQuad([
    [a, b],
    [c, d],
  ]);

/* Build from the given top left and bottom right corner position */
export const rectFromCorners: Unary<Pair<Pos>, Rect> = ([fst, snd]) =>
  rect(fst, PO.posRectSize([fst, snd]));

//#endregion

//#region query

/** Chop width by half */
export const rectHalfWidth: Unary<Rect, number> = ({ size: { width } }) =>
  Math.floor((width - 1) / 2);

/** Chop height by half */
export const rectHalfHeight: Unary<Rect, number> = ({ size: { height } }) =>
  Math.floor((height - 1) / 2);

/** True if rectangle is cornered on origin and has no size or zOrder */
export const rectIsEmpty: PRE.Predicate<Rect> = ({ pos, size, zOrder }) =>
  PO.isOriginPos(pos) && SZ.isEmpty(size) && zOrder === 0;

export const rectMinTopLeft: Unary<Rect[], Pos> = rs =>
  FN.pipe(rs, AR.map(rectPos.get), rs => PO.min(rs));

export const rectMaxBottomRight = (rs: Rect[]): Pos =>
  FN.pipe(rs, AR.map(rectBottomRight.get), rs => PO.max(rs));

//#endregion

//#region direct lenses

const id = LE.id<Rect>();

/** Rectangle size lens */
export const rectSize = FN.pipe(id, LE.prop('size'), modLens);

/** Rectangle position lens */
export const rectPos = FN.pipe(id, LE.prop('pos'), modLens);

/** Rectangle zOrder lens */
export const rectZorder = FN.pipe(id, LE.prop('zOrder'), modLens);

/** Rectangle distance from x-axis lens */
export const rectTop = FN.pipe(rectPos, LE.compose(PO.posTop), modLens);

/** Rectangle distance from y-axis lens */
export const rectLeft = FN.pipe(rectPos, LE.compose(PO.posLeft), modLens);

/** Rectangle width lens */
export const rectWidth = FN.pipe(rectSize, LE.compose(SZ.width), modLens);

/** Rectangle height lens */
export const rectHeight = FN.pipe(rectSize, LE.compose(SZ.height), modLens);

const directLenses = {
  size: rectSize,
  pos: rectPos,
  zOrder: rectZorder,
  top: rectTop,
  left: rectLeft,
  width: rectWidth,
  height: rectHeight,
} as const;

//#endregion

//#region computed lenses

/** Rectangle right edge lense */
export const rectRight: ModLens<Rect, number> = modLens({
  get: r => rectLeft.get(r) + rectWidth.get(r) - 1,
  set: n => r => FN.pipe(r, rectLeft.set(n - rectWidth.get(r) + 1)),
});

/** Rectangle bottom edge lense */
export const rectBottom: ModLens<Rect, number> = modLens({
  get: r => rectTop.get(r) + rectHeight.get(r) - 1,
  set: n => r => FN.pipe(r, rectTop.set(n - rectHeight.get(r) + 1)),
});

/** Rectangle bottom right position lense */
export const rectBottomRight: ModLens<Rect, Pos> = modLens({
  get: r => PO.pos(rectBottom.get(r), rectRight.get(r)),
  set: p => r => FN.pipe(r, rectBottom.set(p.top), rectRight.set(p.left)),
});

/** Rectangle top right position lense */
export const rectTopRight: ModLens<Rect, Pos> = modLens({
  get: r => PO.pos(rectTop.get(r), rectRight.get(r)),
  set: p => r => FN.pipe(r, rectTop.set(p.top), rectRight.set(p.left)),
});

/** Rectangle bottom left position lense */
export const rectBottomLeft: ModLens<Rect, Pos> = modLens({
  get: r => PO.pos(rectBottom.get(r), rectLeft.get(r)),
  set: p => r => FN.pipe(r, rectBottom.set(p.top), rectLeft.set(p.left)),
});

/** Rectangle horizontal rectangle center value lense */
export const rectCenter: ModLens<Rect, number> = modLens({
  get: r => rectLeft.get(r) + rectHalfWidth(r),
  set: n => r => FN.pipe(r, rectLeft.set(n - rectHalfWidth(r))),
});

/** Rectangle vertical rectangle middle value lense */
export const rectMiddle: ModLens<Rect, number> = modLens({
  get: r => rectTop.get(r) + rectHalfHeight(r),
  set: n => r => FN.pipe(r, rectTop.set(n - rectHalfHeight(r))),
});

/** Rectangle middle-center position lense */
export const rectMiddleCenter: ModLens<Rect, Pos> = modLens({
  get: r => PO.pos(rectMiddle.get(r), rectCenter.get(r)),
  set: ({ top: givenTop, left: givenLeft }) =>
    FN.flow(rectMiddle.set(givenTop), rectCenter.set(givenLeft)),
});

const computedLenses = {
  right: rectRight,
  bottom: rectBottom,
  bottomRight: rectBottomRight,
  topRight: rectTopRight,
  bottomLeft: rectBottomLeft,
  center: rectCenter,
  middle: rectMiddle,
  middleCenter: rectMiddleCenter,
} as const;

//#endregion

//#region lenses

export const lenses = { ...directLenses, ...computedLenses } as const;

export type RectLens = typeof lenses;
export type RectLensKey = keyof RectLens;
export type RectLensResult<K extends RectLensKey> = LensResult<RectLens[K]>;

export const rectLensAt = <K extends RectLensKey>(k: K) =>
  lenses[k] as RectLens[K] & ModLens<Rect, RectLensResult<K>>;

//#endregion

//#region modify

/** Tupled version of `add` */
export const addRectT: BinOpT<Rect> = ([fst, snd]) =>
  rectIsEmpty(fst)
    ? snd
    : rectIsEmpty(snd)
    ? fst
    : rectFromCorners([
        rectMinTopLeft([fst, snd]),
        rectMaxBottomRight([fst, snd]),
      ]);

/** Get the bounding rectangle when two rectangles are stacked */
export const addRect: BinOp<Rect> = (fst, snd) => addRectT([fst, snd]);

/** Curried version of `add` */
export const addRectC: BinOpC<Rect> = FN.curry2(addRect);

type SetNum = Unary<number, Endo<Rect>>;

/** Add a position to the rectangle position */
export const addRectPos: Unary<Pos, Endo<Rect>> = FN.flow(
  PO.addPosC,
  rectPos.mod,
);

/** Subtract a position from the rectangle position */
export const subRectPos: Unary<Pos, Endo<Rect>> = FN.flow(
  PO.subPosC,
  rectPos.mod,
);

/** Add a size from the rectangle size */
export const addRectSize: Unary<Size, Endo<Rect>> = FN.flow(
  SZ.addSizeC,
  rectSize.mod,
);

/** Subtract a size from the rectangle size */
export const subRectSize: Unary<Size, Endo<Rect>> = FN.flow(
  SZ.subSizeC,
  rectSize.mod,
);

/** Add distance to the x-axis */
export const addRectTop: SetNum = FN.flow(PO.addPosTop, rectPos.mod);

/** Subtract distance from the x-axis */
export const subRectTop: SetNum = FN.flow(PO.subPosTop, rectPos.mod);

/** Add distance to the y-axis */
export const addRectLeft: SetNum = FN.flow(PO.addPosLeft, rectPos.mod);

/** Subtract distance from the y-axis */
export const subRectLeft: SetNum = FN.flow(PO.subPosLeft, rectPos.mod);

/** Add width to the rectangle size */
export const addRectWidth: SetNum = FN.flow(SZ.addWidth, rectSize.mod);

/** Subtract width from the rectangle size */
export const subRectWidth: SetNum = FN.flow(SZ.subWidth, rectSize.mod);

/** Add height to the rectangle size */
export const addRectHeight: SetNum = FN.flow(SZ.addHeight, rectSize.mod);

/** Subtract height from the rectangle size */
export const subRectHeight: SetNum = FN.flow(SZ.subHeight, rectSize.mod);

/** Increment width and height by one */
export const incRectSize: Endo<Rect> = FN.pipe(
  SZ.unitSquare,
  SZ.addSizeC,
  rectSize.mod,
);

/** width-- && height-- */
export const decRectSize: Endo<Rect> = FN.pipe(
  SZ.unitSquare,
  SZ.subSizeC,
  rectSize.mod,
);

/** Scale the rectangle size horizontally by given factor */
export const scaleRectH: SetNum = FN.flow(SZ.scaleH, rectSize.mod);

/** Scale the rectangle size vertically by given factor */
export const scaleRectV: SetNum = FN.flow(SZ.scaleV, rectSize.mod);

/** Scale the rectangle size by given factor */
export const scaleRect: SetNum = FN.flow(SZ.scaleSize, rectSize.mod);

export const shifts = {
  addRect,
  addPos: addRectPos,
  subPos: subRectPos,
  addSize: addRectSize,
  subSize: subRectSize,
  addTop: addRectTop,
  subTop: subRectTop,
  addLeft: addRectLeft,
  subLeft: subRectLeft,
  addWidth: addRectWidth,
  subWidth: subRectWidth,
  addHeight: addRectHeight,
  subHeight: subRectHeight,
  scaleH: scaleRectH,
  scaleV: scaleRectV,
  scale: scaleRect,
} as const;

export type RectShift = typeof shifts;
export type RectShiftKey = keyof RectShift;
export type RectShiftArg<K extends RectShiftKey> = Parameters<RectShift[K]>[0];

export const shiftAt = <K extends RectShiftKey>(k: K) =>
  shifts[k] as RectShift[K] & Unary<RectShiftArg<K>, Endo<Rect>>;

//#endregion

//#region zOrder

/** zOrder++ */
export const incZOrder = rectZorder.mod(FN.increment);

/** zOrder-- */
export const decZOrder = rectZorder.mod(NU.decrement);

/** Reset zOrder to default 0 value */
export const unsetZOrder = rectZorder.set(0);

//#endregion

//#region instances

/** Predicate for rectangle position equality */
export const rectEqPos: EQ.Eq<Rect> = FN.pipe(
  PO.eqPos,
  EQ.contramap(rectPos.get),
);

/** Predicate for rectangle size equality */
export const rectEqSize: EQ.Eq<Rect> = FN.pipe(
  SZ.eqSize,
  EQ.contramap(rectSize.get),
);

/** `Rect` equality predicate */
export const rectEquals: Unary<Rect, PRE.Predicate<Rect>> = fst => snd =>
  rectEqPos.equals(fst, snd) && rectEqSize.equals(fst, snd);

/** `Rect` `Eq` instance */
export const rectEq: EQ.Eq<Rect> = FN.pipe(
  rectEquals,
  uncurry2T,
  EQ.fromEquals,
);

/** `Rect` `Show` instance */
export const showRect: SH.Show<Rect> = {
  show: ({ pos, size }) => PO.showPos.show(pos) + ' ' + SZ.showSize.show(size),
};
/** Monoid for the bounding rectangle operation */
export const rectMonoid: MO.Monoid<Rect> = {
  concat: addRect,
  empty: emptyRect,
};

//#endregion

//#region query

/** Covert rect without zOrder to pair of pairs of size and position */
export const rectToQuad = <R extends Rect>({
  pos: { top, left },
  size: { width, height },
}: R): Pair<Pair<number>> => [
  [top, left],
  [width, height],
];

/** Covert rect without zOrder to 4-tuple of size and position */
export const rectToTuple = FN.flow(rectToQuad, flattenPair);

/** Get top left and bottom right positions of the rectangle */
export const getCorners: Unary<Rect, Pair<Pos>> = FN.fork([
  rectPos.get,
  rectBottomRight.get,
]);

/** Rectangle width * height */
export const rectArea = FN.flow(rectSize.get, SZ.area);

//#endregion

//#region operations

/**
 * Normalize positions of a non-empty list of rectangles
 *
 * Translates all rectangles to the positive quadrant
 */
export const translateRectToPositive = (rs: Rect[]): Rect[] =>
    FN.pipe(
      rs,
      AR.map(rectPos.get),
      PO.translateToPositive,
      AR.zip(rs),
      AR.map(([p, r]) => FN.pipe(r, rectPos.set(p))),
    ),
  stack: Unary<Rect[], Rect> = MO.concatAll(rectMonoid);

//#endregion
