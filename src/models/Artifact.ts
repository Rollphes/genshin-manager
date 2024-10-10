import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { ArtifactType, FightPropType } from '@/types'
import { JsonObject } from '@/utils/JsonParser'
interface ArtifactAffixAppendProp {
  id: number
  type: FightPropType
  value: number
}
/**
 * Class of artifact
 */
export class Artifact {
  /**
   * Max level map of artifacts by rarity
   */
  private static readonly maxLevelMap: { [rarity: number]: number } = {
    1: 5,
    2: 5,
    3: 12,
    4: 16,
    5: 20,
  }
  /**
   * IDs of set bonuses that can be activated with one artifact
   */
  private static readonly oneSetBonusIds: number[] = [
    15009, 15010, 15011, 15012, 15013,
  ]
  /**
   * IDs of set bonuses that cannot be obtained
   */
  private static readonly blackSetIds: number[] = [15000, 15004, 15012]
  /**
   * IDs of artifacts that cannot be obtained
   */
  private static readonly blackArtifactIds: number[] = [
    23300, 23301, 23302, 23303, 23304, 23305, 23306, 23307, 23308, 23309, 23310,
    23311, 23312, 23313, 23314, 23315, 23316, 23317, 23318, 23329, 23330, 23334,
    23335, 23336, 23337, 23338, 23339, 23340,
  ]

  /**
   * Artifact ID
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
   * Artifact set ID
   */
  public readonly setId: number | undefined
  /**
   * Artifact set name
   */
  public readonly setName: string | undefined
  /**
   * Artifact set description (index:1 = 1pc, 2 = 2pc , 4 = 4pc)
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
   * Artifact sub stats
   */
  public readonly subStats: StatProperty[]
  /**
   * Artifact sub stats
   */
  public readonly appendProps: ArtifactAffixAppendProp[]
  /**
   * Artifact icon
   */
  public readonly icon: ImageAssets

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a Artifact
   * @param artifactId Artifact ID
   * @param mainPropId Main stat ID from ReliquaryMainPropExcelConfigData.json. Default: 10001
   * @param level Artifact level (0-20). Default: 0
   * @param appendPropIds Artifact sub stat IDs
   */
  constructor(
    artifactId: number,
    mainPropId: number = 10001,
    level: number = 0,
    appendPropIds: number[] = [],
  ) {
    this.id = artifactId
    this.level = level
    const artifactJson = Client._getJsonFromCachedExcelBinOutput(
      'ReliquaryExcelConfigData',
      this.id,
    )
    this.type = artifactJson.equipType as ArtifactType
    this.name =
      Client._cachedTextMap.get(String(artifactJson.nameTextMapHash)) || ''
    this.description =
      Client._cachedTextMap.get(String(artifactJson.descTextMapHash)) || ''
    this.rarity = artifactJson.rankLevel as number
    this.setId = artifactJson.setId as number | undefined
    const maxLevel = Artifact.maxLevelMap[this.rarity]
    if (this.level < 0 || this.level > maxLevel)
      throw new OutOfRangeError('level', this.level, 0, maxLevel)
    if (this.setId) {
      const setJson = Client._getJsonFromCachedExcelBinOutput(
        'ReliquarySetExcelConfigData',
        this.setId,
      )
      const equipAffixId = (setJson.equipAffixId as number) * 10 + 0
      const equipAffixJson = Client._getJsonFromCachedExcelBinOutput(
        'EquipAffixExcelConfigData',
        equipAffixId,
      )

      this.setName = Client._cachedTextMap.get(
        String(equipAffixJson.nameTextMapHash),
      )

      if (Artifact.oneSetBonusIds.includes(this.setId)) {
        this.setDescriptions[1] = equipAffixJson
          ? Client._cachedTextMap.get(String(equipAffixJson.descTextMapHash))
          : undefined
      } else {
        const equipAffixJsonBy2pc = Client._getJsonFromCachedExcelBinOutput(
          'EquipAffixExcelConfigData',
          equipAffixId,
        )
        this.setDescriptions[2] = equipAffixJsonBy2pc
          ? Client._cachedTextMap.get(
              String(equipAffixJsonBy2pc.descTextMapHash),
            )
          : undefined

        const equipAffixJsonBy4pc = Client._getJsonFromCachedExcelBinOutput(
          'EquipAffixExcelConfigData',
          equipAffixId + 1,
        )
        this.setDescriptions[4] = equipAffixJsonBy4pc
          ? Client._cachedTextMap.get(
              String(equipAffixJsonBy4pc.descTextMapHash),
            )
          : undefined
      }
    }
    const artifactMainJson = Client._getJsonFromCachedExcelBinOutput(
      'ReliquaryMainPropExcelConfigData',
      mainPropId,
    )
    const mainValue = (
      Client._getJsonFromCachedExcelBinOutput(
        'ReliquaryLevelExcelConfigData',
        artifactMainJson.propType as string,
      )[this.rarity] as JsonObject
    )[this.level] as number
    this.mainStat = new StatProperty(
      artifactMainJson.propType as FightPropType,
      mainValue,
    )
    this.subStats = this.getSubStatProperties(appendPropIds)
    this.appendProps = appendPropIds.map((propId) => {
      const artifactAffixJson = Client._getJsonFromCachedExcelBinOutput(
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
   * Get all artifact IDs
   * @returns All artifact IDs
   */
  public static get allArtifactIds(): number[] {
    const artifactDatas = Object.values(
      Client._getCachedExcelBinOutputByName('ReliquaryExcelConfigData'),
    )
    const filteredArtifactDatas = artifactDatas.filter(
      (data) =>
        !this.blackSetIds.includes(data.setId as number) &&
        !this.blackArtifactIds.includes(data.id as number),
    )
    return filteredArtifactDatas.map((data) => data.id as number)
  }

  /**
   * Get max level by artifact ID
   * @param artifactId Artifact ID
   * @returns Max level
   */
  public static getMaxLevelByArtifactId(artifactId: number): number {
    const artifactJson = Client._getJsonFromCachedExcelBinOutput(
      'ReliquaryExcelConfigData',
      artifactId,
    )
    return Artifact.maxLevelMap[artifactJson.rankLevel as number]
  }

  /**
   * Get sub stat properties from appendProp IDs
   * @param appendPropIds Artifact sub stat IDs
   * @returns Sub stat properties
   */
  private getSubStatProperties(appendPropIds: number[]): StatProperty[] {
    const result: Partial<{ [key in FightPropType]: number }> = {}
    appendPropIds.forEach((propId) => {
      const artifactAffixJson = Client._getJsonFromCachedExcelBinOutput(
        'ReliquaryAffixExcelConfigData',
        propId,
      )
      const propType = artifactAffixJson.propType as FightPropType
      const propValue = result[propType]
      if (propValue)
        result[propType] = propValue + (artifactAffixJson.propValue as number)
      else result[propType] = artifactAffixJson.propValue as number
    })
    return Object.keys(result).map((key) => {
      return new StatProperty(
        key as FightPropType,
        result[key as FightPropType] as number,
      )
    })
  }
}
