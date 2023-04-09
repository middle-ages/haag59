import {
  Binary,
  BinaryC,
  BinOp,
  Endo,
  halfInt,
  ordStruct,
  Pair,
  Ternary,
  Tuple3,
  TupleN,
  typedFromEntries,
  typedKeys,
  ucFirst,
  Unary,
  uncurry2T,
  withKeys,
} from 'commons';
import {
  array as AR,
  eq as EQ,
  function as FN,
  number as NU,
  ord as OD,
  predicate as PRE,
  readonlyArray as RA,
  record as RC,
  show as SH,
  tuple as TU,
} from 'fp-ts';
import { function as FNs, tuple as TUs } from 'fp-ts-std';
import { lens as LE } from 'monocle-ts';
import { HDir, VDir, withHDirs, withVDirs } from './dir.js';
import { Size } from './size.js';
import { Spacing } from './spacing.js';

const { curry2, flip, uncurry2 } = FNs,
  { toFst, withSnd } = TUs;

/** A 3-tuple of the horizontal alignments */
export const hAlign = ['left', 'center', 'right'] as const;
/** A 3-tuple of the vertical alignments */
export const vAlign = ['top', 'middle', 'bottom'] as const;

/** The type of horizontal alignments: `“left” | “center” | “right”` */
export type HAlign = (typeof hAlign)[number];
/** The type of vertical alignments: `“top” | “middle” | “bottom”` */
export type VAlign = (typeof vAlign)[number];

/** A horizontal or vertical alignment */
export type OrientAlign = HAlign | VAlign;

/** A pair of `OrientAlign`s on same orientation, possibly identical */
export type OrientPair = Pair<HAlign> | Pair<VAlign>;

/** A horizontal dir + vertical alignment, E.g.: `['left','top'] */
export type HAlignPair = [HDir, VAlign];

/** A vertical dir + horizontal alignment, E.g.: `['bottom','center'] */
export type VAlignPair = [VDir, HAlign];

/** A pair of dir + orthogonal (to the dir) alignment */
export type AlignPair = HAlignPair | VAlignPair;

/** One of 9 possible values for horizontal and vertical alignment */
export interface Align {
  horizontal: HAlign;
  vertical: VAlign;
}

export const align: Binary<HAlign, VAlign, Align> = (horizontal, vertical) => ({
  horizontal,
  vertical,
});

/** Curried build from horizontal then vertical alignment */
export const hvAlign: BinaryC<HAlign, VAlign, Align> =
  horizontal => vertical => ({
    horizontal,
    vertical,
  });

/** Curried build from horizontal then vertical alignment */
export const vhAlign = flip(hvAlign);

export const pairVAlign: Unary<[VAlign, HAlign], Align> = uncurry2(vhAlign),
  pairHAlign: Unary<[HAlign, VAlign], Align> = uncurry2(hvAlign);

/** Match by horizontal alignment */
export const matchHAlign =
  <R>(left: R, center: R, right: R): Unary<HAlign, R> =>
  v =>
    v === 'left' ? left : v === 'center' ? center : right;

/** Match by vertical alignment */
export const matchVAlign =
  <R>(top: R, middle: R, bottom: R): Unary<VAlign, R> =>
  v =>
    v === 'top' ? top : v === 'middle' ? middle : bottom;

export const hAlignSym: Record<HAlign, string> = {
    left: '⭰',
    center: '×',
    right: '⭲',
  },
  vAlignSym: Record<VAlign, string> = { top: '⭱', middle: '×', bottom: '⭳' },
  alignSym: Record<VAlign, Record<HAlign, string>> = {
    top: { left: '⭶', center: vAlignSym.top, right: '⭷' },
    middle: hAlignSym,
    bottom: { left: '⭹', center: vAlignSym.bottom, right: '⭸' },
  };

/** Map over all horizontal alignments to make a 3-tuple */
export const mapHAlign = <R>(f: Unary<HAlign, R>) =>
  FN.pipe(hAlign, RA.map(f)) as Tuple3<R>;
/** Map over all vertical alignments to make a 3-tuple */
export const mapVAlign = <R>(f: Unary<VAlign, R>) =>
  FN.pipe(vAlign, RA.map(f)) as Tuple3<R>;

/***
 * One of 9 alignments in string formed from the combinations of horizontal and
 * vertical alignments
 */
export type Alignment<
  V extends VAlign = VAlign,
  H extends HAlign = HAlign,
> = `${V}${Capitalize<H>}`;

/** Convert an `Align` into a string `Alignment` */
export const toAlignment: Unary<Align, Alignment> = ({
  horizontal,
  vertical,
}) => `${vertical}${ucFirst(horizontal)}` as Alignment;

export type Alignments = Record<Alignment, Align>;

export const alignments: Alignments = FN.pipe(
  vAlign,
  RA.chain(v =>
    FN.pipe(hAlign, RA.map(FN.flow(vhAlign(v), toFst(toAlignment)))),
  ),
  typedFromEntries,
);

export const {
  topLeft: TL,
  topCenter: TC,
  topRight: TR,
  middleLeft: ML,
  middleCenter: MC,
  middleRight: MR,
  bottomLeft: BL,
  bottomCenter: BC,
  bottomRight: BR,
} = alignments;

export const alias = { TL, TC, TR, ML, MC, MR, BL, BC, BR };

export const {
  TL: topLeft,
  TC: topCenter,
  TR: topRight,
  ML: middleLeft,
  MC: middleCenter,
  MR: middleRight,
  BL: bottomLeft,
  BC: bottomCenter,
  BR: bottomRight,
} = alias;

export const center = MC;

/** Tuple of the 9 alignment names */
export const alignmentNames: TupleN<Alignment, 9> & readonly Alignment[] =
  typedKeys(alignments);

/** Map alignments to make a record of `Alignment` to your return type */
export const mapAlign = <R>(f: Unary<Align, R>): Record<Alignment, R> =>
  FN.pipe(alignments, RC.map(f));

const id = LE.id<Align>();

export const alignH: LE.Lens<Align, HAlign> = FN.pipe(
    id,
    LE.prop('horizontal'),
  ),
  alignV: LE.Lens<Align, VAlign> = FN.pipe(id, LE.prop('vertical'));

export const fromBuildArgs =
  (fallback: Align) =>
  (align?: Partial<Align>, horizontal?: HAlign, vertical?: VAlign): Align =>
    FN.pipe(
      { ...fallback, ...(align ?? {}) },
      horizontal === undefined ? FN.identity : alignH.set(horizontal),
      vertical === undefined ? FN.identity : alignV.set(vertical),
    );

export const showAlign: SH.Show<Align> = {
  show: ({ horizontal, vertical }) => alignSym[vertical][horizontal],
};

const zipIndex = AR.zip([0, 1, 2]),
  [hAlignIndex, vAlignIndex]: [Record<HAlign, number>, Record<VAlign, number>] =
    FN.pipe(
      [[...hAlign], [...vAlign]] as [HAlign[], VAlign[]],
      TU.bimap(
        FN.flow(zipIndex, typedFromEntries),
        FN.flow(zipIndex, typedFromEntries),
      ),
    ),
  [hIdx, vIdx]: [Unary<HAlign, number>, Unary<VAlign, number>] = [
    h => hAlignIndex[h],
    v => vAlignIndex[v],
  ];

const [hAlignOrd, vAlignOrd]: [OD.Ord<HAlign>, OD.Ord<VAlign>] = [
  FN.pipe(NU.Ord, OD.contramap(hIdx)),
  FN.pipe(NU.Ord, OD.contramap(vIdx)),
];

const ord: OD.Ord<Align> = FN.pipe(
  {
    horizontal: hAlignOrd,
    vertical: vAlignOrd,
  },
  FN.pipe(OD.getMonoid<Align>(), ordStruct),
);

export const equals: Unary<Align, PRE.Predicate<Align>> = curry2(ord.equals),
  alignEq: EQ.Eq<Align> = FN.pipe(equals, uncurry2T, EQ.fromEquals);

/** Select the `Align` that sorts first */
export const minSorted: BinOp<Align> = OD.min(ord);

/** Alignment type guards */
export const isHorizontal = (a: OrientAlign): a is HAlign =>
    (hAlign as readonly string[]).includes(a as string),
  isVertical = (a: OrientAlign): a is VAlign =>
    (vAlign as readonly string[]).includes(a as string),
  isHVPair = (a: AlignPair): a is HAlignPair => isHorizontal(a[0]),
  isVHPair = (a: AlignPair): a is VAlignPair => isVertical(a[0]);

/**
 * Given a pair of alignments on same orientation, if you drew a directed line
 * from the first to the second, does it point at the positive axis direction?
 *
 * For example, `['left','right']` has the directed line `from left → to right`,
 * pointing right, and because this is the positive X-axis direction, we get
 * `true`. On the other hand `['bottom','top']` has the directed line pointing
 * up, from bottom to top, which is negative Y-axis direction, and we get
 * `false`. Only true for `['left', 'right']` and `['top', 'bottom']`.
 */
export const isOrientHead: PRE.Predicate<OrientPair> = ([fst, snd]) =>
  isHorizontal(fst)
    ? fst === 'left' && snd === 'right'
    : fst === 'top' && snd === 'bottom';

/** Are there no `center` or `middle` alignments in this pair? */
export const isEdgePair: PRE.Predicate<OrientPair> = ([fst, snd]) =>
  isHorizontal(fst)
    ? fst !== 'center' && snd !== 'center'
    : fst !== 'middle' && snd !== 'middle';

/** Split a given number in two according to the given horizontal alignment */
export const horizontally: Binary<HAlign, number, Pair<number>> = (hAlign, w) =>
  matchHAlign<Pair<number>>([0, w], halfInt(w), [w, 0])(hAlign);

/** Split a given number in two according to the given vertical alignment */
export const vertically: Binary<VAlign, number, Pair<number>> = (vAlign, h) =>
  matchVAlign<Pair<number>>([0, h], halfInt(h), [h, 0])(vAlign);

export type SubPad = Unary<number, Endo<Pair<number>>>;

export const subPad: SubPad =
    len =>
    ([fst, snd]) =>
      FN.pipe(
        Math.max(0, fst - len),
        withSnd(Math.max(0, Math.min(0, fst - len) + snd)),
      ),
  midPad: SubPad =
    len =>
    ([fst, snd]) => {
      if (len > fst + snd) return [0, 0];
      const [initFst, initSnd] = halfInt(len),
        [head, last] = [fst - initFst, snd - initSnd],
        both = head + last;
      return head < 0 ? [0, both] : last < 0 ? [both, 0] : [head, last];
    };

/**
 * Remove a width from the horizontal component of some spacing according to
 * given horizontal alignment
 */
export const subWidthFromSpacing: Ternary<Spacing, HAlign, number, Spacing> = (
  { left, right, ...rest },
  hAlign,
  width,
) => ({
  ...rest,
  ...FN.pipe(
    hAlign,
    matchHAlign(
      withHDirs(subPad(width)([left, right])),
      withHDirs(midPad(width)([left, right])),
      withKeys('right', 'left')(subPad(width)([right, left])),
    ),
  ),
});

/**
 * Remove a height from the vertical component of some spacing according to
 * given vertical alignment
 */
export const subHeightFromSpacing: Ternary<Spacing, VAlign, number, Spacing> = (
  { top, bottom, ...rest },
  vAlign,
  height,
) => ({
  ...rest,
  ...FN.pipe(
    vAlign,
    matchVAlign(
      withVDirs(subPad(height)([top, bottom])),
      withVDirs(midPad(height)([top, bottom])),
      withKeys('bottom', 'top')(subPad(height)([bottom, top])),
    ),
  ),
});

/**
 * Shrink spacing by the given size at the direction of the given alignment
 */
export const shrinkSpacing: BinaryC<Align, Size, Endo<Spacing>> =
  ({ horizontal, vertical }) =>
  ({ width, height }) =>
  initSpacing => {
    const shrunkHeight = subHeightFromSpacing(initSpacing, vertical, height);
    return subWidthFromSpacing(shrunkHeight, horizontal, width);
  };
