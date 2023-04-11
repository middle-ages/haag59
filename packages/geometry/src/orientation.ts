import { Pair, Unary, SH } from 'commons';

/** The union of `horizontal` and `vertical` orientations */
export type Orientation = 'horizontal' | 'vertical';

/** A record with `Orientation` as keys */
export type Oriented<T> = Record<Orientation, T>;

/** An `Oriented` with `string` values */
export type Orient = Oriented<string>;

/** The pair of orientations: `horizontal` and `vertical` */
export const orientations: Pair<Orientation> = ['horizontal', 'vertical'];

/** The type of the orthogonal orientation of `O` */
export type Orthogonal<O extends Orientation> = O extends 'horizontal'
  ? 'vertical'
  : O extends 'vertical'
  ? 'vertical'
  : 'never';

/** Get the orthogonal orientation */
export const orthogonal = <O extends Orientation>(o: O): Orthogonal<O> =>
  (o === 'horizontal' ? 'vertical' : 'horizontal') as Orthogonal<O>;

/** Convert a string of 2 border characters to an `Orient` */
export const orient: Unary<string, Orient> = pair => {
  if (pair.length !== 2) throw new Error(`orient with length≠2: ${pair}`);
  const [horizontal, vertical] = Array.from(pair) as Pair<string>;
  return { horizontal, vertical };
};

/** Match by `Orientation` */
export const matchOrientation =
  <R>(horizontal: R, vertical: R): Unary<Orientation, R> =>
  o =>
    o === 'horizontal' ? horizontal : vertical;

/** `Orientation` `Show` instance */
export const showOrientation: SH.Show<Orientation> = {
  show: matchOrientation('↔', '↕'),
};
