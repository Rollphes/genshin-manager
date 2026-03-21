import type { AnchorFile } from '@/types'

/**
 * Anchor file for MonsterCurveExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const MonsterCurveExcelConfigData = {
  metadata: {
    sourceFile: 'MonsterCurveExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.495Z',
    totalElements: 200,
  },
  anchors: [
    {
      feature: {
        values: [1, 23, 45, 67, 89, 112, 134, 156, 178, 200],
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
        values: ['ARITH_MULTI', 'ARITH_ADD'],
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
          'GROW_CURVE_HP',
          'GROW_CURVE_ATTACK',
          'GROW_CURVE_DEFENSE',
          'GROW_CURVE_STRIKE',
          'GROW_CURVE_STRIKE_HURT',
          'GROW_CURVE_ELEMENT',
          'GROW_CURVE_KILL_EXP',
          'GROW_CURVE_HP_LITTLEMONSTER',
          'GROW_CURVE_MHP',
          'GROW_CURVE_MATK',
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
          0, 2.37, 15.479238, 55.51454, 179.63364, 319.89328, 580.103,
          1276.6016, 5003.6323, 16016.257,
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
