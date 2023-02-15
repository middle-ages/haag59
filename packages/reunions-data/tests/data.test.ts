import { runeMetadata } from '../index.js';

suite('reunions-data api', () => {
  const iut = runeMetadata();
  test('found stacks', () => assert.isAbove(iut.allStacks.length, 0));
});
