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
      )!

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
      )!

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
      const obj = v
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
      const obj = json
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
            const value = curve.value
            const type = curve.type as string
            cacheObject[type] ??= {}
            cacheObject[type][level] = value
          })
          break
        case 'WeaponPromoteExcelConfigData':
          if (!cacheObject[obj.weaponPromoteId as string])
            cacheObject[obj.weaponPromoteId as string] = {}
          cacheObject[obj.weaponPromoteId as string][
            (obj.promoteLevel ?? 0) as string
          ] = obj
          break
        case 'ReliquaryLevelExcelConfigData':
          ;(obj.addProps as JsonArray).forEach((prop) => {
            if (!obj.rank) return
            const rank = obj.rank as number
            const level = (obj.level as number) - 1
            const value = prop.value
            const type = prop.propType as string
            cacheObject[type] ??= {}
            let cache = cacheObject[type]
            cache[rank] ??= {}
            cache = cache[rank]
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
            const value = curve.value ?? 0
            const type = curve.type as string
            cacheObject[type] ??= {}
            cacheObject[type][level] = value
          })
          break
        case 'AvatarPromoteExcelConfigData':
          if (!cacheObject[obj.avatarPromoteId as string])
            cacheObject[obj.avatarPromoteId as string] = {}
          cacheObject[obj.avatarPromoteId as string][
            (obj.promoteLevel ?? 0) as string
          ] = obj
          break
        case 'ProudSkillExcelConfigData':
          if (!cacheObject[obj.proudSkillGroupId as string])
            cacheObject[obj.proudSkillGroupId as string] = {}
          cacheObject[obj.proudSkillGroupId as string][
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
            const value = curve.value ?? 0
            const type = curve.type as string
            cacheObject[type] ??= {}
            cacheObject[type][level] = value
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
