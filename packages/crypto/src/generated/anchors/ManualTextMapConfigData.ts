import type { AnchorFile } from '@/types'

/**
 * Anchor file for ManualTextMapConfigData.
 * Auto-generated - do not edit manually.
 */
export const ManualTextMapConfigData = {
  metadata: {
    sourceFile: 'ManualTextMapConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.488Z',
    totalElements: 35781,
  },
  anchors: [
    {
      feature: {
        values: [
          183103, 461703217, 936907842, 1419660056, 1897447449, 2382199290,
          2864787172, 3354273527, 3820766787, 4294773887,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'textMapContentTextMapHash',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'FightPropType',
          'EquipType',
          'Textmap_0_9_5',
          'Topic_LvUp',
          'Hint_CanNotTakeOffWeapon',
          'Hint_NotEnoughLevel',
          'INFO_OrigamiSquirrel_Shoot_Energy',
          'INFO_OrigamiSquirrel_Return_Energy',
          'INFO_AVATAR_Building_Block_Shoot_Energy',
          'INFO_Flying_Squirrel_FlyEnergy',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'textMapId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'FIGHT_PROP_BASE_HP',
          'FIGHT_PROP_HP',
          'FIGHT_PROP_HP_PERCENT',
          'FIGHT_PROP_BASE_ATTACK',
          'FIGHT_PROP_ATTACK',
          'FIGHT_PROP_ATTACK_PERCENT',
          'FIGHT_PROP_BASE_DEFENSE',
          'FIGHT_PROP_DEFENSE',
          'FIGHT_PROP_DEFENSE_PERCENT',
          'FIGHT_PROP_BASE_SPEED',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'textMapId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'TEXT_PARAM_NONE',
          'TEXT_PARAM_AVATAR_NAME',
          'TEXT_PARAM_ROUTINE_TYPE',
        ],
        pattern: {
          depth: 2,
          valueType: 'string',
          isEnum: true,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'paramTypes',
      ancestorKeys: [],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: [],
  excludedKeys: [],
} as unknown as AnchorFile
