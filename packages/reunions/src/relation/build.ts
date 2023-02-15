import { function as FN, array as AR } from 'fp-ts';
import { Pair, BinaryC, Unary, pluck, typedFromEntries } from 'commons';
import { tuple as TUs } from 'fp-ts-std';
import { extractChains } from '../criteria.js';
import { relationCounts } from './counts.js';
import {
  CharRelations,
  CharRelation,
  Relation,
  RelationDef,
  RelationName,
  RelationOf,
} from './types.js';

const { toFst, toSnd } = TUs;

export const buildWithChains: BinaryC<
  RelationDef,
  [Pair<string>[], string[][]],
  Relation
> =
  def =>
  ([pairs, chains]) => ({
    def,
    pairs,
    chains,
    counts: relationCounts(pairs, chains),
  });

export const buildRelation: BinaryC<
  RelationDef,
  Pair<string>[],
  Relation
> = def => FN.flow(toSnd(extractChains), buildWithChains(def));

export const buildCharRelation =
  (on: string, relation: RelationName): Unary<Pair<string[]>, CharRelation> =>
  ([prev, next]) => ({
    on,
    relation,
    prev,
    next,
  });

export const buildRelationsOf = <T>(
  rel: RelationOf<T>[],
): Record<RelationName, RelationOf<T>> =>
  FN.pipe(rel, AR.map(toFst(pluck('relation'))), typedFromEntries);

export const buildCharRelations: Unary<CharRelation[], CharRelations> =
  buildRelationsOf;
