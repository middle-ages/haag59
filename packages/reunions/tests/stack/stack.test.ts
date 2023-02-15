import { BinaryC, Pair, Unary } from 'commons';
import {
  array as AR,
  function as FN,
  option as OP,
  string as STR,
} from 'fp-ts';
import { bitmapRegistry as reg, tryStacks } from '../../index.js';

const checkStackWith = (snd: string) => (fst: string, expect: string) => {
  test(`“${fst}” ⊕ “${snd}” = “${expect}”`, () =>
    assert.deepEqual(tryStacks([fst, snd]), OP.some(expect)));
};

const checkTupled: BinaryC<string, string, void> = fst => rest =>
  FN.pipe(
    rest,
    STR.split(/\s+/) as Unary<string, Pair<string>>,
    FN.pipe(fst, checkStackWith, FN.tupled),
  );

const checkN = FN.flow(checkTupled, AR.map);

const check = (char: string, cases: string[]) =>
  suite(`stack with “${char}”`, () => void FN.pipe(cases, checkN(char)));

suite('bitmap stack', () => {
  suite('stack', () => {
    const fiveElbows = FN.pipe('elbow', reg.charsByRole, AR.takeLeft(5));

    suite('∀g ∈ glyphs: “█” ⊕ g = “█”', () => {
      for (const char of fiveElbows) checkStackWith('█')(char, '█');
    });

    suite('∀g ∈ glyphs: “ ” ⊕ g = g', () => {
      for (const char of fiveElbows) checkStackWith(' ')(char, char);
    });

    suite('∀g ∈ glyphs: g ⊕ g = g', () => {
      for (const char of [' ', '█', ...fiveElbows])
        checkStackWith(char)(char, char);
    });

    checkStackWith('╵')('╷', '│');
    checkStackWith('│')('─', '┼');
    checkStackWith('┿')('╄', '╇');
    checkStackWith('▖')('▘', '▌');
    checkStackWith('╸')('╺', '━');

    check('▛', ['▗ █', '▚ █', '▄ █', '▐ █', '▖ ▛', '▝ ▛', '▘ ▛', '▀ ▛', '▌ ▛']);

    check('═', ['║ ╬', '╚ ╩', '┶ ┷', '│ ╪', '─ ━', '┼ ┿', '━ ━', '╾ ━']);

    check('▌', ['▗ ▙', '▝ ▛', '▄ ▙']);

    check('┕', ['└ ┕', '╘ ┕', '┗ ┗', '┖ ┗', '╚ ┗', '┑ ┿', '┍ ┝', '┃ ┣']);
  });
});
