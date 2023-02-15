export * from './src/glyph.js';
export * from './src/stack.js';
export * from './src/relation.js';
export * from './src/criteria.js';
export * from './src/quadRes.js';
export * from './src/bitmap.js';
export * as bitmap from './src/bitmap.js';
export * from './src/data.js';
export * from './src/ops.js';
export { named } from './src/named.js';

export type {
  Px,
  PxRow,
  Matrix,
  MatrixRow,
  TupleRes,
  RowOp,
  RowCheck,
  Check,
  RelCheck,
} from './src/data.js';

export type { BasicGroup, ElbowGroup, LineGroup } from './src/named.js';

import { bitmapRegistry } from './src/bitmap.js';
import * as quadRes from './src/quadRes.js';
import * as data from './src/data.js';
import * as ops from './src/ops.js';
import { named as namedImport } from './src/named.js';
import * as relation from './src/relation.js';
import { tryCachedStack } from './src/stack.js';

export const rune = {
  ...data,
  ...ops,
  ...quadRes,
  ...bitmapRegistry,
  ...namedImport,
  bitmapRegistry: bitmapRegistry.reg,
  relation,
} as const;

export const stack = tryCachedStack;
