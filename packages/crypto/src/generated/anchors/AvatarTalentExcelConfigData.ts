import type { AnchorFile } from '@/types'

/**
 * Anchor file for AvatarTalentExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const AvatarTalentExcelConfigData = {
  metadata: {
    sourceFile: 'AvatarTalentExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.481Z',
    totalElements: 702,
  },
  anchors: [
    {
      feature: {
        values: [
          552199, 583489951, 1048738031, 1482911911, 1981840967, 2432552951,
          2873233407, 3329834511, 3768701959, 4292322247,
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
        values: [
          'UI_Talent_S_Ayaka_01',
          'UI_Talent_S_Ayaka_02',
          'UI_Talent_U_Ayaka_02',
          'UI_Talent_S_Ayaka_03',
          'UI_Talent_U_Ayaka_01',
          'UI_Talent_S_Ayaka_04',
          'UI_Talent_S_Qin_01',
          'UI_Talent_S_Qin_02',
          'UI_Talent_U_Qin_02',
          'UI_Talent_S_Qin_03',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'icon',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          3246701, 444845485, 932884181, 1409813469, 1840111253, 2303227125,
          2757900205, 3322289317, 3843070253, 4293610749,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'JDKOMPNCEMO',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [1],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'mainCostItemCount',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [917, 1139, 1160, 1173, 1181, 1189, 5103, 5110, 5120, 5128],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'mainCostItemId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          1796785, 509053297, 952229337, 1397996209, 1789577793, 2256667785,
          2739862033, 3301468921, 3785958321, 4294085417,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'nameTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'Ayaka_Constellation_1',
          'Ayaka_Constellation_2',
          'Ayaka_Constellation_3',
          'Ayaka_Constellation_4',
          'Ayaka_Constellation_5',
          'Ayaka_Constellation_6',
          'Qin_Talent_1',
          'Qin_Talent_2',
          'Qin_Talent_3',
          'Qin_Talent_4',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'openConfig',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [26, 206, 336, 466, 586, 706, 826, 946, 1066, 1286],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'talentId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [-2, 0.006, 0.07, 0.22, 0.65, 1.56, 2.9, 10, 80, 20000],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'paramList',
      ancestorKeys: [],
    },
    {
      feature: {
        values: ['FIGHT_PROP_NONE', 'FIGHT_PROP_CHARGE_EFFICIENCY'],
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
        values: [0, 0.16],
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
  derivedAncestorKeys: ['addProps'],
  excludedKeys: ['HDNGDHLEEAM', 'IMPODJBGGNL', 'prevTalent'],
} as unknown as AnchorFile
