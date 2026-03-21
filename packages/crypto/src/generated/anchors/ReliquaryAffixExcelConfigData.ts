import type { AnchorFile } from '@/types'

/**
 * Anchor file for ReliquaryAffixExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const ReliquaryAffixExcelConfigData = {
  metadata: {
    sourceFile: 'ReliquaryAffixExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.504Z',
    totalElements: 350,
  },
  anchors: [
    {
      feature: {
        values: [101, 942, 953, 964, 970, 976, 982, 987, 993, 999],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'depotId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [2, 6, 20, 24, 29, 41, 45, 51, 55, 81],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'groupId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          101021, 201202, 301221, 401203, 501202, 946004, 956005, 964006,
          990001, 999004,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'id',
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
          'FIGHT_PROP_CHARGE_EFFICIENCY',
          'FIGHT_PROP_ELEMENT_MASTERY',
          'FIGHT_PROP_CRITICAL',
          'FIGHT_PROP_CRITICAL_HURT',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'propType',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          -500, 0.0204, 0.035, 0.0518, 0.1457, 4.72, 12.45, 17.51, 60.95,
          233333,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'propValue',
      ancestorKeys: [],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: [],
  excludedKeys: [],
} as unknown as AnchorFile
