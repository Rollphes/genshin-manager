import { ExcelBinOutputs } from '@/types'
import { JsonArray, JsonObject, JsonValue } from '@/types/json'
import { JsonParser } from '@/utils/JsonParser'

/**
 * Build cache structure from decoded data
 * Handles structure transformation of data decoded by EncryptedKeyDecoder
 * @param jsonData jsonParser (assumes key-decoded data)
 * @param filename excelBinOutput filename
 * @returns objects to cache
 * @example
 * ```ts
 * const jsonParser = new JsonParser(decodedData)
 * const cache = buildCacheStructure(jsonParser, 'MaterialExcelConfigData')
 * console.log(Object.keys(cache).length)
 * ```
 */
export function buildCacheStructure(
  jsonData: JsonParser,
  filename: keyof typeof ExcelBinOutputs,
): Record<string, JsonValue> {
  const jsonArray = jsonData.get() as JsonArray
  const cacheObject: Record<string, JsonValue> = {}
  // eslint-disable-next-line complexity
  jsonArray.forEach((obj) => {
    const json = obj as JsonObject
    switch (filename) {
      case 'ManualTextMapConfigData':
        cacheObject[json.textMapId as string] = Object.assign(json, {
          textMapContentTextMapHash: (json.textMapContent ??
            json.textMapContentTextMapHash) as string,
        })
        break
      case 'WeaponCurveExcelConfigData':
        ;(json.curveInfos as JsonArray).forEach((obj) => {
          const curve = obj as JsonObject
          const level = json.level as number
          const value = curve.value
          const type = curve.type as string
          cacheObject[type] ??= {}
          ;(cacheObject[type] as Record<string, JsonValue>)[level] = value
        })
        break
      case 'WeaponPromoteExcelConfigData':
        if (!cacheObject[json.weaponPromoteId as string])
          cacheObject[json.weaponPromoteId as string] = {}
        ;(
          cacheObject[json.weaponPromoteId as string] as Record<
            string,
            JsonValue
          >
        )[(json.promoteLevel ?? 0) as string] = json
        break
      case 'ReliquaryLevelExcelConfigData':
        ;(json.addProps as JsonArray).forEach((obj) => {
          const prop = obj as JsonObject
          if (!json.rank) return
          const rank = json.rank as number
          const level = (json.level as number) - 1
          const value = prop.value
          const type = prop.propType as string
          cacheObject[type] ??= {}
          let cache = cacheObject[type] as Record<string, JsonValue>
          cache[rank] ??= {}
          cache = cache[rank] as Record<string, JsonValue>
          cache[level] = value
        })
        break
      case 'ReliquarySetExcelConfigData':
        cacheObject[json.setId as string] = json
        break
      case 'AvatarExcelConfigData':
        if ((json.id as number) > 11000000 || (json.id as number) === 10000001)
          break
        cacheObject[json.id as string] = json
        break
      case 'AvatarCostumeExcelConfigData':
        cacheObject[json.skinId as string] = json
        break
      case 'AvatarTalentExcelConfigData':
        cacheObject[json.talentId as string] = json
        break
      case 'AvatarCurveExcelConfigData':
        ;(json.curveInfos as JsonArray).forEach((obj) => {
          const curve = obj as JsonObject
          const level = json.level as number
          const value = curve.value ?? 0
          const type = curve.type as string
          cacheObject[type] ??= {}
          ;(cacheObject[type] as Record<string, JsonValue>)[level] = value
        })
        break
      case 'AvatarPromoteExcelConfigData':
        if (!cacheObject[json.avatarPromoteId as string])
          cacheObject[json.avatarPromoteId as string] = {}
        ;(
          cacheObject[json.avatarPromoteId as string] as Record<
            string,
            JsonValue
          >
        )[(json.promoteLevel ?? 0) as string] = json
        break
      case 'ProudSkillExcelConfigData':
        if (!cacheObject[json.proudSkillGroupId as string])
          cacheObject[json.proudSkillGroupId as string] = {}
        ;(
          cacheObject[json.proudSkillGroupId as string] as Record<
            string,
            JsonValue
          >
        )[(json.proudSkillId as number) % 100] = json
        break
      case 'FetterInfoExcelConfigData':
        cacheObject[json.avatarId as string] = json
        break
      case 'EquipAffixExcelConfigData':
        cacheObject[json.affixId as string] = json
        break
      case 'TowerScheduleExcelConfigData':
        cacheObject[json.scheduleId as string] = json
        break
      case 'TowerFloorExcelConfigData':
        cacheObject[json.floorId as string] = json
        break
      case 'TowerLevelExcelConfigData':
        cacheObject[json.levelId as string] = json
        break
      case 'DungeonLevelEntityConfigData':
        if (json.show !== true) break //Because the same id exists. Added as a temporary workaround
        cacheObject[json.clientId as string] = json
        break
      case 'MonsterExcelConfigData':
        cacheObject[json.id as string] = json
        break
      case 'MonsterDescribeExcelConfigData':
        cacheObject[json.id as string] = json
        break
      case 'AnimalCodexExcelConfigData':
        cacheObject[json.describeId as string] = json
        break
      case 'MonsterCurveExcelConfigData':
        ;(json.curveInfos as JsonArray).forEach((obj) => {
          const curve = obj as JsonObject
          const level = json.level as number
          const value = curve.value ?? 0
          const type = curve.type as string
          cacheObject[type] ??= {}
          ;(cacheObject[type] as Record<string, JsonValue>)[level] = value
        })
        break
      case 'FetterStoryExcelConfigData':
        cacheObject[json.fetterId as string] = json
        break

      case 'DungeonEntryExcelConfigData':
        cacheObject[json.id as string] = json
        break

      case 'FettersExcelConfigData':
        cacheObject[json.fetterId as string] = json
        break

      default:
        cacheObject[json.id as string] = json
        break
    }
  })
  return cacheObject
}
