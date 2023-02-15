import { show as SH } from 'fp-ts';
import { Pair, Unary } from 'commons';

export type Orientation = 'horizontal' | 'vertical';
export type Oriented<T> = Record<Orientation, T>;
export type Orient = Oriented<string>;

export const orientations: Pair<Orientation> = ['horizontal', 'vertical'];

export type Orthogonal<O extends Orientation> = O extends 'horizontal'
  ? 'vertical'
  : O extends 'vertical'
  ? 'vertical'
  : 'never';

export const orthogonal = <O extends Orientation>(o: O): Orthogonal<O> =>
  (o === 'horizontal' ? 'vertical' : 'horizontal') as Orthogonal<O>;

/** Convert a string of 2 border characters to an `Orient` */
export const orient: Unary<string, Orient> = pair => {
  if (pair.length !== 2) throw new Error(`orient with length≠2: ${pair}`);
  const [horizontal, vertical] = Array.from(pair) as Pair<string>;
  return { horizontal, vertical };
};

export const matchOrientation =
  <R>(horizontal: R, vertical: R): Unary<Orientation, R> =>
  o =>
    o === 'horizontal' ? horizontal : vertical;

export const show: SH.Show<Orientation> = {
  show: matchOrientation('↔', '↕'),
};
