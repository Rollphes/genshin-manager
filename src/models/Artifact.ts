import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { ArtifactType, FightPropType } from '@/types'
import { JsonObject } from '@/types/json'
interface ArtifactAffixAppendProp {
  id: number
  type: FightPropType
  value: number
}
/**
 * Represents a game artifact with stats and set bonuses
 */
export class Artifact {
  /**
   * Max level map of artifacts by rarity
   */
  private static readonly maxLevelMap: Record<number, number> = {
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
  public readonly setDescriptions: Record<number, string | undefined> = {}
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
   * @param artifactId artifact ID
   * @param mainPropId main stat ID from ReliquaryMainPropExcelConfigData.json. Default: 10001
   * @param level artifact level (0-20). Default: 0
   * @param appendPropIds artifact sub stat IDs
   * @example
   * ```ts
   * const artifact = new Artifact(81101, 10001, 20, [501221, 501231])
   * console.log(artifact.name)
   * console.log(artifact.mainStat.value)
   * ```
   */
  constructor(
    artifactId: number,
    mainPropId = 10001,
    level = 0,
    appendPropIds: number[] = [],
  ) {
    this.id = artifactId
    this.level = level
    const artifactJson = Client._getJsonFromCachedExcelBinOutput(
      'ReliquaryExcelConfigData',
      this.id,
    )
    this.type = artifactJson.equipType as ArtifactType
    const nameTextMapHash = artifactJson.nameTextMapHash as number
    const descTextMapHash = artifactJson.descTextMapHash as number
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''
    this.description = Client._cachedTextMap.get(descTextMapHash) ?? ''
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

      const nameTextMapHash = equipAffixJson.nameTextMapHash as number
      this.setName = Client._cachedTextMap.get(nameTextMapHash)

      if (Artifact.oneSetBonusIds.includes(this.setId)) {
        const descTextMapHash = equipAffixJson.descTextMapHash as number
        this.setDescriptions[1] = Client._cachedTextMap.get(descTextMapHash)
      } else {
        const equipAffixJsonBy2pc = Client._getJsonFromCachedExcelBinOutput(
          'EquipAffixExcelConfigData',
          equipAffixId,
        )
        const descTextMapHashFor2pc =
          equipAffixJsonBy2pc.descTextMapHash as number
        this.setDescriptions[2] = Client._cachedTextMap.get(
          descTextMapHashFor2pc,
        )

        const equipAffixJsonBy4pc = Client._getJsonFromCachedExcelBinOutput(
          'EquipAffixExcelConfigData',
          equipAffixId + 1,
        )
        const descTextMapHashFor4pc =
          equipAffixJsonBy4pc.descTextMapHash as number
        this.setDescriptions[4] = Client._cachedTextMap.get(
          descTextMapHashFor4pc,
        )
      }
    }
    const artifactMainJson = Client._getJsonFromCachedExcelBinOutput(
      'ReliquaryMainPropExcelConfigData',
      mainPropId,
    )
    const reliquaryLevelJson = Client._getJsonFromCachedExcelBinOutput(
      'ReliquaryLevelExcelConfigData',
      artifactMainJson.propType as string,
    )
    const realityJson = reliquaryLevelJson[this.rarity] as JsonObject
    const mainValue = realityJson[this.level] as number
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
   * @returns all artifact IDs
   * @example
   * ```ts
   * const allIds = Artifact.allArtifactIds
   * console.log(allIds.length)
   * ```
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
   * @param artifactId artifact ID
   * @returns max level
   * @example
   * ```ts
   * const maxLevel = Artifact.getMaxLevelByArtifactId(81101)
   * console.log(maxLevel) // 20 for 5-star artifacts
   * ```
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
   * @param appendPropIds artifact sub stat IDs
   * @returns sub stat properties
   */
  private getSubStatProperties(appendPropIds: number[]): StatProperty[] {
    const result: Partial<Record<FightPropType, number>> = {}
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
        result[key as FightPropType] ?? 0,
      )
    })
  }
}
