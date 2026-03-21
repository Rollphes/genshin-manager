import type { AnchorFile } from '@/types'

/**
 * Anchor file for AvatarSkillDepotExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const AvatarSkillDepotExcelConfigData = {
  metadata: {
    sourceFile: 'AvatarSkillDepotExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.480Z',
    totalElements: 159,
  },
  anchors: [
    {
      feature: {
        values: [20000],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'attackModeSkill',
      ancestorKeys: [],
    },
    {
      feature: {
        values: ['None', 'Ousia', 'Pneuma', 'Furina'],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'CBPCNNNEDMH',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          10014, 10225, 10373, 10505, 10643, 10785, 10935, 11095, 11265, 111757,
        ],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'energySkill',
      ancestorKeys: [],
    },
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
    {
      feature: {
        values: [211, 1000, 1050, 1300, 1400, 1481, 1560, 2011, 2211, 2311],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'leaderTalent',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'Avatar_Player_AbilityGroup_Boy_Common',
          'Avatar_Player_AbilityGroup_Boy_Fire',
          'Avatar_Player_AbilityGroup_Boy_Water',
          'Avatar_Player_AbilityGroup_Boy_Wind',
          'Avatar_Player_AbilityGroup_Boy_Rock',
          'Avatar_Player_AbilityGroup_Boy_Electric',
          'Avatar_Player_AbilityGroup_Boy_Grass',
          'Avatar_Player_AbilityGroup_Girl_Common',
          'Avatar_Player_AbilityGroup_Girl_Fire',
          'Avatar_Player_AbilityGroup_Girl_Water',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'skillDepotAbilityGroup',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'Talent_Ayaka',
          'Talent_Qin',
          'Talent_PlayerBoy_Fire',
          'Talent_PlayerBoy_Water',
          'Talent_PlayerBoy_Wind',
          'Talent_PlayerBoy_Rock',
          'Talent_PlayerBoy_Electric',
          'Talent_PlayerBoy_Grass',
          'Talent_Lisa',
          'Talent_PlayerGirl_Fire',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'talentStarName',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [''],
        pattern: {
          depth: 2,
          valueType: 'string',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'extraAbilities',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          10011, 10242, 10387, 10522, 10662, 10812, 10961, 11121, 11272, 100557,
        ],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'skills',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          10001, 10275, 10663, 10983, 11096, 11246, 5022010, 5059010, 5093010,
          5128010,
        ],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'subSkills',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [21, 211, 351, 491, 621, 746, 876, 1006, 1136, 1286],
        pattern: {
          depth: 2,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 1,
        },
      },
      correctKey: 'talents',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [1, 4],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'AEELKPGFNEA',
      ancestorKeys: ['BKHEBEGJIAO'],
    },
    {
      feature: {
        values: [
          'SPECIAL_PROUD_SKILL_OPEN_CONDITION_TYPE_NONE',
          'SPECIAL_PROUD_SKILL_OPEN_CONDITION_TYPE_QUEST_FINISH',
        ],
        pattern: {
          depth: 3,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'KFLJPMODBIA',
      ancestorKeys: ['GPDJAHEANHE'],
    },
    {
      feature: {
        values: [221, 2221, 3621, 5022, 6421, 7821, 9222, 10521, 11625, 12851],
        pattern: {
          depth: 3,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 1,
        },
      },
      correctKey: 'proudSkillGroupId',
      ancestorKeys: ['BKHEBEGJIAO'],
    },
    {
      feature: {
        values: [
          603101, 603201, 1000312, 1000406, 1000502, 1000707, 1000806, 1000911,
          1001008, 7007409,
        ],
        pattern: {
          depth: 4,
          valueType: 'number',
          isEnum: false,
          isArrayElement: true,
          arrayDepth: 2,
        },
      },
      correctKey: 'JJBHODPMDGE',
      ancestorKeys: ['GPDJAHEANHE'],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: ['BKHEBEGJIAO', 'GPDJAHEANHE'],
  excludedKeys: ['BPDOFNKLDFG', 'HKCBNKMKFNO', 'IFHAMBEHKDD'],
} as unknown as AnchorFile
