import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { FightPropType, StatProperty } from '@/models/StatProperty'
import { JsonObject } from '@/utils/JsonParser'
interface ArtifactAffixAppendProp {
  id: number
  type: FightPropType
  value: number
}
export class Artifact {
  public readonly id: number
  public readonly level: number
  public readonly type: ArtifactType
  public readonly name: string
  public readonly description: string
  public readonly setId: number | undefined
  public readonly setName: string | undefined
  public readonly setDescriptionBy2pc: string | undefined
  public readonly setDescriptionBy4pc: string | undefined
  public readonly rarity: number
  public readonly mainStat: StatProperty
  public readonly subStats: StatProperty[]
  public readonly appendPropList: ArtifactAffixAppendProp[]
  public readonly icon: ImageAssets
  constructor(
    artifactId: number,
    mainPropId: number,
    level: number = 0,
    appendPropIdList: number[] = [],
  ) {
    this.id = artifactId
    this.level = level
    const artifactJson = Client.cachedExcelBinOutputGetter(
      'ReliquaryExcelConfigData',
      this.id,
    )
    this.type = artifactJson.equipType as ArtifactType
    this.name =
      Client.cachedTextMap.get(String(artifactJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(artifactJson.descTextMapHash)) || ''
    this.rarity = artifactJson.rankLevel as number
    this.setId = artifactJson.setId as number | undefined
    if (this.setId) {
      const setJson = Client.cachedExcelBinOutputGetter(
        'ReliquarySetExcelConfigData',
        this.setId,
      )
      const equipAffixJsonBy2pc = Client.cachedExcelBinOutputGetter(
        'EquipAffixExcelConfigData',
        (setJson.EquipAffixId as number) * 10 + 0,
      )
      const equipAffixJsonBy4pc = Client.cachedExcelBinOutputGetter(
        'EquipAffixExcelConfigData',
        (setJson.EquipAffixId as number) * 10 + 1,
      )
      this.setName = Client.cachedTextMap.get(
        String(equipAffixJsonBy2pc.nameTextMapHash),
      )
      this.setDescriptionBy2pc = Client.cachedTextMap.get(
        String(equipAffixJsonBy2pc.descTextMapHash),
      )
      this.setDescriptionBy4pc = Client.cachedTextMap.get(
        String(equipAffixJsonBy4pc.descTextMapHash),
      )
    }
    const artifactMainJson = Client.cachedExcelBinOutputGetter(
      'ReliquaryMainPropExcelConfigData',
      mainPropId,
    )
    const mainValue = (
      Client.cachedExcelBinOutputGetter(
        'ReliquaryLevelExcelConfigData',
        artifactMainJson.propType as string,
      )[this.rarity] as JsonObject
    )[this.level] as number
    this.mainStat = new StatProperty(
      artifactMainJson.propType as FightPropType,
      mainValue,
    )
    this.subStats = this.getSubStatProperties(appendPropIdList)
    this.appendPropList = appendPropIdList.map((propId) => {
      const artifactAffixJson = Client.cachedExcelBinOutputGetter(
        'ReliquaryAffixExcelConfigData',
        propId,
      )
      return {
        id: propId,
        type: artifactAffixJson.propType as FightPropType,
        value: artifactAffixJson.propValue as number,
      }
    })
    this.icon = new ImageAssets(artifactJson.icon as string)
  }
  private getSubStatProperties(appendPropIdList: number[]) {
    const result: Partial<{ [key in FightPropType]: number }> = {}
    appendPropIdList.forEach((propId) => {
      const artifactAffixJson = Client.cachedExcelBinOutputGetter(
        'ReliquaryAffixExcelConfigData',
        propId,
      )
      const propType = artifactAffixJson.propType as FightPropType
      result[propType] =
        result[propType] ?? 0 + (artifactAffixJson.propValue as number)
    })
    return Object.keys(result).map((key) => {
      return new StatProperty(
        key as FightPropType,
        result[key as FightPropType] as number,
      )
    })
  }
}
export type ArtifactType =
  | 'EQUIP_BRACER'
  | 'EQUIP_NECKLACE'
  | 'EQUIP_SHOES'
  | 'EQUIP_RING'
  | 'EQUIP_DRESS'
