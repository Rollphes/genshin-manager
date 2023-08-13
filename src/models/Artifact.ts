import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { FightPropType, StatProperty } from '@/models/StatProperty'
import { JsonObject } from '@/utils/JsonParser'
export class Artifact {
  readonly id: number
  readonly level: number
  readonly type: ArtifactType
  readonly name: string
  readonly description: string
  readonly setId: number | undefined
  readonly setName: string | undefined
  readonly setDescriptionBy2pc: string | undefined
  readonly setDescriptionBy4pc: string | undefined
  readonly rarity: number
  readonly mainStat: StatProperty
  readonly subStats: StatProperty[]
  readonly icon: ImageAssets
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
