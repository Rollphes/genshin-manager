import { ExcelBinOutputs } from '@/types'
import { JsonObject, JsonValue } from '@/types/json'

/**
 * Build cache structure from decoded data
 * Handles structure transformation of data decoded by EncryptedKeyDecoder
 * @param jsonObjectArray array of json objects (assumes key-decoded data)
 * @param filename excelBinOutput filename
 * @returns objects to cache
 * @example
 * ```ts
 * const jsonObjectArray = JSON.parse(fs.readFileSync('path/to/MaterialExcelConfigData.json', 'utf-8')) as JsonObject[]
 * const cache = buildCacheStructure(jsonObjectArray, 'MaterialExcelConfigData')
 * console.log(Object.keys(cache).length)
 * ```
 */
export function buildCacheStructure(
  jsonObjectArray: JsonObject[],
  filename: keyof typeof ExcelBinOutputs,
): Record<string, JsonObject> {
  const cacheObject: Record<string, JsonObject> = {}
  // eslint-disable-next-line complexity
  jsonObjectArray.forEach((jsonObject) => {
    switch (filename) {
      case 'ManualTextMapConfigData':
        cacheObject[jsonObject.textMapId as string] = Object.assign(
          jsonObject,
          {
            textMapContentTextMapHash: (jsonObject.textMapContent ??
              jsonObject.textMapContentTextMapHash) as string,
          },
        )
        break
      case 'WeaponCurveExcelConfigData':
        if (jsonObject.curveInfos && Array.isArray(jsonObject.curveInfos)) {
          jsonObject.curveInfos.forEach((obj) => {
            const curve = obj as JsonObject
            const level = jsonObject.level as number
            const value = curve.value
            const type = curve.type as string
            cacheObject[type] ??= {}
            ;(cacheObject[type] as Record<string, JsonValue>)[level] = value
          })
        }
        break
      case 'WeaponPromoteExcelConfigData':
        if (!cacheObject[jsonObject.weaponPromoteId as string])
          cacheObject[jsonObject.weaponPromoteId as string] = {}
        ;(
          cacheObject[jsonObject.weaponPromoteId as string] as Record<
            string,
            JsonValue
          >
        )[(jsonObject.promoteLevel ?? 0) as string] = jsonObject
        break
      case 'ReliquaryLevelExcelConfigData':
        if (jsonObject.addProps && Array.isArray(jsonObject.addProps)) {
          jsonObject.addProps.forEach((obj) => {
            const prop = obj as JsonObject
            if (!jsonObject.rank) return
            const rank = jsonObject.rank as number
            const level = (jsonObject.level as number) - 1
            const value = prop.value
            const type = prop.propType as string
            cacheObject[type] ??= {}
            let cache = cacheObject[type] as Record<string, JsonValue>
            cache[rank] ??= {}
            cache = cache[rank] as Record<string, JsonValue>
            cache[level] = value
          })
        }
        break
      case 'ReliquarySetExcelConfigData':
        cacheObject[jsonObject.setId as string] = jsonObject
        break
      case 'AvatarExcelConfigData':
        if (
          (jsonObject.id as number) > 11000000 ||
          (jsonObject.id as number) === 10000001
        )
          break
        cacheObject[jsonObject.id as string] = jsonObject
        break
      case 'AvatarCostumeExcelConfigData':
        cacheObject[jsonObject.skinId as string] = jsonObject
        break
      case 'AvatarTalentExcelConfigData':
        cacheObject[jsonObject.talentId as string] = jsonObject
        break
      case 'AvatarCurveExcelConfigData':
        if (jsonObject.curveInfos && Array.isArray(jsonObject.curveInfos)) {
          jsonObject.curveInfos.forEach((obj) => {
            const curve = obj as JsonObject
            const level = jsonObject.level as number
            const value = curve.value ?? 0
            const type = curve.type as string
            cacheObject[type] ??= {}
            ;(cacheObject[type] as Record<string, JsonValue>)[level] = value
          })
        }
        break
      case 'AvatarPromoteExcelConfigData':
        if (!cacheObject[jsonObject.avatarPromoteId as string])
          cacheObject[jsonObject.avatarPromoteId as string] = {}
        ;(
          cacheObject[jsonObject.avatarPromoteId as string] as Record<
            string,
            JsonValue
          >
        )[(jsonObject.promoteLevel ?? 0) as string] = jsonObject
        break
      case 'ProudSkillExcelConfigData':
        if (!cacheObject[jsonObject.proudSkillGroupId as string])
          cacheObject[jsonObject.proudSkillGroupId as string] = {}
        ;(
          cacheObject[jsonObject.proudSkillGroupId as string] as Record<
            string,
            JsonValue
          >
        )[(jsonObject.proudSkillId as number) % 100] = jsonObject
        break
      case 'FetterInfoExcelConfigData':
        cacheObject[jsonObject.avatarId as string] = jsonObject
        break
      case 'EquipAffixExcelConfigData':
        cacheObject[jsonObject.affixId as string] = jsonObject
        break
      case 'TowerScheduleExcelConfigData':
        cacheObject[jsonObject.scheduleId as string] = jsonObject
        break
      case 'TowerFloorExcelConfigData':
        cacheObject[jsonObject.floorId as string] = jsonObject
        break
      case 'TowerLevelExcelConfigData':
        cacheObject[jsonObject.levelId as string] = jsonObject
        break
      case 'DungeonLevelEntityConfigData':
        if (jsonObject.show !== true) break //Because the same id exists. Added as a temporary workaround
        cacheObject[jsonObject.clientId as string] = jsonObject
        break
      case 'MonsterExcelConfigData':
        cacheObject[jsonObject.id as string] = jsonObject
        break
      case 'MonsterDescribeExcelConfigData':
        cacheObject[jsonObject.id as string] = jsonObject
        break
      case 'AnimalCodexExcelConfigData':
        cacheObject[jsonObject.describeId as string] = jsonObject
        break
      case 'MonsterCurveExcelConfigData':
        if (jsonObject.curveInfos && Array.isArray(jsonObject.curveInfos)) {
          jsonObject.curveInfos.forEach((obj) => {
            const curve = obj as JsonObject
            const level = jsonObject.level as number
            const value = curve.value ?? 0
            const type = curve.type as string
            cacheObject[type] ??= {}
            ;(cacheObject[type] as Record<string, JsonValue>)[level] = value
          })
        }
        break
      case 'FetterStoryExcelConfigData':
        cacheObject[jsonObject.fetterId as string] = jsonObject
        break

      case 'DungeonEntryExcelConfigData':
        cacheObject[jsonObject.id as string] = jsonObject
        break

      case 'FettersExcelConfigData':
        cacheObject[jsonObject.fetterId as string] = jsonObject
        break

      default:
        cacheObject[jsonObject.id as string] = jsonObject
        break
    }
  })
  return cacheObject
}
