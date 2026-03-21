import type { AnchorFile } from '@/types'

/**
 * Anchor file for EquipAffixExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const EquipAffixExcelConfigData = {
  metadata: {
    sourceFile: 'EquipAffixExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.482Z',
    totalElements: 1274,
  },
  anchors: [
    {
      feature: {
        values: [
          1113010, 1114281, 1124012, 1125043, 1134260, 1144021, 1145043,
          1154074, 1155110, 2150441,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'affixId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          243001, 434906769, 928696521, 1403347537, 1876022129, 2488158001,
          2941725569, 3379277113, 3828553473, 4292321513,
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
          111301, 111429, 112406, 113303, 113509, 114427, 115403, 115509,
          215011, 215044,
        ],
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
        values: [0, 1, 2, 3, 4],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'level',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          1914259, 529466347, 1016634707, 1443191355, 1934855067, 2396964763,
          2853296811, 3312747755, 3845860995, 4292461651,
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
          'Weapon_Sword_DamageUpToEnemy',
          'Weapon_Sword_FullHPCriticUp',
          'Weapon_Sword_OnGainEnergyHealHP',
          'Weapon_Sword_AttacktUpAfterReaction',
          'Weapon_Sword_ExtraDamageWhenCDReady',
          'Weapon_Sword_MoveSpeedAfterULT',
          'Weapon_Sword_GenerateBallWhenCritic',
          'Weapon_Sword_MusicBlast',
          'Weapon_Sword_ResetCDWhenSkillHit',
          'Weapon_Sword_CritUpWhenHitNoCrit',
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
        values: [-5, 0.018, 0.075, 0.245, 0.56, 1.4, 5, 30, 126, 80000],
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
        values: [
          'FIGHT_PROP_NONE',
          'FIGHT_PROP_ATTACK_PERCENT',
          'FIGHT_PROP_CRITICAL',
          'FIGHT_PROP_ADD_HURT',
          'FIGHT_PROP_SHIELD_COST_MINUS_RATIO',
          'FIGHT_PROP_HP_PERCENT',
          'FIGHT_PROP_DEFENSE_PERCENT',
          'FIGHT_PROP_CRITICAL_HURT',
          'FIGHT_PROP_CHARGE_EFFICIENCY',
          'FIGHT_PROP_HEAL_ADD',
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
        values: [0, 0.08, 0.14, 0.19, 0.24, 0.31, 0.42, 80, 120, 1000],
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
  excludedKeys: [],
} as unknown as AnchorFile
