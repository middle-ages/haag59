import { function as FN } from 'fp-ts';
import {
  HSpacing,
  size as SZ,
  spacing as SP,
  Spacing,
  VSpacing,
  align as AL,
  Align,
  HAlign,
  VAlign,
} from '../index.js';

const target = {
  top: 2,
  right: 4,
  bottom: 17,
  left: 9,
};

const vEmpty = { top: 0, bottom: 0 };

const [hIut, vIut] = [AL.subWidthFromSpacing, AL.subHeightFromSpacing];

const testHAlign = (width: number) => (hAlign: HAlign, expect: HSpacing) =>
    test(AL.hAlignSym[hAlign], () =>
      assert.deepEqual(hIut(target, hAlign, width), { ...target, ...expect }),
    ),
  testVAlign = (height: number) => (vAlign: VAlign, expect: VSpacing) =>
    test(AL.vAlignSym[vAlign], () =>
      assert.deepEqual(vIut(target, vAlign, height), {
        ...target,
        ...expect,
      }),
    );

suite('align basic', () => {
  suite('sub*FromSpacing', () => {
    suite('height', () => {
      test('height=0 ⇒ Δ=0', () =>
        assert.deepEqual(vIut(target, 'top', 0), target));

      suite('height > top + bottom', () => {
        const testAlign = (vAlign: VAlign) =>
          testVAlign(20)(vAlign, { ...target, ...vEmpty });
        AL.mapVAlign(testAlign);
      });

      suite('height=2', () => {
        const testAlign = testVAlign(2);
        testAlign('top', { top: 0, bottom: 17 });
        testAlign('middle', { top: 1, bottom: 16 });
        testAlign('bottom', { top: 2, bottom: 15 });
      });

      suite('height=8', () => {
        const testAlign = testVAlign(8);
        testAlign('top', { top: 0, bottom: 11 });
        testAlign('middle', { top: 0, bottom: 11 });
        testAlign('bottom', { top: 2, bottom: 9 });
      });

      suite('height=17', () => {
        const testAlign = testVAlign(17);
        testAlign('top', { top: 0, bottom: 2 });
        testAlign('middle', { top: 0, bottom: 2 });
        testAlign('bottom', { top: 2, bottom: 0 });
      });

      suite('height = top + bottom', () => {
        const testAlign = (vAlign: VAlign) =>
          testVAlign(19)(vAlign, { ...target, ...vEmpty });
        AL.mapVAlign(testAlign);
      });
    });

    suite('width', () => {
      test('width=0 ⇒ Δ=0', () =>
        assert.deepEqual(hIut(target, 'left', 0), target));

      suite('width = right ∧ width < left + right ', () => {
        const testAlign = testHAlign(4);
        testAlign('left', { left: 5, right: 4 });
        testAlign('center', { left: 7, right: 2 });
        testAlign('right', { left: 9, right: 0 });
      });
    });
  });

  suite('shrinkSpacing', () => {
    const testShrink =
      (width: number, height: number) => (align: Align, expect: Spacing) => {
        const size = SZ(width, height);
        test(AL.show.show(align) + ' ' + SZ.show.show(size), () =>
          assert.deepEqual(
            FN.pipe(target, AL.shrinkSpacing(align)(size)),
            expect,
          ),
        );
      };

    testShrink(0, 0)(AL.center, target);
    testShrink(13, 19)(AL.topLeft, SP.empty);

    suite('both', () => {
      const testHalf = testShrink(6, 9);

      testHalf(AL.topLeft, {
        top: 0,
        right: 4,
        bottom: 10,
        left: 3,
      });

      testHalf(AL.middleCenter, {
        top: 0,
        right: 1,
        bottom: 10,
        left: 6,
      });

      testHalf(AL.BR, {
        top: 2,
        right: 0,
        bottom: 8,
        left: 7,
      });
    });

    suite('all', () => {
      testShrink(13, 19)(AL.MC, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      });
    });
  });
});
