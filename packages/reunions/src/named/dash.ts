import { array as AR, function as FN, record as RC, option as OP } from 'fp-ts';
import { tuple as TUs } from 'fp-ts-std';
import { Unary } from 'commons';

const { withFst } = TUs;

const lineMap = { '─': '┄┈╌', '│': '┆┊╎', '━': '┅┉╍', '┃': '┇┋╏' };

export const undashMap = new Map<string, string>();

FN.pipe(
  lineMap,
  RC.map(dashed => FN.pipe(Array.from(dashed))),
  RC.toEntries,
  AR.chain(([undashed, dashed]) => FN.pipe(dashed, AR.map(withFst(undashed)))),
).forEach(([undashed, dashed]) => undashMap.set(dashed, undashed));

/** Remove dashes from a dashed line */
export const undashLine: Unary<string, OP.Option<string>> = dashed => {
  const res = undashMap.get(dashed);
  return OP.fromNullable(res);
};
