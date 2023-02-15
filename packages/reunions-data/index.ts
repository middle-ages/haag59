import {
  Nem,
  GlyphRegistry,
  BitmapRegistry,
  EntryReport,
  allStackReports,
  makeGlyphRegistry,
  makeBitmapRegistry,
  StackCounts,
  stats,
} from 'reunions';

/**
 * # Metadata for Unicode pseudographic characters
 *
 * Facade for data and relations precomputed by `rune-stack` package:
 *
 * 1. `chars` - list of all registered characters
 * 1. `roles` - all `BitmapRole`s (`“hLine”, “vLine”, “elbow”, “hTee”, “vTee”,
 * “cross”, “halfTone”`)
 * 1. `matrixByChar` - map of character ⇒ bitmap matrix
 * 1. `charByMatrix` - map of bitmap matrix ⇒ character
 * 1. `rolesByChar` - map of character ⇒ `BitmapRole`s
 * 1. `charsByRole` - map of `BitmapRole` ⇒ characters
 * 1. `allRelations` - list of all relations
 * 1. `allCharRelations` - list of all character relations
 * 1. `allRelationNames` - list of all relation names: `“turn”`, `“invert”`,
 * `“hFlip”`, `“vFlip”`, `“weight”`, `“shift”` and `“dash”`
 * 1. `defs` - list of all relation definitions
 * 1. `defByName` - record of relation name ⇒ relation
 * 1. `relations` - record of relation name ⇒ relation definition
 * 1. `glyphByChar` - map of character ⇒ glyph
 * 1. `allStacks` - every possible stackings
 * 1. `stackStats` - counts of characters, successful stacks, and other stats
 *
 */
export interface RuneMetadata extends BitmapRegistry, GlyphRegistry {
  allStacks: Nem<EntryReport>;
  stackStats: StackCounts;
}

export function runeMetadata(): RuneMetadata {
  const bitmaps = makeBitmapRegistry(),
    glyphs = makeGlyphRegistry();

  return {
    ...bitmaps,
    ...glyphs,
    allStacks: allStackReports(),
    stackStats: stats(),
  };
}
