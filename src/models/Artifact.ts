import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { FightPropType, StatProperty } from '@/models/StatProperty'
import { JsonObject } from '@/utils/JsonParser'
interface ArtifactAffixAppendProp {
  id: number
  type: FightPropType
  value: number
}
/**
 * Class of artifact.
 */
export class Artifact {
  /**
   * Artifact id
   */
  public readonly id: number
  /**
   * Artifact level
   */
  public readonly level: number
  /**
   * Artifact type
   */
  public readonly type: ArtifactType
  /**
   * Artifact name
   */
  public readonly name: string
  /**
   * Artifact description
   */
  public readonly description: string
  /**
   * Artifact set id
   */
  public readonly setId: number | undefined
  /**
   * Artifact set name
   */
  public readonly setName: string | undefined
  /**
   * Artifact set description
   */
  public readonly setDescriptions: { [count: number]: string | undefined } = {}
  /**
   * Artifact rarity
   */
  public readonly rarity: number
  /**
   * Main stat
   */
  public readonly mainStat: StatProperty
  /**
   * Artifact sub stat list
   */
  public readonly subStats: StatProperty[]
  /**
   * Artifact sub stat id list
   */
  public readonly appendPropList: ArtifactAffixAppendProp[]
  /**
   * Artifact icon
   */
  public readonly icon: ImageAssets
  /**
   * IDs of set bonuses that can be activated with one artifact.
   */
  private readonly oneSetBonusIds: number[] = [15009, 15010, 15011, 15013]

  constructor(
    artifactId: number,
    mainPropId: number,
    level: number = 0,
    appendPropIdList: number[] = [],
  ) {
    this.id = artifactId
    this.level = level - 1
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
      const equipAffixId = (setJson.EquipAffixId as number) * 10 + 0
      const equipAffixJson = Client.cachedExcelBinOutputGetter(
        'EquipAffixExcelConfigData',
        equipAffixId,
      )

      this.setName = Client.cachedTextMap.get(
        String(equipAffixJson.nameTextMapHash),
      )

      if (this.oneSetBonusIds.includes(this.setId)) {
        this.setDescriptions[1] = equipAffixJson
          ? Client.cachedTextMap.get(String(equipAffixJson.descTextMapHash))
          : undefined
      } else {
        const equipAffixJsonBy2pc = Client.cachedExcelBinOutputGetter(
          'EquipAffixExcelConfigData',
          equipAffixId,
        )
        this.setDescriptions[2] = equipAffixJsonBy2pc
          ? Client.cachedTextMap.get(
              String(equipAffixJsonBy2pc.descTextMapHash),
            )
          : undefined

        const equipAffixJsonBy4pc = Client.cachedExcelBinOutputGetter(
          'EquipAffixExcelConfigData',
          equipAffixId + 1,
        )
        this.setDescriptions[4] = equipAffixJsonBy4pc
          ? Client.cachedTextMap.get(
              String(equipAffixJsonBy4pc.descTextMapHash),
            )
          : undefined
      }
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
    )[this.level + 1] as number
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

  /**
   * Get sub stat properties from appendPropIdList.
   * @param appendPropIdList
   * @returns
   */
  private getSubStatProperties(appendPropIdList: number[]) {
    const result: Partial<{ [key in FightPropType]: number }> = {}
    appendPropIdList.forEach((propId) => {
      const artifactAffixJson = Client.cachedExcelBinOutputGetter(
        'ReliquaryAffixExcelConfigData',
        propId,
      )
      const propType = artifactAffixJson.propType as FightPropType
      const propValue = result[propType]
      if (propValue) {
        result[propType] = propValue + (artifactAffixJson.propValue as number)
      } else {
        result[propType] = artifactAffixJson.propValue as number
      }
    })
    return Object.keys(result).map((key) => {
      return new StatProperty(
        key as FightPropType,
        result[key as FightPropType] as number,
      )
    })
  }
  /**
   * Get all artifact ids
   * @returns All artifact ids
   */
  public static getAllArtifactIds(): number[] {
    const artifactDatas = Object.values(
      Client.cachedExcelBinOutput
        .get('ReliquaryExcelConfigData')
        ?.get() as JsonObject,
    ) as JsonObject[]
    return artifactDatas.map((data) => data.id as number)
  }
}
export type ArtifactType =
  | 'EQUIP_BRACER'
  | 'EQUIP_NECKLACE'
  | 'EQUIP_SHOES'
  | 'EQUIP_RING'
  | 'EQUIP_DRESS'
