import type { AnimalCodexExcelConfigDataType } from './AnimalCodexExcelConfigData'
import type { AvatarCostumeExcelConfigDataType } from './AvatarCostumeExcelConfigData'
import type { AvatarCurveExcelConfigDataType } from './AvatarCurveExcelConfigData'
import type { AvatarExcelConfigDataType } from './AvatarExcelConfigData'
import type { AvatarPromoteExcelConfigDataType } from './AvatarPromoteExcelConfigData'
import type { AvatarSkillDepotExcelConfigDataType } from './AvatarSkillDepotExcelConfigData'
import type { AvatarSkillExcelConfigDataType } from './AvatarSkillExcelConfigData'
import type { AvatarTalentExcelConfigDataType } from './AvatarTalentExcelConfigData'
import type { DungeonEntryExcelConfigDataType } from './DungeonEntryExcelConfigData'
import type { DungeonLevelEntityConfigDataType } from './DungeonLevelEntityConfigData'
import type { EquipAffixExcelConfigDataType } from './EquipAffixExcelConfigData'
import type { FetterInfoExcelConfigDataType } from './FetterInfoExcelConfigData'
import type { FettersExcelConfigDataType } from './FettersExcelConfigData'
import type { FetterStoryExcelConfigDataType } from './FetterStoryExcelConfigData'
import type { ManualTextMapConfigDataType } from './ManualTextMapConfigData'
import type { MaterialExcelConfigDataType } from './MaterialExcelConfigData'
import type { MonsterCurveExcelConfigDataType } from './MonsterCurveExcelConfigData'
import type { MonsterDescribeExcelConfigDataType } from './MonsterDescribeExcelConfigData'
import type { MonsterExcelConfigDataType } from './MonsterExcelConfigData'
import type { ProfilePictureExcelConfigDataType } from './ProfilePictureExcelConfigData'
import type { ProudSkillExcelConfigDataType } from './ProudSkillExcelConfigData'
import type { ReliquaryAffixExcelConfigDataType } from './ReliquaryAffixExcelConfigData'
import type { ReliquaryExcelConfigDataType } from './ReliquaryExcelConfigData'
import type { ReliquaryLevelExcelConfigDataType } from './ReliquaryLevelExcelConfigData'
import type { ReliquaryMainPropExcelConfigDataType } from './ReliquaryMainPropExcelConfigData'
import type { ReliquarySetExcelConfigDataType } from './ReliquarySetExcelConfigData'
import type { TowerFloorExcelConfigDataType } from './TowerFloorExcelConfigData'
import type { TowerLevelExcelConfigDataType } from './TowerLevelExcelConfigData'
import type { TowerScheduleExcelConfigDataType } from './TowerScheduleExcelConfigData'
import type { WeaponCurveExcelConfigDataType } from './WeaponCurveExcelConfigData'
import type { WeaponExcelConfigDataType } from './WeaponExcelConfigData'
import type { WeaponPromoteExcelConfigDataType } from './WeaponPromoteExcelConfigData'

/**
 * Master file type mapping
 * Maps ExcelBinOutput file names to their corresponding decoded types
 */
export interface MasterFileMap {
  AnimalCodexExcelConfigData: AnimalCodexExcelConfigDataType
  AvatarCostumeExcelConfigData: AvatarCostumeExcelConfigDataType
  AvatarCurveExcelConfigData: AvatarCurveExcelConfigDataType
  AvatarExcelConfigData: AvatarExcelConfigDataType
  AvatarPromoteExcelConfigData: AvatarPromoteExcelConfigDataType
  AvatarSkillDepotExcelConfigData: AvatarSkillDepotExcelConfigDataType
  AvatarSkillExcelConfigData: AvatarSkillExcelConfigDataType
  AvatarTalentExcelConfigData: AvatarTalentExcelConfigDataType
  DungeonEntryExcelConfigData: DungeonEntryExcelConfigDataType
  DungeonLevelEntityConfigData: DungeonLevelEntityConfigDataType
  EquipAffixExcelConfigData: EquipAffixExcelConfigDataType
  FetterInfoExcelConfigData: FetterInfoExcelConfigDataType
  FettersExcelConfigData: FettersExcelConfigDataType
  FetterStoryExcelConfigData: FetterStoryExcelConfigDataType
  ManualTextMapConfigData: ManualTextMapConfigDataType
  MaterialExcelConfigData: MaterialExcelConfigDataType
  MonsterCurveExcelConfigData: MonsterCurveExcelConfigDataType
  MonsterDescribeExcelConfigData: MonsterDescribeExcelConfigDataType
  MonsterExcelConfigData: MonsterExcelConfigDataType
  ProfilePictureExcelConfigData: ProfilePictureExcelConfigDataType
  ProudSkillExcelConfigData: ProudSkillExcelConfigDataType
  ReliquaryAffixExcelConfigData: ReliquaryAffixExcelConfigDataType
  ReliquaryExcelConfigData: ReliquaryExcelConfigDataType
  ReliquaryLevelExcelConfigData: ReliquaryLevelExcelConfigDataType
  ReliquaryMainPropExcelConfigData: ReliquaryMainPropExcelConfigDataType
  ReliquarySetExcelConfigData: ReliquarySetExcelConfigDataType
  TowerFloorExcelConfigData: TowerFloorExcelConfigDataType
  TowerLevelExcelConfigData: TowerLevelExcelConfigDataType
  TowerScheduleExcelConfigData: TowerScheduleExcelConfigDataType
  WeaponCurveExcelConfigData: WeaponCurveExcelConfigDataType
  WeaponExcelConfigData: WeaponExcelConfigDataType
  WeaponPromoteExcelConfigData: WeaponPromoteExcelConfigDataType
}

/**
 * Type helper to extract decoded type from ExcelBinOutput key
 * Returns array type since all decoded data is an array
 */
export type DecodedType<T extends keyof MasterFileMap> = MasterFileMap[T][]
