import type { AnchorFile } from '@/types'

/**
 * Anchor file for WeaponPromoteExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const WeaponPromoteExcelConfigData = {
  metadata: {
    sourceFile: 'WeaponPromoteExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.508Z',
    totalElements: 1660,
  },
  anchors: [
    {
      feature: {
        values: [
          5000, 10000, 15000, 20000, 25000, 30000, 35000, 45000, 55000, 65000,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'coinCost',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [1, 2, 3, 4, 5, 6],
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
        values: [15, 25, 30, 35],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'requiredPlayerLevel',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [20, 60, 70, 80, 90],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'unlockMaxLevel',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          11101, 11421, 11517, 12418, 13402, 13509, 14412, 14516, 15412, 15515,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'weaponPromoteId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [1, 2, 3, 5, 6, 8, 9, 14, 18, 27],
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
          112002, 112027, 112051, 112076, 112100, 112125, 114010, 114035,
          114059, 114084,
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
          'FIGHT_PROP_BASE_ATTACK',
          'FIGHT_PROP_CRITICAL',
          'FIGHT_PROP_CRITICAL_HURT',
          'FIGHT_PROP_CHARGE_EFFICIENCY',
          'FIGHT_PROP_ELEMENT_MASTERY',
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
        values: [11.7, 23.3, 31.1, 38.9, 51.9, 77.8, 97.3, 116.7, 129.7, 186.7],
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
  excludedKeys: [],
} as unknown as AnchorFile
