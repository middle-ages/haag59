import { nonEmptyArray as NEA, option as OP } from 'fp-ts';
import { Pair } from 'commons';

export type StackTag =
  /** The result appears on the left, happens when `A ⊆ B` */
  | 'superset'
  /** No shared pixels, happens when `A ∩ B = ∅` */
  | 'disjoint';

/** A description of one stacking */
export interface EntryReport {
  entry: StackEntry;
  tags: StackTag[];
}

/** Summary counts of all successful stacks */
export interface StackCounts {
  /** Total number of successful stacks */
  stack: number;

  /** Number of stacks where the matrix pixels obey `A ⊆ B` */
  superset: number;
  /** Number of stacks where the matrix pixels obey `A ∩ B = ∅` */
  disjoint: number;

  /** Total rune count */
  rune: number;
}

export type Nem<T> = NEA.NonEmptyArray<T>;

export type Nem2<T> = Nem<Nem<T>>;

export type GroupedStack = Record<string, StackEntry[]>;

/** A possible stacking or stacking into none */
export type StackResult = [Pair<string>, OP.Option<string>];

/** A stacking of the glyph pair into the final glyph */
export type StackEntry = [Pair<string>, string];
