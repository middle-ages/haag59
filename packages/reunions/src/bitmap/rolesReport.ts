import { underline, bold, bgRgb, rgb } from 'ansis/colors';
import { addBefore, Binary, BinaryC, BinOpC, chunksOf } from 'commons';
import { array as AR, function as FN, nonEmptyArray as NEA } from 'fp-ts';
import { function as FNs, string as STRs, tuple as TUs } from 'fp-ts-std';
import { Matrix, resolution } from '../data.js';
import { quadResWith } from '../quadRes.js';
import { bitmapRegistry as reg } from './bitmapRegistry.js';
import { BitmapRole } from './role.js';

type Nes = NEA.NonEmptyArray<string>;
type Nes2 = NEA.NonEmptyArray<string[]>;

const { uncurry2 } = FNs,
  { append, unlines } = STRs,
  { toSnd } = TUs;

const color = (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
) => FN.flow(rgb(a, b, c), bgRgb(d, e, f));

const onBlack = (a: number, b: number, c: number) => color(a, b, c, 0, 0, 0);

const blueOnWhite = onBlack(0, 160, 240),
  greenOnWhite = FN.flow(underline, onBlack(50, 255, 0)),
  greenOnGrey = FN.flow(underline, bgRgb(20, 20, 20)),
  orangeOnWhite = FN.flow(bold, onBlack(250, 200, 0));

const headColor = greenOnWhite,
  sep = onBlack(50, 50, 50),
  fence = sep('┃'),
  space = greenOnGrey(' '),
  roleColor = orangeOnWhite,
  px = blueOnWhite,
  num = onBlack(150, 150, 150);

// zip and concat a row pair
const zipRows: BinOpC<Nes> = left => right =>
  FN.pipe(right, NEA.zip(left), FN.pipe(append, uncurry2, NEA.map));

/** Report of a single group of glyphs at a width */
export const groupReport =
  (width: number) =>
  (idx: number, group: string) =>
  (runes: string[]): string => {
    const perRow = Math.floor(width / (1 + resolution / 2));
    const columns = FN.pipe(
      runes,
      FN.pipe(reg.matrixByChar, toSnd, AR.map),
      chunksOf(perRow),
      AR.map(
        AR.map(([c, m]: [string, Matrix]) => [
          [headColor(c === ' ' ? '␠' : c), space, fence].join(space),
          ...AR.map(s => s + fence)(quadResWith(px)(m)),
        ]),
      ),
    );

    if (columns.length === 0) throw Error(`empty group: “${group}”`);

    const neaColumns = columns as NEA.NonEmptyArray<string[][]>;

    const chain = ([head, ...columns]: string[][]) =>
      FN.pipe(
        columns as Nes2,
        NEA.reduce(head as Nes, (acc, cur) =>
          FN.pipe(cur as Nes, zipRows(acc)),
        ),
      );

    return FN.pipe(
      neaColumns,
      NEA.chain(chain),
      addBefore([num(' ' + (idx + 1) + '. ') + roleColor(group)]),
      unlines,
    );
  };

/** Report of a single role at a width */
export const roleReport =
  (width: number): Binary<number, BitmapRole, string> =>
  (idx, role) =>
    groupReport(width)(idx, role)(reg.charsByRole(role));

/**
 * A report showing registered bitmaps and their glyphs, formatted
 * for the given width.
 *
 */
export const rolesReport: BinaryC<number, BitmapRole[], string> = width =>
  FN.flow(FN.pipe(width, roleReport, AR.mapWithIndex), unlines);
