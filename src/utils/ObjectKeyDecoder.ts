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
      )
      if (!dummyProfilePicture) throw new Error('dummyProfilePicture not found')

      const dummyProfilePictureEntry = Object.entries(dummyProfilePicture).find(
        ([, v]) => v === 'PROFILE_PICTURE_UNLOCK_BY_ITEM',
      )
      if (!dummyProfilePictureEntry) {
        throw new Error(
          'PROFILE_PICTURE_UNLOCK_BY_ITEM key not found in dummyProfilePicture',
        )
      }

      this.replaceDatas.push(
        new ReplaceData(dummyProfilePictureEntry[0], 'type'),
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
      )
      if (!sampleWeaponPromoteData)
        throw new Error('sampleWeaponPromoteData not found')

      const promoteLevelEntry = Object.entries(sampleWeaponPromoteData).find(
        ([, v]) => v === 1,
      )
      if (!promoteLevelEntry)
        throw new Error('promoteLevel key not found in sampleWeaponPromoteData')

      this.replaceDatas.push(
        new ReplaceData(promoteLevelEntry[0], 'promoteLevel'),
      )

      const unlockMaxLevelEntry = Object.entries(sampleWeaponPromoteData).find(
        ([, v]) => v === 40,
      )
      if (!unlockMaxLevelEntry) {
        throw new Error(
          'unlockMaxLevel key not found in sampleWeaponPromoteData',
        )
      }

      this.replaceDatas.push(
        new ReplaceData(unlockMaxLevelEntry[0], 'unlockMaxLevel'),
      )

      const costItemsEntry = Object.entries(sampleWeaponPromoteData).find(
        ([, v]) =>
          Array.isArray(v) &&
          v.some((item) => {
            if (typeof item === 'object' && item !== null)
              return 'id' in item && 'count' in item

            return false
          }),
      )
      if (!costItemsEntry)
        throw new Error('costItems key not found in sampleWeaponPromoteData')

      this.replaceDatas.push(new ReplaceData(costItemsEntry[0], 'costItems'))
    }

    // Replace key of AvatarPromoteExcelConfigData (add promoteLevel & unlockMaxLevel & costItems)
    if (Client._hasCachedExcelBinOutputByName('AvatarPromoteExcelConfigData')) {
      const avatarPromoteDataArray = Object.values(
        Client._getCachedExcelBinOutputByName('AvatarPromoteExcelConfigData'),
      )

      const sampleAvatarPromoteData = avatarPromoteDataArray.find(
        (data) => data.avatarPromoteId === 2 && data.requiredPlayerLevel === 15,
      )
      if (!sampleAvatarPromoteData)
        throw new Error('sampleAvatarPromoteData not found')

      const promoteLevelEntry = Object.entries(sampleAvatarPromoteData).find(
        ([, v]) => v === 1,
      )
      if (!promoteLevelEntry)
        throw new Error('promoteLevel key not found in sampleAvatarPromoteData')

      this.replaceDatas.push(
        new ReplaceData(promoteLevelEntry[0], 'promoteLevel'),
      )

      const sampleAvatarPromoteDataEntry = Object.entries(
        sampleAvatarPromoteData,
      ).find(([, v]) => v === 40)
      if (!sampleAvatarPromoteDataEntry) {
        throw new Error(
          'unlockMaxLevel key not found in sampleAvatarPromoteData',
        )
      }

      this.replaceDatas.push(
        new ReplaceData(sampleAvatarPromoteDataEntry[0], 'unlockMaxLevel'),
      )

      const costItemsEntry = Object.entries(sampleAvatarPromoteData).find(
        ([, v]) =>
          Array.isArray(v) &&
          v.some((item) => {
            if (typeof item === 'object' && item !== null)
              return 'id' in item && 'count' in item

            return false
          }),
      )
      if (!costItemsEntry)
        throw new Error('costItems key not found in sampleAvatarPromoteData')

      this.replaceDatas.push(new ReplaceData(costItemsEntry[0], 'costItems'))
    }

    // Replace key of AvatarCurveExcelConfigData (add costItems)
    if (Client._hasCachedExcelBinOutputByName('ProudSkillExcelConfigData')) {
      const proudSkillDataArray = Object.values(
        Client._getCachedExcelBinOutputByName('ProudSkillExcelConfigData'),
      )

      const sampleProudSkillData = proudSkillDataArray[0]

      const costItemsEntry = Object.entries(sampleProudSkillData).find(
        ([, v]) =>
          Array.isArray(v) &&
          v.some((item) => {
            if (typeof item === 'object' && item !== null)
              return 'id' in item && 'count' in item

            return false
          }),
      )
      if (costItemsEntry)
        this.replaceDatas.push(new ReplaceData(costItemsEntry[0], 'costItems'))
      else throw new Error('costItems key not found in sampleProudSkillData')
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
      const json = v as JsonObject
      this.replaceDatas.forEach((replaceData) => {
        json[replaceData.newKey] = json[replaceData.oldKey]
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
          if (
            (json.id as number) > 11000000 ||
            (json.id as number) === 10000001
          )
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
}
