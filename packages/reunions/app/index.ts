#!/usr/bin/env node

import { term } from 'geometry';
import { bitmapRegistry, BitmapRole, rolesReport } from '../index.js';

/**
 * Show all registered characters and their bitmaps by role
 *
 * With no arguments, shows all character bitmaps in every box drawing character
 * role.
 *
 * If given a command separated list of such roles, they will be the only roles shown.
 *
 * If given `-h` shows the names of all roles.
 *
 * Example:
 *
 * ```txt
 * ## show elbow and hLine characters with their bitmaps
 * > ts-node-esm app/index.ts elbow,hLine
 * ```
 */

const allRoles: BitmapRole[] = bitmapRegistry.roles;

if (process.argv[2] === '-h') {
  console.log('All box drawing character roles: ' + allRoles.join(','));
  process.exit();
}

const width = term.termWidth();

const roles =
  process.argv[2] !== undefined
    ? (process.argv[2].split(',') as BitmapRole[])
    : allRoles;

const report = rolesReport(width)(roles);

console.log(report);
