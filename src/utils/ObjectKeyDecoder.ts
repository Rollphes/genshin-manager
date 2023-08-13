import { Client } from '@/client/Client'
import { ExcelBinOutputs } from '@/types'
import {
  JsonArray,
  JsonObject,
  JsonParser,
  JsonValue,
} from '@/utils/JsonParser'

class ReplaceData {
  constructor(
    public oldKey: string,
    public newKey: string,
  ) {}
}

export class ObjectKeyDecoder {
  private readonly replaceDatas: ReplaceData[] = []
  private readonly characterBlackIdList: number[] = [
    10000001, 11000008, 11000009, 11000010, 11000011, 11000013, 11000017,
    11000018, 11000019, 11000025, 11000026, 11000027, 11000028, 11000030,
    11000031, 11000032, 11000033, 11000034, 11000035, 11000036, 11000037,
    11000038, 11000039, 11000040, 11000041, 11000042, 11000043, 11000044,
    11000045,
  ]

  constructor() {
    const costumeData = Client.cachedExcelBinOutput.get(
      'AvatarCostumeExcelConfigData',
    )
    if (!costumeData) {
      throw Error('ExcelBinOutput cache not found')
    }

    const costumeDataArray = costumeData.get() as JsonArray
    const jeanCostume = costumeDataArray.find(
      (data) =>
        (data as JsonObject).jsonName === 'Avatar_Lady_Sword_QinCostumeSea',
    ) as JsonObject
    const dilucCostume = costumeDataArray.find(
      (data) =>
        (data as JsonObject).jsonName ===
        'Avatar_Male_Claymore_DilucCostumeFlamme',
    ) as JsonObject

    this.replaceDatas.push(
      new ReplaceData(
        Object.entries(jeanCostume).find(
          ([, v]) => v === 200301,
        )?.[0] as string,
        'costumeId',
      ),
    )
    this.replaceDatas.push(
      new ReplaceData(
        Object.entries(jeanCostume).find(
          ([, v]) => v === 10000003,
        )?.[0] as string,
        'avatarId',
      ),
    )
    this.replaceDatas.push(
      new ReplaceData(
        Object.entries(jeanCostume).find(
          ([k, v]) => v === 4 && dilucCostume[k] === 5,
        )?.[0] as string,
        'rarity',
      ),
    )
  }
  private decode(jsonData: JsonParser) {
    const jsonArray = jsonData.get() as JsonArray
    jsonArray.forEach((v) => {
      const obj = v as JsonObject
      this.replaceDatas.forEach((replaceData) => {
        if (obj[replaceData.oldKey] !== undefined) {
          obj[replaceData.newKey] = obj[replaceData.oldKey]
        }
      })
    })
  }
  private setKey(jsonData: JsonParser, filename: keyof typeof ExcelBinOutputs) {
    const jsonArray = jsonData.get() as JsonArray
    const cacheObject: { [key in string]: JsonValue } = {}
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
          cacheObject[obj.weaponPromoteId as string] = obj
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
          cacheObject[obj.costumeId as string] = obj
          break
        case 'AvatarTalentExcelConfigData':
          cacheObject[obj.talentId as string] = obj
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

        //Progress
        case 'FetterStoryExcelConfigData':
          cacheObject[obj.fetterId as string] = obj
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

  public execute(jsonData: JsonParser, filename: keyof typeof ExcelBinOutputs) {
    this.decode(jsonData)
    return this.setKey(jsonData, filename)
  }
}
