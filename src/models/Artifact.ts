import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { createArtifactLevelSchema } from '@/schemas/createArtifactLevelSchema'
import { EquipType } from '@/types/generated/ReliquaryExcelConfigData'
import { FightPropType } from '@/types/types'
import { toFightPropType } from '@/utils/typeGuards/toFightPropType'
import { validate } from '@/utils/validation/validate'
/**
 * Represents a sub-stat property of an artifact
 */
export interface ArtifactAffixAppendProp {
  /**
   * Unique identifier for the append property
   */
  id: number
  /**
   * Type of the stat property
   */
  type: FightPropType
  /**
   * Value of the stat property
   */
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
  public readonly type: EquipType
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
   * Artifact set description
   * @key Number of pieces required (1, 2, or 4)
   * @value Set bonus description
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
   * @param mainPropId main stat ID from ReliquaryMainPropExcelConfigData.json
   * @param level artifact level (0-20)
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
    this.type = artifactJson.equipType
    const nameTextMapHash = artifactJson.nameTextMapHash
    const descTextMapHash = artifactJson.descTextMapHash
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''
    this.description = Client._cachedTextMap.get(descTextMapHash) ?? ''
    this.rarity = artifactJson.rankLevel
    this.setId = artifactJson.setId as number | undefined
    const maxLevel = Artifact.maxLevelMap[this.rarity]
    const artifactLevelSchema = createArtifactLevelSchema(maxLevel)
    this.level = validate(artifactLevelSchema, this.level, {
      propertyKey: 'level',
    })
    if (this.setId) {
      const setJson = Client._getJsonFromCachedExcelBinOutput(
        'ReliquarySetExcelConfigData',
        this.setId,
      )
      const equipAffixId = setJson.equipAffixId * 10 + 0
      const equipAffixJson = Client._getJsonFromCachedExcelBinOutput(
        'EquipAffixExcelConfigData',
        equipAffixId,
      )

      const nameTextMapHash = equipAffixJson.nameTextMapHash
      this.setName = Client._cachedTextMap.get(nameTextMapHash)

      if (Artifact.oneSetBonusIds.includes(this.setId)) {
        const descTextMapHash = equipAffixJson.descTextMapHash
        this.setDescriptions[1] = Client._cachedTextMap.get(descTextMapHash)
      } else {
        const equipAffixJsonBy2pc = Client._getJsonFromCachedExcelBinOutput(
          'EquipAffixExcelConfigData',
          equipAffixId,
        )
        const descTextMapHashFor2pc = equipAffixJsonBy2pc.descTextMapHash
        this.setDescriptions[2] = Client._cachedTextMap.get(
          descTextMapHashFor2pc,
        )

        const equipAffixJsonBy4pc = Client._getJsonFromCachedExcelBinOutput(
          'EquipAffixExcelConfigData',
          equipAffixId + 1,
        )
        const descTextMapHashFor4pc = equipAffixJsonBy4pc.descTextMapHash
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
      artifactMainJson.propType,
    )
    const realityJson = reliquaryLevelJson[this.rarity] as
      | Record<number, number>
      | undefined
    if (!realityJson) {
      throw new AssetNotFoundError(
        `rarity ${String(this.rarity)}`,
        'ReliquaryLevelExcelConfigData',
      )
    }
    const mainValue = realityJson[this.level]
    if (!mainValue) {
      throw new AssetNotFoundError(
        `level ${String(this.level)}`,
        'ReliquaryLevelExcelConfigData',
      )
    }
    this.mainStat = new StatProperty(
      toFightPropType(artifactMainJson.propType, 'mainStat'),
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
        type: toFightPropType(artifactAffixJson.propType, 'appendProp'),
        value: artifactAffixJson.propValue,
      }
    })
    this.icon = new ImageAssets(artifactJson.icon)
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
    return artifactDatas
      .filter(
        (data): data is NonNullable<typeof data> =>
          data?.setId !== undefined &&
          !this.blackSetIds.includes(data.setId) &&
          !this.blackArtifactIds.includes(data.id),
      )
      .map((data) => data.id)
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
    return Artifact.maxLevelMap[artifactJson.rankLevel]
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
      const propType = toFightPropType(artifactAffixJson.propType, 'subStat')
      const propValue = result[propType]
      if (propValue) result[propType] = propValue + artifactAffixJson.propValue
      else result[propType] = artifactAffixJson.propValue
    })
    return Object.entries(result).map(([key, value]) => {
      return new StatProperty(toFightPropType(key, 'subStatResult'), value)
    })
  }
}
