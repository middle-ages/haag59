import { direct } from 'geometry';

export const tee = {
  ...direct('┴├┬┤'),
  thick: direct('┻┣┳┫'),
  double: direct('╩╠╦╣'),
} as const;

export const cross = '┼',
  space = ' ',
  solid = '█';
