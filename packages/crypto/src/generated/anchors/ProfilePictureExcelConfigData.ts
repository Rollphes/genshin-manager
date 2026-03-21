import type { AnchorFile } from '@/types'

/**
 * Anchor file for ProfilePictureExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const ProfilePictureExcelConfigData = {
  metadata: {
    sourceFile: 'ProfilePictureExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.497Z',
    totalElements: 173,
  },
  anchors: [
    {
      feature: {
        values: [
          'UI_AvatarIcon_PlayerBoy_Circle',
          'UI_AvatarIcon_PlayerBoyCostumeCWXR_Circle',
          'UI_AvatarIcon_PlayerGirl_Circle',
          'UI_AvatarIcon_PlayerGirlCostumeCWXR_Circle',
          'UI_AvatarIcon_Ambor_Circle',
          'UI_AvatarIcon_AmborCostumeWic_Circle',
          'UI_AvatarIcon_Kaeya_Circle',
          'UI_AvatarIcon_KaeyaCostumeDancer_Circle',
          'UI_AvatarIcon_Lisa_Circle',
          'UI_AvatarIcon_LisaCostumeStudentin_Circle',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'iconPath',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'PROFILE_PICTURE_UNLOCK_BY_AVATAR',
          'PROFILE_PICTURE_UNLOCK_BY_COSTUME',
          'PROFILE_PICTURE_UNLOCK_BY_ITEM',
          'PROFILE_PICTURE_UNLOCK_BY_PARENT_QUEST',
          'PROFILE_PICTURE_UNLOCK_BY_DEFAULT',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'JEGELOLNAIG',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          2892052, 498925204, 1088293580, 1465870260, 1927929924, 2418667468,
          2814342260, 3452475956, 3881895660, 4284320332,
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
          8171504, 497819312, 873193968, 1198990800, 1809036520, 2338265744,
          2804141792, 3283007528, 3685571536, 4237267240,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'unlockDescTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          71045, 75151, 202701, 10000002, 10000033, 10000053, 10000071,
          10000091, 10000109, 10000128,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'unlockParam',
      ancestorKeys: [],
    },
  ],
  crossFileAnchors: [
    {
      feature: {
        values: [101, 707, 3301, 5201, 6901, 8601, 10101, 11703, 12101, 99901],
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
  ],
  derivedAncestorKeys: [],
  excludedKeys: ['CJDMIDNDMEI', 'PAJGCCHHAKF', 'PEJPIEAGKMG', 'priority'],
} as unknown as AnchorFile
