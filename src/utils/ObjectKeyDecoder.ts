import { Client } from '@/client/Client'
import { ExcelBinOutputs } from '@/types'
import {
  JsonArray,
  JsonObject,
  JsonParser,
  JsonValue,
} from '@/utils/JsonParser'

/**
 * Class of replace data
 */
class ReplaceData {
  constructor(
    public oldKey: string,
    public newKey: string,
  ) {}
}

/**
 * Class of object key decoder
 */
export class ObjectKeyDecoder {
  /**
   * object key replace data
   */
  private readonly replaceDatas: ReplaceData[] = []

  /**
   * Create a ObjectKeyDecoder
   */
  constructor() {
    // Replace key of ProfilePictureExcelConfigData (add infoId&type)
    if (
      Client._hasCachedExcelBinOutputByName('ProfilePictureExcelConfigData')
    ) {
      const profilePictureDataArray = Object.values(
        Client._getCachedExcelBinOutputByName('ProfilePictureExcelConfigData'),
      )

      const dummyProfilePicture = profilePictureDataArray.find(
        (data) => data.id === 99999,
      )!

      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(dummyProfilePicture).find(
            ([, v]) => v === 'PROFILE_PICTURE_UNLOCK_BY_ITEM',
          )?.[0]!,
          'type',
        ),
      )
    }

    // Replace key of WeaponPromoteExcelConfigData (add promoteLevel & unlockMaxLevel & costItems)
    if (Client._hasCachedExcelBinOutputByName('WeaponPromoteExcelConfigData')) {
      const weaponPromoteDataArray = Object.values(
        Client._getCachedExcelBinOutputByName('WeaponPromoteExcelConfigData'),
      )

      const sampleWeaponPromoteData = weaponPromoteDataArray.find(
        (data) =>
          data.weaponPromoteId === 11101 && data.requiredPlayerLevel === 15,
      )!

      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(sampleWeaponPromoteData).find(
            ([, v]) => v === 1,
          )?.[0]!,
          'promoteLevel',
        ),
      )

      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(sampleWeaponPromoteData).find(
            ([, v]) => v === 40,
          )?.[0]!,
          'unlockMaxLevel',
        ),
      )

      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(sampleWeaponPromoteData).find(
            ([, v]) =>
              Array.isArray(v) &&
              v.some((item) => {
                if (typeof item === 'object' && item !== null)
                  return 'id' in item && 'count' in item

                return false
              }),
          )?.[0]!,
          'costItems',
        ),
      )
    }

    // Replace key of AvatarPromoteExcelConfigData (add promoteLevel & unlockMaxLevel & costItems)
    if (Client._hasCachedExcelBinOutputByName('AvatarPromoteExcelConfigData')) {
      const avatarPromoteDataArray = Object.values(
        Client._getCachedExcelBinOutputByName('AvatarPromoteExcelConfigData'),
      )

      const sampleAvatarPromoteData = avatarPromoteDataArray.find(
        (data) => data.avatarPromoteId === 2 && data.requiredPlayerLevel === 15,
      )!

      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(sampleAvatarPromoteData).find(
            ([, v]) => v === 1,
          )?.[0]!,
          'promoteLevel',
        ),
      )

      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(sampleAvatarPromoteData).find(
            ([, v]) => v === 40,
          )?.[0]!,
          'unlockMaxLevel',
        ),
      )

      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(sampleAvatarPromoteData).find(
            ([, v]) =>
              Array.isArray(v) &&
              v.some((item) => {
                if (typeof item === 'object' && item !== null)
                  return 'id' in item && 'count' in item

                return false
              }),
          )?.[0]!,
          'costItems',
        ),
      )
    }

    // Replace key of AvatarCurveExcelConfigData (add costItems)
    if (Client._hasCachedExcelBinOutputByName('ProudSkillExcelConfigData')) {
      const proudSkillDataArray = Object.values(
        Client._getCachedExcelBinOutputByName('ProudSkillExcelConfigData'),
      )

      const sampleProudSkillData = proudSkillDataArray[0]

      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(sampleProudSkillData).find(
            ([, v]) =>
              Array.isArray(v) &&
              v.some((item) => {
                if (typeof item === 'object' && item !== null)
                  return 'id' in item && 'count' in item

                return false
              }),
          )?.[0]!,
          'costItems',
        ),
      )
    }
  }

  /**
   * Execute JsonParser key decoder
   * @param jsonData JsonParser
   * @param filename ExcelBinOutput Filename
   * @returns Objects to cache
   */
  public execute(
    jsonData: JsonParser,
    filename: keyof typeof ExcelBinOutputs,
  ): Record<string, JsonValue> {
    this.decode(jsonData)
    return this.setKey(jsonData, filename)
  }

  /**
   * Decode JsonParser key
   * @param jsonData JsonParser
   * @returns Decoded JsonParser
   */
  private decode(jsonData: JsonParser): JsonParser {
    const jsonArray = jsonData.get() as JsonArray
    jsonArray.forEach((v) => {
      const obj = v as JsonObject
      this.replaceDatas.forEach((replaceData) => {
        if (obj[replaceData.oldKey] !== undefined)
          obj[replaceData.newKey] = obj[replaceData.oldKey]
      })
    })
    return jsonData
  }

  /**
   * Set key to store in cache
   * @param jsonData JsonParser
   * @param filename ExcelBinOutput Filename
   * @returns Objects to cache
   */
  private setKey(
    jsonData: JsonParser,
    filename: keyof typeof ExcelBinOutputs,
  ): Record<string, JsonValue> {
    const jsonArray = jsonData.get() as JsonArray
    const cacheObject: Record<string, JsonValue> = {}
    // eslint-disable-next-line complexity
    jsonArray.forEach((json) => {
      const obj = json as JsonObject
      switch (filename) {
        case 'ManualTextMapConfigData':
          cacheObject[obj.textMapId as string] = Object.assign(obj, {
            textMapContentTextMapHash: (obj.textMapContent ??
              obj.textMapContentTextMapHash) as string,
          })
          break
        case 'WeaponCurveExcelConfigData':
          ;(obj.curveInfos as JsonArray).forEach((curve) => {
            const level = obj.level as number
            const value = (curve as JsonObject).value
            const type = (curve as JsonObject).type as string
            cacheObject[type] ??= {}
            ;(cacheObject[type] as JsonObject)[level] = value
          })
          break
        case 'WeaponPromoteExcelConfigData':
          if (!cacheObject[obj.weaponPromoteId as string])
            cacheObject[obj.weaponPromoteId as string] = {}
          ;(cacheObject[obj.weaponPromoteId as string] as JsonObject)[
            (obj.promoteLevel ?? 0) as string
          ] = obj
          break
        case 'ReliquaryLevelExcelConfigData':
          ;(obj.addProps as JsonArray).forEach((prop) => {
            if (!obj.rank) return
            const rank = obj.rank as number
            const level = (obj.level as number) - 1
            const value = (prop as JsonObject).value
            const type = (prop as JsonObject).propType as string
            cacheObject[type] ??= {}
            let cache = cacheObject[type] as JsonObject
            cache[rank] ??= {}
            cache = cache[rank] as JsonObject
            cache[level] = value
          })
          break
        case 'ReliquarySetExcelConfigData':
          cacheObject[obj.setId as string] = obj
          break
        case 'AvatarExcelConfigData':
          if ((obj.id as number) > 11000000 || (obj.id as number) === 10000001)
            break
          cacheObject[obj.id as string] = obj
          break
        case 'AvatarCostumeExcelConfigData':
          cacheObject[obj.skinId as string] = obj
          break
        case 'AvatarTalentExcelConfigData':
          cacheObject[obj.talentId as string] = obj
          break
        case 'AvatarCurveExcelConfigData':
          ;(obj.curveInfos as JsonArray).forEach((curve) => {
            const level = obj.level as number
            const value = (curve as JsonObject).value ?? 0
            const type = (curve as JsonObject).type as string
            cacheObject[type] ??= {}
            ;(cacheObject[type] as JsonObject)[level] = value
          })
          break
        case 'AvatarPromoteExcelConfigData':
          if (!cacheObject[obj.avatarPromoteId as string])
            cacheObject[obj.avatarPromoteId as string] = {}
          ;(cacheObject[obj.avatarPromoteId as string] as JsonObject)[
            (obj.promoteLevel ?? 0) as string
          ] = obj
          break
        case 'ProudSkillExcelConfigData':
          if (!cacheObject[obj.proudSkillGroupId as string])
            cacheObject[obj.proudSkillGroupId as string] = {}
          ;(cacheObject[obj.proudSkillGroupId as string] as JsonObject)[
            (obj.proudSkillId as number) % 100
          ] = obj
          break
        case 'FetterInfoExcelConfigData':
          cacheObject[obj.avatarId as string] = obj
          break
        case 'EquipAffixExcelConfigData':
          cacheObject[obj.affixId as string] = obj
          break
        case 'TowerScheduleExcelConfigData':
          cacheObject[obj.scheduleId as string] = obj
          break
        case 'TowerFloorExcelConfigData':
          cacheObject[obj.floorId as string] = obj
          break
        case 'TowerLevelExcelConfigData':
          cacheObject[obj.levelId as string] = obj
          break
        case 'DungeonLevelEntityConfigData':
          if (obj.show !== true) break //Because the same id exists. Added as a temporary workaround
          cacheObject[obj.clientId as string] = obj
          break
        case 'MonsterExcelConfigData':
          cacheObject[obj.id as string] = obj
          break
        case 'MonsterDescribeExcelConfigData':
          cacheObject[obj.id as string] = obj
          break
        case 'AnimalCodexExcelConfigData':
          cacheObject[obj.describeId as string] = obj
          break
        case 'MonsterCurveExcelConfigData':
          ;(obj.curveInfos as JsonArray).forEach((curve) => {
            const level = obj.level as number
            const value = (curve as JsonObject).value ?? 0
            const type = (curve as JsonObject).type as string
            cacheObject[type] ??= {}
            ;(cacheObject[type] as JsonObject)[level] = value
          })
          break
        case 'FetterStoryExcelConfigData':
          cacheObject[obj.fetterId as string] = obj
          break

        case 'DungeonEntryExcelConfigData':
          cacheObject[obj.id as string] = obj
          break

        case 'FettersExcelConfigData':
          cacheObject[obj.fetterId as string] = obj
          break

        default:
          cacheObject[obj.id as string] = obj
          break
      }
    })
    return cacheObject
  }
}
