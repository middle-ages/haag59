import { pluck, Unary } from 'commons';
import {
  array as AR,
  function as FN,
  nonEmptyArray as NE,
  option as OP,
  record as RC,
  tuple as TU,
} from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { named } from '../named.js';
import {
  CharRelation,
  createRelations,
  Relation,
  RelationDef,
  RelationName,
} from '../relation.js';
import {
  buildGlyph,
  buildGlyphRelations,
  Glyph,
  GlyphRelation,
  GlyphRelations,
  MaybeGlyph,
} from './types.js';

const { mapBoth } = TUs;

type RelationByName = Record<RelationName, Relation>;
type DefByName = Record<RelationName, RelationDef>;
type GlyphByChar = Map<string, Glyph>;

export interface GlyphRegistry {
  /**
   * A record of `RelationDef` per relation name. A `RelationDef` has a label
   * and `Criteria`. The `Criteria` is a predicate on a pair of characters, true
   * if they are both in the same equivalence class of the defined relation.
   */
  defByName: DefByName;

  /**
   * The list of all glyph relation names: “dash”, “hFlip”,“invert”,“shift”,
   * “turn”,“weight”, and “vFlip”
   */
  allRelationNames: RelationName[];

  /**
   * A record of `Relation` per relation name. The `Relation` encodes all member pairs
   * of the relation and caches the _chains_ of the relation
   */
  relations: RelationByName;

  /**
   * A map of `Glyph` per pseudographic character. The `Glyph` encodes the
   * `CharRelations` of the glyph. These links the glyph to similar glyphs by
   * relation.
   */
  glyphByChar: GlyphByChar;

  /**
   * The list of all character relations. These link glyphs to each other by
   * similarity
   * */
  allCharRelations: CharRelation[];

  /** The list of all glyph relations */
  allRelations: Relation[];

  /** The list of all relation definitions */
  defs: RelationDef[];
}

export const makeGlyphRegistry: FN.Lazy<GlyphRegistry> = () => {
  const relCharPairs: [Relation, CharRelation[]][] = createRelations(),
    allRelations: Relation[] = FN.pipe(relCharPairs, AR.map(TU.fst)),
    defs = FN.pipe(allRelations, AR.map(pluck('def'))),
    allRelationNames = FN.pipe(defs, AR.map(pluck('name'))),
    allCharRelations: CharRelation[] = FN.pipe(relCharPairs, AR.chain(TU.snd));

  const charMap = new Map<string, CharRelation[]>();
  for (const charRelation of allCharRelations) {
    const char = charRelation.on;
    charMap.set(char, [...(charMap.get(char) ?? []), charRelation]);
  }

  const glyphByChar = new Map<string, Glyph>();
  charMap.forEach((relations, char) =>
    glyphByChar.set(char, FN.pipe(relations, buildGlyph(char))),
  );

  return {
    allRelations,
    allCharRelations,
    allRelationNames,
    defs,
    defByName: FN.pipe(allRelationNames, AR.zip(defs), RC.fromEntries),
    relations: FN.pipe(allRelationNames, AR.zip(allRelations), RC.fromEntries),
    glyphByChar,
  } as GlyphRegistry;
};

export const glyphRegistry = makeGlyphRegistry();

export const {
  allRelationNames,
  defs,
  defByName,
  relations,
  allCharRelations,
} = glyphRegistry;

export const glyphByChar: Unary<string, MaybeGlyph> = char =>
  FN.pipe(glyphRegistry.glyphByChar.get(char), OP.fromNullable);

export const [space, solid] = FN.pipe(
  [' ', named.solid],
  mapBoth(
    FN.flow(glyphByChar, m => {
      if (OP.isNone(m)) throw new Error('no space/solid');
      return m.value;
    }),
  ),
);

export const glyphOrSpace: Unary<string, Glyph> = FN.flow(
  glyphByChar,
  FN.pipe(space, FN.constant, OP.getOrElse),
);

const convertRelation: Unary<CharRelation, GlyphRelation> = ({
  on,
  prev,
  next,
  relation,
}) => {
  return {
    on: glyphOrSpace(on),
    relation,
    prev: FN.pipe(prev, AR.map(glyphOrSpace)),
    next: FN.pipe(next, AR.map(glyphOrSpace)),
  };
};

export const glyphRelationsDict: Record<string, GlyphRelations> = FN.pipe(
  allCharRelations,
  NE.groupBy(pluck('on')),
  FN.pipe(convertRelation, buildGlyphRelations, RC.map),
);

export const glyphRelations: Unary<string, GlyphRelation[]> = char =>
  Object.values(glyphRelationsDict[char] ?? []);
