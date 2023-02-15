import * as fc from 'fast-check';
import { Size, Pos, Rect, Spacing } from '../index.js';

const maxSizeNat = fc.nat(100);

export const sizeArb: fc.Arbitrary<Size> = fc.record({
  width: maxSizeNat,
  height: maxSizeNat,
});

const maxPosNat = fc.nat(100);

export const posArb: fc.Arbitrary<Pos> = fc.record({
  top: maxPosNat,
  left: maxPosNat,
});

export const rectArb: fc.Arbitrary<Rect> = fc.record({
  pos: posArb,
  size: sizeArb,
  zOrder: fc.nat(10),
});

export const spacingArb: fc.Arbitrary<Spacing> = fc.record({
  top: maxPosNat,
  right: maxPosNat,
  bottom: maxPosNat,
  left: maxPosNat,
});
