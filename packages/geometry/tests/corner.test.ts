import { corner } from '../index.js';

suite('corner', () => {
  test('basic', () => assert.equal(corner.bottomRight, 'bottomRight'));

  test('show', () => assert.equal(corner.show.show(corner.bottomLeft), '↙'));
});
