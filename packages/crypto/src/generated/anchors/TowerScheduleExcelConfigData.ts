import type { AnchorFile } from '@/types'

/**
 * Anchor file for TowerScheduleExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const TowerScheduleExcelConfigData = {
  metadata: {
    sourceFile: 'TowerScheduleExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.507Z',
    totalElements: 117,
  },
  anchors: [
    {
      feature: {
        values: [
          53235487, 419672767, 993151919, 1465384935, 2276053711, 2551583663,
          3051104791, 3510009159, 3924112607, 4259560751,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'buffnameTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          '2026-03-16 03:59:59',
          '2026-04-16 03:59:59',
          '2020-07-16 03:59:59',
          '2020-08-01 03:59:59',
          '2020-08-16 03:59:59',
          '2020-09-01 03:59:59',
          '2020-09-16 03:59:59',
          '2020-10-01 03:59:59',
          '2020-10-16 03:59:59',
          '2020-11-01 03:59:59',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'closeTime',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          82380656, 986211144, 1409908576, 1736202520, 2230482944, 2564034920,
          2999855096, 3465524848, 3845562320, 4242716288,
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
          'UI_TowerBlessing_102',
          'UI_TowerBlessing_100',
          'UI_TowerBlessing_1',
          'UI_TowerBlessing_2',
          'UI_TowerBlessing_3',
          'UI_TowerBlessing_5',
          'UI_TowerBlessing_6',
          'UI_TowerBlessing_7',
          'UI_TowerBlessing_8',
          'UI_TowerBlessing_9',
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
        values: [1050, 1366, 1611, 1695, 1741, 1799, 1909, 1973, 2058, 2147],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'monthlyLevelConfigId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [14, 25, 37, 48, 60, 71, 83, 94, 106, 117],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'scheduleId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'entranceFloorId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          '2026-02-16 04:00:00',
          '',
          '2026-03-16 04:00:00',
          '2020-07-01 00:00:00',
          '2020-07-16 04:00:00',
          '2020-08-01 04:00:00',
          '2020-08-16 04:00:00',
          '2020-09-01 04:00:00',
          '2020-09-16 04:00:00',
          '2020-10-01 04:00:00',
        ],
        pattern: {
          depth: 3,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'CNEPANEPOJP',
      ancestorKeys: ['GKCJOLEGMFL'],
    },
    {
      feature: {
        values: [40, 60, 80, 100, 120],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'FBMPIOKMKDC',
      ancestorKeys: ['OIIBKDGAALE'],
    },
    {
      feature: {
        values: [0],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'rewardId',
      ancestorKeys: ['OIIBKDGAALE'],
    },
    {
      feature: {
        values: [1009, 1022, 1035, 1048, 1061, 1073, 1086, 1099, 1112, 1125],
        pattern: {
          depth: 4,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 2,
        },
      },
      correctKey: 'BGLBFBNCABE',
      ancestorKeys: ['GKCJOLEGMFL'],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: ['GKCJOLEGMFL', 'OIIBKDGAALE'],
  excludedKeys: ['FENAHHGECIE', 'NEKBHDKPNKG', 'rewardGroup'],
} as unknown as AnchorFile
