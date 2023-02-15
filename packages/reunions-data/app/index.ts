#!/usr/bin/env node

import { function as FN } from 'fp-ts';
import { string as STRs } from 'fp-ts-std';
import { writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { cartesian, denseCartesian, EntryReport } from 'reunions';
import { runeMetadata } from '../index.js';
import { fileURLToPath } from 'url';

const outDir = FN.pipe(import.meta.url, fileURLToPath, dirname, dirname);

const allStacksFile = 'all-stacks',
  unquotedStacksFile = 'all-stacks-unquoted',
  stackTableFile = 'stack-table',
  denseStackTableFile = 'stack-table-dense';

console.log(`Writing to “${outDir}”`);

console.log('1. Computing stack table...');

const meta = runeMetadata();
const chars = meta.chars.sort();

const table = cartesian(chars);

console.log('2. Done computing stack table, computing secondary tables...');

const dense = denseCartesian(chars);

console.log(
  '3. Computed secondary tables, writing to: ' +
    [stackTableFile, denseStackTableFile].map(s => `“${s}.csv”`).join(', ') +
    '...',
);

writeCsv(stackTableFile, table);
writeCsv(denseStackTableFile, dense);

console.log('4. Wrote stack tables, computing all stacks...');

const rawStacks: EntryReport[] = meta.allStacks;
const allStacks = rawStacks.map(({ entry: [pair, result] }) => [
  ...pair,
  result,
]);

console.log(
  '5. Computed stacks, writing to: ' +
    [allStacksFile, unquotedStacksFile].map(s => `“${s}.csv”`).join(', ') +
    '...',
);

writeCsv(allStacksFile, allStacks);
writeUnquoted(unquotedStacksFile, allStacks);

console.log('6. Done.');

function writeCsv(file: string, rows: string[][]) {
  const path = resolve(join(outDir, file) + '.csv');
  const data = rows.map(row => row.map(quote).join(','));
  writeFileSync(path, STRs.unlines(data));
}

function writeUnquoted(file: string, rows: string[][]) {
  const path = resolve(join(outDir, file) + '.csv');
  const data = rows.map(row => row.join(','));
  writeFileSync(path, STRs.unlines(data));
}

function quote(s: string) {
  return STRs.surround('"')(s);
}
