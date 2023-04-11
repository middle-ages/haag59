import { showCorner } from '../index.js';

suite('corner', () => {
  test('show', () => assert.equal(showCorner.show('bottomLeft'), '↙'));
});
