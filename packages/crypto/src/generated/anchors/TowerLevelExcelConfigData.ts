import type { AnchorFile } from '@/types'

/**
 * Anchor file for TowerLevelExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const TowerLevelExcelConfigData = {
  metadata: {
    sourceFile: 'TowerLevelExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.507Z',
    totalElements: 375,
  },
  anchors: [
    {
      feature: {
        values: [3100, 3142, 3183, 3225, 3266, 3384, 3479, 3575, 3616, 3658],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'dungeonId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          621001, 621005, 621009, 621013, 621017, 621020, 621024, 621028,
          621032, 621036,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'firstPassRewardId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [126, 154, 181, 209, 237, 264, 292, 320, 347, 375],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'levelId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          '',
          'Tower4_4',
          'Tower4_5',
          'Tower4_6',
          'Tower4_7',
          'Tower4_8',
          'Tower5_0',
          'Tower5_1',
          'Tower5_2',
          'Tower5_3',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'NGICMJPHIAP',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'PT1',
          'PT2',
          'PT3',
          'PT4',
          'PT5',
          'PT6',
          'PT7',
          'PT8',
          'PT9',
          'PT10',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'NGICMJPHIAP',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          105, 601, 10304, 40102, 40607, 40651, 60901, 60906, 60910, 61801,
        ],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'firstMonsterList',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          115, 407, 514, 20601, 40104, 40658, 40801, 50904, 60507, 61301,
        ],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'secondMonsterList',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          '4:100,23:100,24:100',
          '25:100,28:100,29:100',
          '6:100,7:100,18:100,35:100',
          '20:100,21:100',
          '6:100,7:100,17:100,38:100,31:100,34:100',
          '19:100',
          '1:100,2:100,3:100,21:100,24:100',
          '16:100,35:100,36:100,17:100',
          '6:100,7:100,18:100',
          '6:100,7:100,38:100,34:100',
        ],
        pattern: {
          depth: 2,
          valueType: 'string',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'towerBuffConfigStrList',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'TOWER_COND_CHALLENGE_LEFT_TIME_MORE_THAN',
          'TOWER_COND_LEFT_HP_GREATER_THAN',
        ],
        pattern: {
          depth: 3,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'towerCondType',
      ancestorKeys: ['conds'],
    },
    {
      feature: {
        values: [2],
        pattern: {
          depth: 4,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 2,
        },
      },
      correctKey: 'argumentList',
      ancestorKeys: ['conds'],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: ['conds'],
  excludedKeys: [
    'ILGPGFCLCCO',
    'MHGAHJONLPG',
    'OAALEPMNGIH',
    'argumentListUpper',
    'levelGroupId',
    'levelIndex',
    'monsterLevel',
  ],
} as unknown as AnchorFile
