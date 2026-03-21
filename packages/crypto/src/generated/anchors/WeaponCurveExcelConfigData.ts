import type { AnchorFile } from '@/types'

/**
 * Anchor file for WeaponCurveExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const WeaponCurveExcelConfigData = {
  metadata: {
    sourceFile: 'WeaponCurveExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.507Z',
    totalElements: 100,
  },
  anchors: [
    {
      feature: {
        values: [1, 12, 23, 34, 45, 56, 67, 78, 89, 100],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'level',
      ancestorKeys: [],
    },
    {
      feature: {
        values: ['ARITH_MULTI'],
        pattern: {
          depth: 3,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'arith',
      ancestorKeys: ['curveInfos'],
    },
    {
      feature: {
        values: [
          'GROW_CURVE_ATTACK_101',
          'GROW_CURVE_ATTACK_102',
          'GROW_CURVE_ATTACK_103',
          'GROW_CURVE_ATTACK_104',
          'GROW_CURVE_ATTACK_105',
          'GROW_CURVE_CRITICAL_101',
          'GROW_CURVE_ATTACK_201',
          'GROW_CURVE_ATTACK_202',
          'GROW_CURVE_ATTACK_203',
          'GROW_CURVE_ATTACK_204',
        ],
        pattern: {
          depth: 3,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'type',
      ancestorKeys: ['curveInfos'],
    },
    {
      feature: {
        values: [
          1, 1.942, 2.84, 3.637, 4.439, 5.243, 6.156, 7.147, 8.585, 12.552,
        ],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'value',
      ancestorKeys: ['curveInfos'],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: ['curveInfos'],
  excludedKeys: [],
} as unknown as AnchorFile
