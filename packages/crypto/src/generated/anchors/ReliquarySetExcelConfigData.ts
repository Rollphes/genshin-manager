import type { AnchorFile } from '@/types'

/**
 * Anchor file for ReliquarySetExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const ReliquarySetExcelConfigData = {
  metadata: {
    sourceFile: 'ReliquarySetExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.507Z',
    totalElements: 62,
  },
  anchors: [
    {
      feature: {
        values: [2, 11, 17, 23, 29, 35, 41, 47, 53, 59],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'bagSortValue',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          210001, 210008, 214001, 215004, 215011, 215017, 215024, 215031,
          215037, 215044,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'equipAffixId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'UI_RelicIcon_10001_4',
          'UI_RelicIcon_10002_4',
          'UI_RelicIcon_10003_4',
          'UI_RelicIcon_10004_4',
          'UI_RelicIcon_10005_4',
          'UI_RelicIcon_10006_4',
          'UI_RelicIcon_10007_4',
          'UI_RelicIcon_10008_4',
          'UI_RelicIcon_10009_4',
          'UI_RelicIcon_10010_4',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'setIcon',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          10001, 10008, 14002, 15003, 15010, 15017, 15024, 15030, 15037, 15044,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'setId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          20412, 31432, 37452, 44422, 56140, 63120, 76340, 83330, 93432, 99350,
        ],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'containsList',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [4482, 4512, 4686, 5012, 5021, 5062, 5104, 5113, 5128, 5207],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'dungeonGroup',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [2, 4, 1, 3, 5],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'setNeedNum',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          150564555, 575390611, 930115270, 1407486230, 1817050462, 2202813275,
          2558816190, 3191443955, 3683910422, 4086792275,
        ],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'textList',
      ancestorKeys: [],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: [],
  excludedKeys: ['OMEBDNACFIA', 'disableFilter'],
} as unknown as AnchorFile
