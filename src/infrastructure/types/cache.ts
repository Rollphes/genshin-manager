import type { MasterFileMap as GeneratedMasterFileMap } from '@/infrastructure/types/generated/MasterFileMap'

/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Cache structure type mapping for processed game data
 */
export interface CacheStructureMap {
  /**
   * Animal codex entries mapped by describe ID
   */
  AnimalCodexExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['AnimalCodexExcelConfigData'] | undefined
  >

  /**
   * Avatar costume data mapped by skin ID
   */
  AvatarCostumeExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['AvatarCostumeExcelConfigData'] | undefined
  >

  /**
   * Avatar stat curve data indexed by type then level
   */
  AvatarCurveExcelConfigData: Record<string, Record<number, number>>

  /**
   * Avatar base data mapped by character ID
   */
  AvatarExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['AvatarExcelConfigData'] | undefined
  >

  /**
   * Avatar ascension data nested by promote ID and level
   */
  AvatarPromoteExcelConfigData: Record<
    string,
    Record<
      string,
      GeneratedMasterFileMap['AvatarPromoteExcelConfigData'] | undefined
    >
  >

  /**
   * Avatar skill depot configurations mapped by ID
   */
  AvatarSkillDepotExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['AvatarSkillDepotExcelConfigData'] | undefined
  >

  /**
   * Avatar skill definitions mapped by skill ID
   */
  AvatarSkillExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['AvatarSkillExcelConfigData'] | undefined
  >

  /**
   * Avatar talent data mapped by talent ID
   */
  AvatarTalentExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['AvatarTalentExcelConfigData'] | undefined
  >

  /**
   * Dungeon entry configurations mapped by ID
   */
  DungeonEntryExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['DungeonEntryExcelConfigData'] | undefined
  >

  /**
   * Dungeon level entity data mapped by client ID
   */
  DungeonLevelEntityConfigData: Record<
    string,
    GeneratedMasterFileMap['DungeonLevelEntityConfigData'] | undefined
  >

  /**
   * Equipment affix data mapped by affix ID
   */
  EquipAffixExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['EquipAffixExcelConfigData'] | undefined
  >

  /**
   * Character fetter info mapped by avatar ID
   */
  FetterInfoExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['FetterInfoExcelConfigData'] | undefined
  >

  /**
   * Fetter configuration data mapped by fetter ID
   */
  FettersExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['FettersExcelConfigData'] | undefined
  >

  /**
   * Character story data mapped by fetter ID
   */
  FetterStoryExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['FetterStoryExcelConfigData'] | undefined
  >

  /**
   * Manual text map entries indexed by text map ID
   */
  ManualTextMapConfigData: Record<
    string,
    GeneratedMasterFileMap['ManualTextMapConfigData'] | undefined
  >

  /**
   * Material item data mapped by material ID
   */
  MaterialExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['MaterialExcelConfigData'] | undefined
  >

  /**
   * Monster stat curve data indexed by type then level
   */
  MonsterCurveExcelConfigData: Record<string, Record<number, number>>

  /**
   * Monster description data mapped by ID
   */
  MonsterDescribeExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['MonsterDescribeExcelConfigData'] | undefined
  >

  /**
   * Monster configuration data mapped by monster ID
   */
  MonsterExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['MonsterExcelConfigData'] | undefined
  >

  /**
   * Profile picture data mapped by picture ID
   */
  ProfilePictureExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['ProfilePictureExcelConfigData'] | undefined
  >

  /**
   * Skill enhancement data nested by group ID and skill level
   */
  ProudSkillExcelConfigData: Record<
    string,
    Record<
      number,
      GeneratedMasterFileMap['ProudSkillExcelConfigData'] | undefined
    >
  >

  /**
   * Artifact affix data mapped by affix ID
   */
  ReliquaryAffixExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['ReliquaryAffixExcelConfigData'] | undefined
  >

  /**
   * Artifact base data mapped by artifact ID
   */
  ReliquaryExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['ReliquaryExcelConfigData'] | undefined
  >

  /**
   * Artifact stat growth data indexed by type, rank, and level
   */
  ReliquaryLevelExcelConfigData: Record<
    string,
    Record<number, Record<number, number>>
  >

  /**
   * Artifact main stat data mapped by prop ID
   */
  ReliquaryMainPropExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['ReliquaryMainPropExcelConfigData'] | undefined
  >

  /**
   * Artifact set bonus data mapped by set ID
   */
  ReliquarySetExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['ReliquarySetExcelConfigData'] | undefined
  >

  /**
   * Spiral Abyss floor data mapped by floor ID
   */
  TowerFloorExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['TowerFloorExcelConfigData'] | undefined
  >

  /**
   * Spiral Abyss level data mapped by level ID
   */
  TowerLevelExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['TowerLevelExcelConfigData'] | undefined
  >

  /**
   * Spiral Abyss schedule data mapped by schedule ID
   */
  TowerScheduleExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['TowerScheduleExcelConfigData'] | undefined
  >

  /**
   * Weapon stat curve data indexed by type then level
   */
  WeaponCurveExcelConfigData: Record<string, Record<number, number>>

  /**
   * Weapon base data mapped by weapon ID
   */
  WeaponExcelConfigData: Record<
    string,
    GeneratedMasterFileMap['WeaponExcelConfigData'] | undefined
  >

  /**
   * Weapon ascension data nested by promote ID and level
   */
  WeaponPromoteExcelConfigData: Record<
    string,
    Record<
      string,
      GeneratedMasterFileMap['WeaponPromoteExcelConfigData'] | undefined
    >
  >
}
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Type helper to extract cache structure type from ExcelBinOutput key
 */
export type CacheStructureType<T extends keyof CacheStructureMap> =
  CacheStructureMap[T]
