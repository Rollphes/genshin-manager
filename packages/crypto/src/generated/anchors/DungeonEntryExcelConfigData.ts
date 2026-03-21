import type { AnchorFile } from '@/types'

/**
 * Anchor file for DungeonEntryExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const DungeonEntryExcelConfigData = {
  metadata: {
    sourceFile: 'DungeonEntryExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.482Z',
    totalElements: 146,
  },
  anchors: [
    {
      feature: {
        values: ['LOGIC_NONE', 'LOGIC_OR'],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'condComb',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          15951913, 485860713, 899789897, 1399948745, 1972150497, 2432468609,
          2811700257, 3225616529, 3793477353, 4245884321,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'descTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [38, 119, 274, 361, 505, 656, 803, 1142, 1450, 1919],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'dungeonEntryId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [2, 34, 1012, 1025, 1039, 1053, 1066, 1080, 1097, 1111],
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
          456001, 456002, 456003, 456005, 456006, 456007, 456008, 456010,
          456011, 456012,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'JACJILGOEHN',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'UI_DungeonPic_Cubic_Normal',
          'UI_DungeonPic_Water',
          'UI_DungeonPic_Thunder',
          'UI_DungeonPic_HuZhongTian',
          'UI_DungeonPic_Cubic_Normal_1',
          'UI_DungeonPic_Cubic_Normal_2',
          'UI_DungeonPic_Cubic_Normal_3',
          'UI_DungeonPic_Cubic_Normal_4',
          'UI_DungeonPic_Ice',
          'UI_DungeonPic_Fire',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'picPath',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          220402, 220406, 220410, 220415, 220419, 220422, 220426, 220430,
          220434, 220438,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'rewardDataId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [100],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'sceneId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'DUNGEN_ENTRY_TYPE_RELIQUARY',
          'DUNGEN_ENTRY_TYPE_WEAPON_PROMOTE',
          'DUNGEON_ENTRY_TYPE_NORMAL',
          'DUNGEN_ENTRY_TYPE_AVATAR_TALENT',
          'DUNGEON_ENTRY_TYPE_OBSCURAE',
          'DUNGEON_ENTRY_TYPE_TRIAL',
          'DUNGEON_ENTRY_TYPE_EFFIGY',
          'DUNGEON_ENTRY_TYPE_FLEUR_FAIR',
          'DUNGEON_ENTRY_TYPE_CHANNELLER_SLAB_ONE_OFF',
          'DUNGEON_ENTRY_TYPE_CHANNELLER_SLAB_LOOP',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'type',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [103, 132, 169, 2158, 4065, 7604, 8106, 9154, 9602, 10759],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'cooldownTipsDungeonId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          104301, 104317, 104334, 104351, 114003, 114019, 114035, 114052,
          114068, 114084,
        ],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 2,
        },
      },
      correctKey: 'descriptionCycleRewardList',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [10, 35802, 20],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'param1',
      ancestorKeys: ['satisfiedCond'],
    },
    {
      feature: {
        values: [
          'DUNGEON_ENTRY_CONDITION_NONE',
          'DUNGEON_ENTRY_CONDITION_LEVEL',
          'DUNGEON_ENTRY_CONDITION_QUEST',
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
      ancestorKeys: ['satisfiedCond'],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: ['satisfiedCond'],
  excludedKeys: [
    'EMDNOABEHGE',
    'KBBHAICJJFK',
    'MIAGGFBEDLN',
    'isDefaultOpen',
    'isShowInAdvHandbook',
    'param2',
    'systemOpenUiId',
  ],
} as unknown as AnchorFile
