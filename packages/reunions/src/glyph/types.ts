import { array as AR, function as FN, option as OP } from 'fp-ts';
import { bitmapRegistry, BitmapRole } from '../bitmap.js';
import { BinaryC, Unary } from 'commons';
import {
  RelationOf,
  buildRelationsOf,
  CharRelation,
  CharRelations,
  RelationName,
} from '../relation.js';
import { Matrix } from '../data.js';

/**
 * A “Glyph” is unicode character with some information we have computed about
 * it:
 *
 * 1. The character itself
 * 1. The owning list of `BitmapRole`, for example “┣” is from the bitmap role
 * `vTee`.
 * 1. The glyph bitmap matrix: useful for stacking with other characters or
 * investigating the bitmap itself using the functions in `bitmap/ops`, such as
 * `bitmap.invertEq` to check if a matrix pair are invert symmetric,
 * `bitmap.countPx` to count pixels the lit pixels in some row given by index,
 * and many others.
 * 1. Relations to other glyphs: a `CharRelations` object encodes relations to
 * other glyphs we have registered, keyed by the relation criteria, I.e.  *
 * `weight`, `turn`, `invert`, etc. This allows navigation between the glyphs by
 * relation.
 *
 */
export interface Glyph {
  _tag: 'glyph';
  char: string;
  roles: BitmapRole[];
  matrix: Matrix;
  relation: CharRelations;
}

export type MaybeGlyph = OP.Option<Glyph>;

/** A `CharRelation` with the characters replaced by their glyphs */
export type GlyphRelation = RelationOf<Glyph>;

/** All glyph relations of one glyph, by relation name */
export type GlyphRelations = Record<RelationName, GlyphRelation>;

export const buildGlyph: BinaryC<string, CharRelation[], Glyph> =
  char => relations => ({
    _tag: 'glyph',
    char,
    roles: bitmapRegistry.rolesByChar(char),
    matrix: bitmapRegistry.matrixByChar(char),
    relation: buildRelationsOf(relations),
  });

export const buildGlyphRelations: BinaryC<
  Unary<CharRelation, GlyphRelation>,
  CharRelation[],
  GlyphRelations
> = f => FN.flow(AR.map(f), buildRelationsOf);
