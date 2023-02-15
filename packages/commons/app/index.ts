#!/usr/bin/env node

import { callWith, typedFromEntries } from '../index.js';
import { function as FN } from 'fp-ts';

const n: number = FN.pipe(
  'foo',
  callWith(s => t => (s + t).length),
);

console.log('util demo got ', n);

console.log(
  'util demo got ',
  typedFromEntries([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]),
);
