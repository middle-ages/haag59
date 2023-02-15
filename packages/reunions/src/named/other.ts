import { dir } from 'geometry';

const { direct } = dir;

export const tee = {
  ...direct('┴├┬┤'),
  thick: direct('┻┣┳┫'),
  double: direct('╩╠╦╣'),
} as const;

export const cross = '┼',
  space = ' ',
  solid = '█';
