import { record as RC } from 'fp-ts';
import { hFlipEq, turnEq, invertEq, vFlipEq } from '../ops.js';
import { dash, matrixCriteria, weight, shift } from '../criteria.js';

export const relationDefs = {
  dash: {
    label: 'Increase in dashing level',
    criteria: dash,
  },

  hFlip: {
    label: 'Flip on vertical axis',
    criteria: matrixCriteria(hFlipEq),
  },

  invert: {
    label: 'Invert every pixel',
    note: 'Symmetric',
    criteria: matrixCriteria(invertEq),
  },

  shift: {
    label: 'Glyph translates top→down/left→right',
    criteria: shift,
  },

  turn: {
    label: 'Clockwise turn 90ᵒ',
    note: '∀ g⯈* ∈ turn : turn(turn(g))=g' + ' ∨ turn(turn(turn(turn(g))))=g',
    criteria: matrixCriteria(turnEq),
  },

  weight: {
    label: 'Glyph weight',
    criteria: weight,
  },

  vFlip: {
    label: 'Flip on horizontal axis',
    criteria: matrixCriteria(vFlipEq),
  },
} as const;

export const allRelationNames = RC.keys(relationDefs);
