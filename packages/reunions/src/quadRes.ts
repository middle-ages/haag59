import { array as AR, function as FN, option as OP } from 'fp-ts';
import { array as ARs } from 'fp-ts-std';
import { flattenPair, Pair, BinaryC, Endo, Unary, chunk4x } from 'commons';
import { Matrix, Px } from './data.js';

const { join } = ARs;

/** Show a matrix more efficiently using half-character pixels */
export const quadResWith: BinaryC<Endo<string>, Matrix, string[]> =
  pixelColor => bm => {
    const foldPx = OP.fold(
      () => 'F',
      px => (px === '#' ? 'T' : 'F'),
    );

    const quadToGlyph = {
      FFFF: ' ',
      FFFT: '▗',
      FFTF: '▝',
      FFTT: '▐',
      FTFF: '▖',
      FTFT: '▄',
      FTTF: '▞',
      FTTT: '▟',
      TFFF: '▘',
      TFFT: '▚',
      TFTF: '▀',
      TFTT: '▜',
      TTFF: '▌',
      TTFT: '▙',
      TTTF: '▛',
      TTTT: '█',
    } as const;

    const quadMapper: Unary<Pair<Pair<OP.Option<Px>>>[], string> = FN.flow(
      AR.map(
        FN.flow(
          flattenPair,
          AR.map(foldPx),
          join(''),
          q => quadToGlyph[q as keyof typeof quadToGlyph] ?? `?`,
          pixelColor,
        ),
      ),
      join(''),
    );

    return FN.pipe(bm, chunk4x, AR.map(quadMapper));
  };

export const quadRes: Unary<Matrix, string[]> = quadResWith(FN.identity);
