export * from './src/orientation.js';

import * as alignFns from './src/align.js';
import * as posFns from './src/pos.js';
import * as sizeFns from './src/size.js';
import * as spacingFns from './src/spacing.js';
import * as rectFns from './src/rect.js';
import * as dirFns from './src/dir.js';
import * as cornerFns from './src/corner.js';
import * as borderDirFns from './src/borderDir.js';

export * as term from './src/term.js';
export type {
  HAlign,
  VAlign,
  Align,
  OrientAlign,
  OrientPair,
  HAlignPair,
  VAlignPair,
  AlignPair,
  Alignment,
  Alignments,
} from './src/align.js';
export type { PosKey, Pos } from './src/pos.js';
export type { SizeKey, Size } from './src/size.js';
export type { Spacing, HSpacing, VSpacing } from './src/spacing.js';
export type {
  Rect,
  RectLens,
  RectLensKey,
  RectLensResult,
  RectShift,
  RectShiftArg,
  RectShiftKey,
} from './src/rect.js';
export type {
  Dir,
  Direct,
  Directed,
  Dirs,
  HDir,
  Horizontal,
  OrientDirs,
  ReversedDir,
  VDir,
  Vertical,
} from './src/dir.js';
export type { Corners, Corner, Cornered } from './src/corner.js';
export type { Bordered, BorderDir, BorderDirs } from './src/borderDir.js';
export type { Orient, Orientation } from './src/orientation.js';

export type align = typeof alignFns.build & typeof alignFns;
export type pos = typeof posFns.build & typeof posFns;
export type size = typeof sizeFns.build & typeof sizeFns;
export type spacing = typeof spacingFns.build & typeof spacingFns;
export type rect = typeof rectFns.build & typeof rectFns;

export type dir = typeof dirFns.value & typeof dirFns;
export type corner = typeof cornerFns.value & typeof cornerFns;
export type borderDir = typeof borderDirFns.value & typeof borderDirFns;

export const align = alignFns.build as align;
export const pos = posFns.build as pos;
export const size = sizeFns.build as size;
export const spacing = spacingFns.build as spacing;
export const rect = rectFns.build as rect;
export const dir = dirFns.value as dir;
export const corner = cornerFns.value as corner;
export const borderDir = borderDirFns.value as borderDir;

Object.assign(align, alignFns);
Object.assign(pos, posFns);
Object.assign(size, sizeFns);
Object.assign(spacing, spacingFns);
Object.assign(rect, rectFns);
Object.assign(dir, dirFns);
Object.assign(corner, cornerFns);
Object.assign(borderDir, borderDirFns);
