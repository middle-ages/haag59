import { singletonDir, direct, orient } from 'geometry';
import { array as AR, function as FN } from 'fp-ts';
import { solid, space } from './other.js';

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
  space: singletonDir(space),
  solid: singletonDir(solid),
} as const;
