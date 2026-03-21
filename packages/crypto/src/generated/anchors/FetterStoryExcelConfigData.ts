import type { AnchorFile } from '@/types'

/**
 * Anchor file for FetterStoryExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const FetterStoryExcelConfigData = {
  metadata: {
    sourceFile: 'FetterStoryExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.483Z',
    totalElements: 902,
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
          1200, 13205, 31201, 52205, 65202, 77207, 90203, 102207, 115203,
          172008,
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
        values: [false],
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
        values: [
          1179183, 497726207, 931116351, 1409101831, 1830047463, 2305412911,
          2711629559, 3270418255, 3818227759, 4285788791,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'storyContext2TextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          10152, 386305720, 900718008, 1392266432, 1827254864, 2378144488,
          2785402296, 3266982936, 3777782984, 4293556704,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'storyContextTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          18558109, 517858181, 922018341, 1431059189, 1946145525, 2394590445,
          2791452557, 3308392461, 3810706477, 4291915965,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'storyTitle2TextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          8673908, 408068220, 913657300, 1396329364, 1904523228, 2314366484,
          2781014332, 3308818188, 3762556316, 4294778220,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'storyTitleLockedTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          11094758, 531558534, 1033390638, 1533525070, 2098811214, 2589364766,
          3036117062, 3432311374, 3817998830, 4292184062,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'storyTitleTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          1382684, 496295633, 984543476, 1460763556, 1960858297, 2461718932,
          2956256396, 3385628833, 3854477436, 4292322564,
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
          'FETTER_COND_NOT_OPEN',
          'FETTER_COND_NONE',
          'FETTER_COND_FETTER_LEVEL',
          'FETTER_COND_FINISH_QUEST',
          'FETTER_COND_FINISH_PARENT_QUEST',
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
      ancestorKeys: ['finishConds'],
    },
    {
      feature: {
        values: [
          2, 2021, 4025, 13022, 14030, 46618, 200212, 1011306, 1201812, 4022408,
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
  derivedAncestorKeys: ['finishConds', 'openConds'],
  excludedKeys: [],
} as unknown as AnchorFile
