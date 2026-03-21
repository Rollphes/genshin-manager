import type { AnchorFile } from '@/types'

/**
 * Anchor file for FettersExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const FettersExcelConfigData = {
  metadata: {
    sourceFile: 'FettersExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.486Z',
    totalElements: 8466,
  },
  anchors: [
    {
      feature: {
        values: [
          10000002, 10000024, 10000038, 10000051, 10000064, 10000076, 10000089,
          10000101, 10000114, 10000128,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'avatarId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          1002, 9133, 22032, 39027, 61004, 74030, 87048, 100062, 114007, 128090,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'fetterId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [false, true],
        pattern: {
          depth: 1,
          valueType: 'boolean',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'isHiden',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [1, 2],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'type',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          '24001',
          '25001',
          '26001',
          '37001',
          '31001',
          '56001',
          '64001',
          '66001',
          '11001',
          '67001',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'voiceFile',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          113959, 478989815, 962825879, 1444954879, 1901802767, 2398437439,
          2870784511, 3347908519, 3835980183, 4294129383,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'voiceFileTextTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          21442, 506274730, 979815466, 1453265266, 1926434434, 2405243810,
          2888148346, 3356244890, 3828765658, 4294831130,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'voiceTitleLockedTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          889703, 473062767, 936372199, 1434075991, 1913693831, 2388978951,
          2852711951, 3338736903, 3817091607, 4294729207,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'voiceTitleTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          640, 488093736, 968285255, 1435240520, 1918963224, 2396024328,
          2874346986, 3350382223, 3818433575, 4294963040,
        ],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'tips',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'FETTER_COND_UNLOCK_TRANS_POINT',
          'FETTER_COND_NONE',
          'FETTER_COND_FINISH_QUEST',
          'FETTER_COND_FINISH_PARENT_QUEST',
          'FETTER_COND_FETTER_LEVEL',
          'FETTER_COND_PLAYER_BIRTHDAY',
          'FETTER_COND_AVATAR_PROMOTE_LEVEL',
        ],
        pattern: {
          depth: 3,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'condType',
      ancestorKeys: ['openConds'],
    },
    {
      feature: {
        values: [
          1, 204, 501, 1516, 5029, 14012, 15038, 200212, 1100811, 7303208,
        ],
        pattern: {
          depth: 4,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 2,
        },
      },
      correctKey: 'paramList',
      ancestorKeys: ['openConds'],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: ['openConds'],
  excludedKeys: ['hideCostumeList', 'showCostumeList'],
} as unknown as AnchorFile
