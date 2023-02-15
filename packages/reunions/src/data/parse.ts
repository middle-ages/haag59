import { array as AR, function as FN } from 'fp-ts';
import { array as ARs } from 'fp-ts-std';
import { tail, Unary, lines, split } from 'commons';
import { Matrix, Px, PxRow, resolution } from './types.js';

const { transpose } = ARs;

const linesPerRow = resolution + 1; // line with actual glyphs

const parsePx: Unary<string, Px> = char => (char === '#' ? '#' : '⁺'),
  parseLine = (line: string) =>
    FN.pipe(line, Array.from, AR.map(parsePx)) as PxRow;

export const parseDef: Unary<string[], Matrix> = lines =>
  FN.pipe(lines, AR.map(parseLine)) as Matrix;

const parseRow: Unary<string[], [string, Matrix][]> = ([
  labelLine = '',
  ...bitmapLines
]) => {
  if (labelLine === '') throw new Error('Parsed empty label');
  const labels = FN.pipe(
      labelLine,
      split(/\s+/),
      AR.filter(s => s.length > 0),
      AR.map(s => s.replace('␠', ' ')),
    ),
    matrices = FN.pipe(
      bitmapLines,
      AR.map(split(/\s/)),
      transpose,
      AR.map(parseDef),
    );

  return FN.pipe(labels, AR.zip(matrices));
};

export const parse: Unary<string, [string, Matrix][]> = FN.flow(
  lines,
  tail,
  AR.chunksOf(linesPerRow),
  AR.chain(parseRow),
);
