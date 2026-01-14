import type {
  DecodedType,
  MasterFileMap,
} from '@/types/generated/MasterFileMap'
import type { CacheStructureType, ExcelBinOutputs } from '@/types/types'

/**
 * Cache builder function type
 * @template T - ExcelBinOutput file name type
 */
type CacheBuilder<T extends keyof typeof ExcelBinOutputs> = (
  data: DecodedType<T>,
) => CacheStructureType<T>

/**
 * Type guard for objects with curveInfos array
 * @param item object to check
 * @returns true if item has curveInfos array
 */
function hasCurveInfos(
  item: unknown,
): item is { curveInfos: unknown[]; level: number } {
  if (!item || typeof item !== 'object') return false
  const obj = item as Record<string, unknown>
  return Array.isArray(obj.curveInfos) && obj.curveInfos.length > 0
}

/**
 * Type guard for objects with addProps array
 * @param item object to check
 * @returns true if item has addProps array
 */
function hasAddProps(
  item: unknown,
): item is { addProps: unknown[]; rank: number; level: number } {
  if (!item || typeof item !== 'object') return false
  const obj = item as Record<string, unknown>
  return Array.isArray(obj.addProps) && obj.addProps.length > 0
}

/**
 * Map-based dispatcher for cache structure builders
 * @remarks Performance optimized with O(1) lookup instead of switch statement
 * @remarks PascalCase keys are required to match ExcelBinOutputs type definition
 */
/* eslint-disable @typescript-eslint/naming-convention */
const cacheBuilders: Partial<{
  [K in keyof typeof ExcelBinOutputs]: CacheBuilder<K>
}> = {
  WeaponCurveExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, Record<number, number>> = {}
    const data =
      jsonObjectArray as MasterFileMap['WeaponCurveExcelConfigData'][]
    for (const item of data) {
      if (!hasCurveInfos(item)) continue
      for (const curve of item.curveInfos) {
        const type = curve.type
        const level = item.level
        const value = curve.value
        result[type] ??= {}
        result[type][level] = value
      }
    }
    return result
  },

  WeaponPromoteExcelConfigData: (jsonObjectArray) => {
    const result: Record<
      string,
      Record<string, MasterFileMap['WeaponPromoteExcelConfigData']>
    > = {}
    const data =
      jsonObjectArray as MasterFileMap['WeaponPromoteExcelConfigData'][]
    for (const item of data) {
      const weaponPromoteId = String(item.weaponPromoteId)
      const promoteLevel = String(item.promoteLevel)
      result[weaponPromoteId] ??= {}
      result[weaponPromoteId][promoteLevel] = item
    }
    return result as CacheStructureType<'WeaponPromoteExcelConfigData'>
  },

  ReliquaryLevelExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, Record<number, Record<number, number>>> = {}
    const data =
      jsonObjectArray as MasterFileMap['ReliquaryLevelExcelConfigData'][]
    for (const item of data) {
      if (!hasAddProps(item)) continue
      for (const prop of item.addProps) {
        const type = prop.propType
        const rank = item.rank
        const level = item.level - 1
        const value = prop.value
        result[type] ??= {}
        result[type][rank] ??= {}
        result[type][rank][level] = value
      }
    }
    return result
  },

  ReliquarySetExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['ReliquarySetExcelConfigData']> =
      {}
    const data =
      jsonObjectArray as MasterFileMap['ReliquarySetExcelConfigData'][]
    for (const item of data) result[String(item.setId)] = item

    return result as CacheStructureType<'ReliquarySetExcelConfigData'>
  },

  AvatarExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['AvatarExcelConfigData']> = {}
    const data = jsonObjectArray as MasterFileMap['AvatarExcelConfigData'][]
    for (const item of data) {
      if (item.id > 11000000 || item.id === 10000001) continue
      result[String(item.id)] = item
    }
    return result as CacheStructureType<'AvatarExcelConfigData'>
  },

  AvatarCostumeExcelConfigData: (jsonObjectArray) => {
    const result: Record<
      string,
      MasterFileMap['AvatarCostumeExcelConfigData']
    > = {}
    const data =
      jsonObjectArray as MasterFileMap['AvatarCostumeExcelConfigData'][]
    for (const item of data) result[String(item.skinId)] = item

    return result as CacheStructureType<'AvatarCostumeExcelConfigData'>
  },

  AvatarTalentExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['AvatarTalentExcelConfigData']> =
      {}
    const data =
      jsonObjectArray as MasterFileMap['AvatarTalentExcelConfigData'][]
    for (const item of data) result[String(item.talentId)] = item

    return result as CacheStructureType<'AvatarTalentExcelConfigData'>
  },

  AvatarCurveExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, Record<number, number>> = {}
    const data =
      jsonObjectArray as MasterFileMap['AvatarCurveExcelConfigData'][]
    for (const item of data) {
      if (!hasCurveInfos(item)) continue
      for (const curve of item.curveInfos) {
        const type = curve.type
        const level = item.level
        const value = curve.value
        result[type] ??= {}
        result[type][level] = value
      }
    }
    return result
  },

  AvatarPromoteExcelConfigData: (jsonObjectArray) => {
    const result: Record<
      string,
      Record<string, MasterFileMap['AvatarPromoteExcelConfigData']>
    > = {}
    const data =
      jsonObjectArray as MasterFileMap['AvatarPromoteExcelConfigData'][]
    for (const item of data) {
      const avatarPromoteId = String(item.avatarPromoteId)
      const promoteLevel = String(item.promoteLevel)
      result[avatarPromoteId] ??= {}
      result[avatarPromoteId][promoteLevel] = item
    }
    return result as CacheStructureType<'AvatarPromoteExcelConfigData'>
  },

  ProudSkillExcelConfigData: (jsonObjectArray) => {
    const result: Record<
      string,
      Record<number, MasterFileMap['ProudSkillExcelConfigData']>
    > = {}
    const data = jsonObjectArray as MasterFileMap['ProudSkillExcelConfigData'][]
    for (const item of data) {
      const groupId = String(item.proudSkillGroupId)
      const skillId = item.proudSkillId % 100
      result[groupId] ??= {}
      result[groupId][skillId] = item
    }
    return result as CacheStructureType<'ProudSkillExcelConfigData'>
  },

  FetterInfoExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['FetterInfoExcelConfigData']> =
      {}
    const data = jsonObjectArray as MasterFileMap['FetterInfoExcelConfigData'][]
    for (const item of data) result[String(item.avatarId)] = item

    return result as CacheStructureType<'FetterInfoExcelConfigData'>
  },

  EquipAffixExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['EquipAffixExcelConfigData']> =
      {}
    const data = jsonObjectArray as MasterFileMap['EquipAffixExcelConfigData'][]
    for (const item of data) result[String(item.affixId)] = item

    return result as CacheStructureType<'EquipAffixExcelConfigData'>
  },

  TowerScheduleExcelConfigData: (jsonObjectArray) => {
    const result: Record<
      string,
      MasterFileMap['TowerScheduleExcelConfigData']
    > = {}
    const data =
      jsonObjectArray as MasterFileMap['TowerScheduleExcelConfigData'][]
    for (const item of data) result[String(item.scheduleId)] = item

    return result as CacheStructureType<'TowerScheduleExcelConfigData'>
  },

  TowerFloorExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['TowerFloorExcelConfigData']> =
      {}
    const data = jsonObjectArray as MasterFileMap['TowerFloorExcelConfigData'][]
    for (const item of data) result[String(item.floorId)] = item

    return result as CacheStructureType<'TowerFloorExcelConfigData'>
  },

  TowerLevelExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['TowerLevelExcelConfigData']> =
      {}
    const data = jsonObjectArray as MasterFileMap['TowerLevelExcelConfigData'][]
    for (const item of data) result[String(item.levelId)] = item

    return result as CacheStructureType<'TowerLevelExcelConfigData'>
  },

  DungeonLevelEntityConfigData: (jsonObjectArray) => {
    const result: Record<
      string,
      MasterFileMap['DungeonLevelEntityConfigData']
    > = {}
    const data =
      jsonObjectArray as MasterFileMap['DungeonLevelEntityConfigData'][]
    for (const item of data) {
      if (!item.show) continue
      result[String(item.clientId)] = item
    }
    return result as CacheStructureType<'DungeonLevelEntityConfigData'>
  },

  MonsterExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['MonsterExcelConfigData']> = {}
    const data = jsonObjectArray as MasterFileMap['MonsterExcelConfigData'][]
    for (const item of data) result[String(item.id)] = item

    return result as CacheStructureType<'MonsterExcelConfigData'>
  },

  MonsterDescribeExcelConfigData: (jsonObjectArray) => {
    const result: Record<
      string,
      MasterFileMap['MonsterDescribeExcelConfigData']
    > = {}
    const data =
      jsonObjectArray as MasterFileMap['MonsterDescribeExcelConfigData'][]
    for (const item of data) result[String(item.id)] = item

    return result as CacheStructureType<'MonsterDescribeExcelConfigData'>
  },

  AnimalCodexExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['AnimalCodexExcelConfigData']> =
      {}
    const data =
      jsonObjectArray as MasterFileMap['AnimalCodexExcelConfigData'][]
    for (const item of data) result[String(item.describeId)] = item

    return result as CacheStructureType<'AnimalCodexExcelConfigData'>
  },

  MonsterCurveExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, Record<number, number>> = {}
    const data =
      jsonObjectArray as MasterFileMap['MonsterCurveExcelConfigData'][]
    for (const item of data) {
      if (!hasCurveInfos(item)) continue
      for (const curve of item.curveInfos) {
        const type = curve.type
        const level = item.level
        const value = curve.value
        result[type] ??= {}
        result[type][level] = value
      }
    }
    return result
  },

  FetterStoryExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['FetterStoryExcelConfigData']> =
      {}
    const data =
      jsonObjectArray as MasterFileMap['FetterStoryExcelConfigData'][]
    for (const item of data) result[String(item.fetterId)] = item

    return result as CacheStructureType<'FetterStoryExcelConfigData'>
  },

  DungeonEntryExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['DungeonEntryExcelConfigData']> =
      {}
    const data =
      jsonObjectArray as MasterFileMap['DungeonEntryExcelConfigData'][]
    for (const item of data) result[String(item.id)] = item

    return result as CacheStructureType<'DungeonEntryExcelConfigData'>
  },

  FettersExcelConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['FettersExcelConfigData']> = {}
    const data = jsonObjectArray as MasterFileMap['FettersExcelConfigData'][]
    for (const item of data) result[String(item.fetterId)] = item

    return result as CacheStructureType<'FettersExcelConfigData'>
  },

  ManualTextMapConfigData: (jsonObjectArray) => {
    const result: Record<string, MasterFileMap['ManualTextMapConfigData']> = {}
    const data = jsonObjectArray as MasterFileMap['ManualTextMapConfigData'][]
    for (const item of data) result[item.textMapId] = item

    return result as CacheStructureType<'ManualTextMapConfigData'>
  },
}
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Build cache structure from decoded data
 * Handles structure transformation of data decoded by EncryptedKeyDecoder
 * @template T - ExcelBinOutput file name type
 * @param jsonObjectArray array of json objects (assumes key-decoded data)
 * @param filename excelBinOutput filename
 * @returns objects to cache with proper typing
 * @example
 * ```ts
 * const decoder = new EncryptedKeyDecoder('MaterialExcelConfigData')
 * const decoded = decoder.execute(rawData)
 * const cache = buildCacheStructure(decoded, 'MaterialExcelConfigData')
 * console.log(Object.keys(cache).length)
 * ```
 */
export function buildCacheStructure<T extends keyof typeof ExcelBinOutputs>(
  jsonObjectArray: DecodedType<T>,
  filename: T,
): CacheStructureType<T> {
  const builder = cacheBuilders[filename]
  if (builder) return builder(jsonObjectArray)

  // Default case: map by id
  const result: Record<string, unknown> = {}
  const data = jsonObjectArray as { id?: string | number }[]
  for (const item of data) {
    if (
      item.id !== undefined &&
      (typeof item.id === 'number' || typeof item.id === 'string')
    )
      result[item.id] = item
  }
  return result as CacheStructureType<T>
}
