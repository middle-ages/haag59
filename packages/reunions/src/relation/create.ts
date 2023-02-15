import { callWith, Pair, pluck, typedEntries, Unary } from 'commons';
import { array as AR, function as FN } from 'fp-ts';
import { array as ARs, function as FNs, tuple as TUs } from 'fp-ts-std';
import { matchCriteria } from '../criteria.js';
import { emptyMatrix, Matrix, RelCheck } from '../data.js';
import { BitmapRegistry as BitmapRegistry, bitmapRegistry } from '../bitmap.js';
import { buildRelation, buildWithChains } from './build.js';
import { relationDefs as allRelations } from './defs.js';
import { linkChains } from './link.js';
import { CharRelation, Relation, RelationDef } from './types.js';

const { cartesian } = ARs,
  { flip } = FNs,
  { mapBoth, toSnd } = TUs;

/** A pair of runes and their matrices */
export type MatrixPairs = [Pair<string>[], Pair<Matrix>[]];

const computePairs = ({ chars, matrixByChar }: BitmapRegistry): MatrixPairs =>
  FN.pipe(
    chars,
    callWith<string[], Pair<string>[]>(cartesian),
    toSnd(AR.map(mapBoth(c => matrixByChar.get(c) ?? emptyMatrix))),
  );

/** Every unique non-symmetric character pair with their matrices */
export const computeUniquePairs: typeof computePairs = registry => {
  const map = new Set<string>(),
    [chars, matrices] = computePairs(registry),
    [charsRes, matrixRes] = [
      new Array<Pair<string>>(),
      new Array<Pair<Matrix>>(),
    ];

  for (let i = 0; i < chars.length; i++) {
    const [[fst, snd], matrixPair] = [
      chars[i] as Pair<string>,
      matrices[i] as Pair<Matrix>,
    ];
    if (fst === snd || map.has(snd + fst) || fst === ' ' || snd === ' ')
      continue;
    map.add(fst + snd);
    charsRes.push([fst, snd]);
    matrixRes.push(matrixPair);
  }

  return [charsRes, matrixRes];
};

const createDefs: FN.Lazy<RelationDef[]> = () =>
  FN.pipe(
    allRelations,
    typedEntries,
    AR.map(([name, def]) => ({ name, ...def } as RelationDef)),
  );

export const createRelations = (): [Relation, CharRelation[]][] => {
  const [charPairs, matrixPairs] = computePairs(bitmapRegistry.reg);

  const createCharRelations: Unary<Relation, CharRelation[]> = relation =>
    FN.pipe(relation.pairs, bitmapRegistry.collectPairs, linkChains(relation));

  const filterMatrices: Unary<RelCheck, Pair<string>[]> = check =>
    FN.pipe(
      matrixPairs,
      AR.filter(check),
      AR.map(bitmapRegistry.pairMatrixToChar),
    );

  const createRelation: Unary<RelationDef, Relation> = callWith(
    FN.flow(
      pluck('criteria'),
      matchCriteria(
        check => def => FN.pipe(check, filterMatrices, buildRelation(def)),

        check => def =>
          FN.pipe(charPairs, AR.filter(check), buildRelation(def)),

        flip(buildWithChains),
      ),
    ),
  );

  return FN.pipe(
    createDefs(),
    AR.map(FN.flow(createRelation, toSnd(createCharRelations))),
  );
};
