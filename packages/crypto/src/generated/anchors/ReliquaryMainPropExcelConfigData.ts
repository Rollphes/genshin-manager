import type { AnchorFile } from '@/types'

/**
 * Anchor file for ReliquaryMainPropExcelConfigData.
 * Auto-generated - do not edit manually.
 */
export const ReliquaryMainPropExcelConfigData = {
  metadata: {
    sourceFile: 'ReliquaryMainPropExcelConfigData',
    commitId: 'b761e4d2e9e509eb8aa8c04c381b46d2308d7e85',
    generatedAt: '2026-03-21T14:50:44.507Z',
    totalElements: 66,
  },
  anchors: [
    {
      feature: {
        values: [
          'Reliquary_Main_Affix_TOUGH',
          'Reliquary_Main_Affix_STRONG',
          'Reliquary_Main_Affix_RUTHLESS',
          'Reliquary_Main_Affix_FATAL',
          'Reliquary_Main_Affix_GLORY',
          'Reliquary_Main_Affix_EMINENCE',
          'Reliquary_Main_Affix_EXULTATION',
          'Reliquary_Main_Affix_WISDOM',
          'Reliquary_Main_Affix_CRUEL',
          'Reliquary_Main_Affix_FIERCE',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'affixName',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          10001, 10008, 10015, 13002, 13009, 15005, 15012, 30970, 50920, 50990,
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
        values: [1000, 1097, 2000, 3094, 3097, 5000, 5090, 5093, 5096, 5099],
        pattern: {
          depth: 1,
          valueType: 'number',
          isEnum: false,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'propDepotId',
      ancestorKeys: [],
    },
    {
      feature: {
        values: [
          'FIGHT_PROP_HP',
          'FIGHT_PROP_HP_PERCENT',
          'FIGHT_PROP_ATTACK',
          'FIGHT_PROP_ATTACK_PERCENT',
          'FIGHT_PROP_DEFENSE',
          'FIGHT_PROP_DEFENSE_PERCENT',
          'FIGHT_PROP_CHARGE_EFFICIENCY',
          'FIGHT_PROP_ELEMENT_MASTERY',
          'FIGHT_PROP_FIRE_SUB_HURT',
          'FIGHT_PROP_ELEC_SUB_HURT',
        ],
        pattern: {
          depth: 1,
          valueType: 'string',
          isEnum: true,
          isArrayElement: false,
          arrayDepth: 0,
        },
      },
      correctKey: 'propType',
      ancestorKeys: [],
    },
  ],
  crossFileAnchors: [],
  derivedAncestorKeys: [],
  excludedKeys: [],
} as unknown as AnchorFile
