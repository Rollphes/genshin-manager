import type { AnchorFile } from '@/types'

/**
 * Anchor file for AvatarCurveExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const AvatarCurveExcelConfigData = {
  metadata: {
    sourceFile: 'AvatarCurveExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.479Z',
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
          'GROW_CURVE_HP_S4',
          'GROW_CURVE_ATTACK_S4',
          'GROW_CURVE_HP_S5',
          'GROW_CURVE_ATTACK_S5',
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
          1, 2.073, 3.064, 4.055, 5.128, 6.142, 7.193, 8.196, 9.103, 11.629,
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
