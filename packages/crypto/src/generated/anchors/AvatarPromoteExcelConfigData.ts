import type { AnchorFile } from '@/types'

/**
 * Anchor file for AvatarPromoteExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const AvatarPromoteExcelConfigData = {
  metadata: {
    sourceFile: 'AvatarPromoteExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.480Z',
    totalElements: 812,
  },
  anchors: [
    {
      feature: {
        values: [12, 32, 46, 58, 71, 84, 96, 107, 119, 999],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'avatarPromoteId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [''],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'promoteAudio',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [1, 5, 6],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'promoteLevel',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [20000, 40000, 60000, 80000, 100000, 120000],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'scoinCost',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [1, 2, 4, 6, 10, 12, 18, 20, 45, 60],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'count',
      ancestorKeys: ['costItems'],
    },
    {
      feature: {
        values: [
          100021, 101205, 101239, 104112, 104162, 112033, 112080, 113010,
          113049, 113085,
        ],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'id',
      ancestorKeys: ['costItems'],
    },
    {
      feature: {
        values: [
          'FIGHT_PROP_BASE_HP',
          'FIGHT_PROP_BASE_DEFENSE',
          'FIGHT_PROP_BASE_ATTACK',
          'FIGHT_PROP_CRITICAL_HURT',
          'FIGHT_PROP_HEAL_ADD',
          'FIGHT_PROP_ELEMENT_MASTERY',
          'FIGHT_PROP_ATTACK_PERCENT',
          'FIGHT_PROP_HP_PERCENT',
          'FIGHT_PROP_CHARGE_EFFICIENCY',
          'FIGHT_PROP_CRITICAL',
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
        values: [
          0.0462, 27.85263, 48.3075, 66.59509, 97.67325, 159.705, 243.9801,
          1450.4509, 2791.8455, 5011.0044,
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
      ancestorKeys: ['addProps'],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: ['NJMNABKGKIJ', 'addProps'],
  excludedKeys: ['requiredPlayerLevel', 'unlockMaxLevel'],
} as unknown as AnchorFile
