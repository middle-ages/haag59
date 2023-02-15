import { dir, orient } from 'geometry';
import { array as AR, function as FN } from 'fp-ts';
import { solid, space } from './other.js';

const { singleton, direct } = dir;

const [dot, lineDash, wide, thickDot, thickDash, thickWide] = FN.pipe(
  ['┈┊', '┄┆', '╌╎', '┉┋', '┅┇', '╍╏'],
  AR.map(orient),
);

const dashed = {
    ...lineDash,
    thick: { ...thickDash, wide: thickWide },
  } as const,
  dotted = { ...dot, thick: thickDot } as const,
  dashedWide = { ...wide, thick: thickWide } as const,
  dash = { ...dashed, dot: dotted, wide: dashedWide } as const,
  thick = {
    ...orient('━┃'),
    dash: thickDash,
    dot: thickDot,
    wide: thickWide,
  } as const;

/** A tree of named lines by group arranged by direction or orientation */
export const line = {
  ...direct('▔▕▁▏'),
  ...orient('─│'),
  thick,
  dash,
  double: orient('═║'),
  halfSolid: direct('▀▐▄▌'),
  space: singleton(space),
  solid: singleton(solid),
} as const;
