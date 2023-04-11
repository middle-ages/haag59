import { Lazy, Effect, Endo, Unary, FN, RA, STR } from 'commons';
import process from 'node:process';
import { splitLines, stringWidth } from 'tty-strings';
import { buildSize as SZ, Size } from './size.js';

const defaultSize = SZ(80, 20);

type Stdout = NodeJS.WriteStream & {
  fd: 1;
};

export const isTty: Lazy<boolean> = (() => {
  let cached: boolean | undefined = undefined;
  return () => {
    if (cached === undefined) cached = process?.stdout?.isTTY ?? false;
    return cached;
  };
})();

export const stdout: Lazy<Stdout | undefined> = (() => {
  let cached: Stdout | undefined = undefined;
  return () => {
    if (!isTty()) return undefined;
    if (cached === undefined) cached = process.stdout;
    return cached;
  };
})();

export const [resetTermWidth, termWidth]: [Effect<void>, Lazy<number>] =
  (() => {
    let cachedWidth: number | undefined = undefined;
    return [
      () => (cachedWidth = undefined),
      () => {
        if (cachedWidth === undefined)
          cachedWidth = stdout()?.columns ?? defaultSize.width;
        return cachedWidth;
      },
    ];
  })();

export const [resetTermHeight, termHeight]: [Effect<void>, Lazy<number>] =
  (() => {
    let cachedHeight: number | undefined = undefined;
    return [
      () => (cachedHeight = undefined),
      () => {
        if (cachedHeight === undefined)
          cachedHeight = stdout()?.rows ?? defaultSize.height;
        return cachedHeight;
      },
    ];
  })();

export const termSize: Lazy<Size> = () =>
  isTty() ? SZ(termWidth(), termHeight()) : defaultSize;

export const addResizeHandler: Unary<Effect<void>, Size> = () => {
  if (!isTty()) return defaultSize;
  process.stdout.on('resize', () => {
    resetTermWidth();
    resetTermHeight();
  });
  return termSize();
};

export const cropLine: Endo<string> = line => {
  const available = termWidth();
  const rem = available - stringWidth(line) - 1;
  return rem < 0 ? line.slice(0, available - 2) + '…' : line;
};

export const cropParagraph: Endo<string> = FN.flow(
  splitLines,
  RA.map(cropLine),
  STR.unlines,
);
