import { Binary, Effect, Tuple3 } from 'commons';
import { cachedStack } from '../../index.js';

const testStack: Effect<string> = stack => {
  const [fst, snd, stacked] = Array.from(
    stack.replaceAll(' ', ''),
  ) as Tuple3<string>;

  test(stack, () => assert.deepEqual(cachedStack([fst, snd]), stacked));
};

const stackSuite: Binary<string, string[], void> = (name, stacks) => {
  suite(name, () => {
    for (const stack of stacks) testStack(stack);
  });
};

suite('cachedStack', () => {
  testStack('← → ↔');

  stackSuite('thin', ['┼ ┴ ┼', '└ ┌ ├']);

  stackSuite('thick', ['┛ ┗ ┻', '┓ ┏ ┳', '┓ ┛ ┫']);

  stackSuite('halfSolid', ['▖ ▐ ▟', '▖ ▝ ▞', '▗ ▘ ▚', '█ █ █', '▌ ▝ ▛']);

  stackSuite('double', ['╗ ╔ ╦', '╗ ║ ╣', '═ ║ ╬']);

  stackSuite('double-single', ['╜ ╙ ╨', '╖ ║ ╢', '═ ─ ━']);

  stackSuite('dash', ['┈ ┊ ┼', '┅ ┊ ┿', '╸ ╎ ┥']);

  stackSuite('double as thick', ['╗ ┌ ┱']);

  stackSuite('dash and double as thick', ['┈ ║ ╫', '┅ ║ ╋', '┈ ═ ━', '╗ ┴ ╅']);
});
