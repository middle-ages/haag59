import { line } from './named/line.js';
import * as elbow from './named/elbow.js';
import * as classify from './named/classify.js';
import * as other from './named/other.js';
import * as double from './named/double.js';
import * as dash from './named/dash.js';
import * as types from './named/types.js';

export type { BasicGroup, ElbowGroup, LineGroup } from './named/types';

export const named = {
  line,
  dash: line.dash,
  ...classify,
  ...elbow,
  ...other,
  ...double,
  ...dash,
  ...types,
} as const;
