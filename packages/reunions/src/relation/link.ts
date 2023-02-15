import { array as AR, function as FN } from 'fp-ts';
import { buildCharRelation } from './build.js';
import { BinaryC, withAdjacent } from 'commons';
import { CharRelation, Relation } from './types.js';

/** Create all the `CharacterRelation`s for a relation */
export const linkChains: BinaryC<Relation, string[], CharRelation[]> =
  relation => chars => {
    const prevMap = new Map<string, string[]>(),
      nextMap = new Map<string, string[]>();

    for (const chain of relation.chains) {
      for (const [char, [prev, next]] of withAdjacent(chain)) {
        if (prev.length)
          prevMap.set(char, [...(prevMap.get(char) ?? []), ...prev]);
        if (next.length)
          nextMap.set(char, [...(nextMap.get(char) ?? []), ...next]);
      }
    }

    return FN.pipe(
      chars,
      AR.map(char =>
        buildCharRelation(
          char,
          relation.def.name,
        )([prevMap.get(char) ?? [], nextMap.get(char) ?? []]),
      ),
    );
  };
