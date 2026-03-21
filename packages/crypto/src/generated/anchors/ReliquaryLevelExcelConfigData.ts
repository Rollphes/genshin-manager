import type { AnchorFile } from '@/types'

/**
 * Anchor file for ReliquaryLevelExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const ReliquaryLevelExcelConfigData = {
  metadata: {
    sourceFile: 'ReliquaryLevelExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.506Z',
    totalElements: 101,
  },
  anchors: [
    {
      feature: {
        values: [600, 1800, 2975, 4050, 5350, 7500, 10125, 14075, 21350, 40675],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'exp',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [6, 8, 9, 11, 13, 14, 16, 18, 19, 21],
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
        values: [
          'FIGHT_PROP_HP',
          'FIGHT_PROP_HP_PERCENT',
          'FIGHT_PROP_ATTACK',
          'FIGHT_PROP_ATTACK_PERCENT',
          'FIGHT_PROP_DEFENSE',
          'FIGHT_PROP_DEFENSE_PERCENT',
          'FIGHT_PROP_CRITICAL',
          'FIGHT_PROP_CRITICAL_HURT',
          'FIGHT_PROP_CHARGE_EFFICIENCY',
          'FIGHT_PROP_HEAL_ADD',
        ],
        pattern: {
          depth: 3,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'propType',
      ancestorKeys: ['addProps'],
    },
    {
      feature: {
        values: [0.015, 0.115, 0.2, 0.302, 0.446, 45, 98.3, 206, 714, 4780],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'value',
      ancestorKeys: ['addProps'],
    },
  ],
  crossFileAnchors: [
    {
      feature: {
        values: [10],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'rank',
      ancestorKeys: [],
    },
  ],
  derivedAncestorKeys: ['addProps'],
  excludedKeys: [],
} as unknown as AnchorFile
