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
   * List of object key replace data
   */
  private readonly replaceDatas: ReplaceData[] = []
  /**
   * List of character IDs that are not included in the character list
   */
  private readonly characterBlackIdList: number[] = [
    10000001, 11000008, 11000009, 11000010, 11000011, 11000013, 11000017,
    11000018, 11000019, 11000025, 11000026, 11000027, 11000028, 11000030,
    11000031, 11000032, 11000033, 11000034, 11000035, 11000036, 11000037,
    11000038, 11000039, 11000040, 11000041, 11000042, 11000043, 11000044,
    11000045,
  ]

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
      ) as JsonObject

      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(dummyProfilePicture).find(
            ([, v]) => v === 320001,
          )?.[0] as string,
          'infoId',
        ),
      )
      this.replaceDatas.push(
        new ReplaceData(
          Object.entries(dummyProfilePicture).find(
            ([, v]) => v === 'PROFILE_PICTURE_UNLOCK_BY_ITEM',
          )?.[0] as string,
          'type',
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
  ): { [key in string]: JsonValue } {
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
  ): { [key in string]: JsonValue } {
    const jsonArray = jsonData.get() as JsonArray
    const cacheObject: { [key in string]: JsonValue } = {}
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
            if (!cacheObject[type]) cacheObject[type] = {}
            ;(cacheObject[type] as JsonObject)[level] = value
          })
          break
        case 'WeaponPromoteExcelConfigData':
          if (!cacheObject[obj.weaponPromoteId as string])
            cacheObject[obj.weaponPromoteId as string] = {}
          ;(cacheObject[obj.weaponPromoteId as string] as JsonObject)[
            (!obj.promoteLevel ? 0 : obj.promoteLevel) as string
          ] = obj
          break
        case 'ReliquaryLevelExcelConfigData':
          ;(obj.addProps as JsonArray).forEach((prop) => {
            if (!obj.rank) return
            const rank = obj.rank as number
            const level = obj.level as number
            const value = (prop as JsonObject).value
            const type = (prop as JsonObject).propType as string
            if (!cacheObject[type]) cacheObject[type] = {}
            let cache = cacheObject[type] as JsonObject
            if (!cache[rank]) cache[rank] = {}
            cache = cache[rank] as JsonObject
            cache[level] = value
          })
          break
        case 'ReliquarySetExcelConfigData':
          cacheObject[obj.setId as string] = obj
          break
        case 'AvatarExcelConfigData':
          if (this.characterBlackIdList.includes(obj.id as number)) break
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
            if (!cacheObject[type]) cacheObject[type] = {}
            ;(cacheObject[type] as JsonObject)[level] = value
          })
          break
        case 'AvatarPromoteExcelConfigData':
          if (!cacheObject[obj.avatarPromoteId as string])
            cacheObject[obj.avatarPromoteId as string] = {}
          ;(cacheObject[obj.avatarPromoteId as string] as JsonObject)[
            (!obj.promoteLevel ? 0 : obj.promoteLevel) as string
          ] = obj
          break
        case 'ProudSkillExcelConfigData':
          cacheObject[obj.proudSkillId as string] = obj
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
            if (!cacheObject[type]) cacheObject[type] = {}
            ;(cacheObject[type] as JsonObject)[level] = value
          })
          break
        case 'FetterStoryExcelConfigData':
          cacheObject[obj.fetterId as string] = obj
          break

        //Progress
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
