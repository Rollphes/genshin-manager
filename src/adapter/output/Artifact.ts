import { ImageAssets } from '@/adapter/output/assets/ImageAssets'
import { StatProperty } from '@/adapter/output/StatProperty'
import { Client } from '@/application/client/Client'
import { createArtifactLevelSchema } from '@/domain/schemas/createArtifactLevelSchema'
import { toEnum } from '@/domain/typeGuards/toEnum'
import { EquipType, FightProp } from '@/domain/types/enums'
import { validate } from '@/domain/validation/validate'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'
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
  type: FightProp
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
   * @param artifactId - artifact ID
   * @param mainPropId - main stat ID from ReliquaryMainPropExcelConfigData.json
   * @param level - artifact level (0-20)
   * @param appendPropIds - artifact sub stat IDs
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
    appendPropIds: readonly number[] = [],
  ) {
    this.id = artifactId
    this.level = level
    const artifactJson = Client._findBy(
      'ReliquaryExcelConfigData',
      'id',
      this.id,
    )
    if (!artifactJson) {
      throw new AssetNotFoundError(
        `Reliquary ${String(this.id)}`,
        'ReliquaryExcelConfigData',
      )
    }
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
      const setJson = Client._findBy(
        'ReliquarySetExcelConfigData',
        'setId',
        this.setId,
      )
      if (!setJson) {
        throw new AssetNotFoundError(
          `ReliquarySet ${String(this.setId)}`,
          'ReliquarySetExcelConfigData',
        )
      }
      const equipAffixId = setJson.equipAffixId * 10 + 0
      const equipAffixJson = Client._findBy(
        'EquipAffixExcelConfigData',
        'affixId',
        equipAffixId,
      )
      if (!equipAffixJson) {
        throw new AssetNotFoundError(
          `EquipAffix ${String(equipAffixId)}`,
          'EquipAffixExcelConfigData',
        )
      }

      const nameTextMapHash = equipAffixJson.nameTextMapHash
      this.setName = Client._cachedTextMap.get(nameTextMapHash)

      if (Artifact.oneSetBonusIds.includes(this.setId)) {
        const descTextMapHash = equipAffixJson.descTextMapHash
        this.setDescriptions[1] = Client._cachedTextMap.get(descTextMapHash)
      } else {
        const equipAffixJsonBy2pc = Client._findBy(
          'EquipAffixExcelConfigData',
          'affixId',
          equipAffixId,
        )
        if (!equipAffixJsonBy2pc) {
          throw new AssetNotFoundError(
            `EquipAffix ${String(equipAffixId)}`,
            'EquipAffixExcelConfigData',
          )
        }
        const descTextMapHashFor2pc = equipAffixJsonBy2pc.descTextMapHash
        this.setDescriptions[2] = Client._cachedTextMap.get(
          descTextMapHashFor2pc,
        )

        const equipAffixJsonBy4pc = Client._findBy(
          'EquipAffixExcelConfigData',
          'affixId',
          equipAffixId + 1,
        )
        if (!equipAffixJsonBy4pc) {
          throw new AssetNotFoundError(
            `EquipAffix ${String(equipAffixId + 1)}`,
            'EquipAffixExcelConfigData',
          )
        }
        const descTextMapHashFor4pc = equipAffixJsonBy4pc.descTextMapHash
        this.setDescriptions[4] = Client._cachedTextMap.get(
          descTextMapHashFor4pc,
        )
      }
    }
    const artifactMainJson = Client._findBy(
      'ReliquaryMainPropExcelConfigData',
      'id',
      mainPropId,
    )
    if (!artifactMainJson) {
      throw new AssetNotFoundError(
        `ReliquaryMainProp ${String(mainPropId)}`,
        'ReliquaryMainPropExcelConfigData',
      )
    }
    const reliquaryLevelRecords = Client._filterBy(
      'ReliquaryLevelExcelConfigData',
      'rank',
      this.rarity,
    )
    // Data level is 1-indexed, Artifact level is 0-indexed (0-20)
    const levelRecord = reliquaryLevelRecords.find(
      (r) => r.level === this.level + 1,
    )
    if (!levelRecord) {
      throw new AssetNotFoundError(
        `ReliquaryLevel rank ${String(this.rarity)} level ${String(this.level)}`,
        'ReliquaryLevelExcelConfigData',
      )
    }
    const mainProp = levelRecord.addProps.find(
      (p) => (p.propType as string) === artifactMainJson.propType,
    )
    if (!mainProp) {
      throw new AssetNotFoundError(
        `ReliquaryLevel propType ${artifactMainJson.propType}`,
        'ReliquaryLevelExcelConfigData',
      )
    }
    const mainValue = mainProp.value
    this.mainStat = new StatProperty(
      toEnum(FightProp, artifactMainJson.propType, 'FightProp', {
        source: 'ReliquaryMainPropExcelConfigData',
        recordId: artifactMainJson.id,
        path: 'propType',
      }),
      mainValue,
    )
    this.subStats = this.getSubStatProperties(appendPropIds)
    this.appendProps = appendPropIds.map((propId) => {
      const artifactAffixJson = Client._findBy(
        'ReliquaryAffixExcelConfigData',
        'id',
        propId,
      )
      if (!artifactAffixJson) {
        throw new AssetNotFoundError(
          `ReliquaryAffix ${String(propId)}`,
          'ReliquaryAffixExcelConfigData',
        )
      }
      return {
        id: propId,
        type: toEnum(FightProp, artifactAffixJson.propType, 'FightProp', {
          source: 'ReliquaryAffixExcelConfigData',
          recordId: propId,
          path: 'propType',
        }),
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
    const artifactDatas = Client._getAll('ReliquaryExcelConfigData')
    return artifactDatas
      .filter(
        (data) =>
          !this.blackSetIds.includes(data.setId) &&
          !this.blackArtifactIds.includes(data.id),
      )
      .map((data) => data.id)
  }

  /**
   * Get max level by artifact ID
   * @param artifactId - artifact ID
   * @returns max level
   * @throws {@link AssetNotFoundError} - When the artifact data is not found
   * @example
   * ```ts
   * const maxLevel = Artifact.getMaxLevelByArtifactId(81101)
   * console.log(maxLevel) // 20 for 5-star artifacts
   * ```
   */
  public static getMaxLevelByArtifactId(artifactId: number): number {
    const artifactJson = Client._findBy(
      'ReliquaryExcelConfigData',
      'id',
      artifactId,
    )
    if (!artifactJson) {
      throw new AssetNotFoundError(
        `Reliquary ${String(artifactId)}`,
        'ReliquaryExcelConfigData',
      )
    }
    return Artifact.maxLevelMap[artifactJson.rankLevel]
  }

  /**
   * Get sub stat properties from appendProp IDs
   * @param appendPropIds - artifact sub stat IDs
   * @returns sub stat properties
   */
  private getSubStatProperties(
    appendPropIds: readonly number[],
  ): StatProperty[] {
    const result: Partial<Record<FightProp, number>> = {}
    appendPropIds.forEach((propId) => {
      const artifactAffixJson = Client._findBy(
        'ReliquaryAffixExcelConfigData',
        'id',
        propId,
      )
      if (!artifactAffixJson) {
        throw new AssetNotFoundError(
          `ReliquaryAffix ${String(propId)}`,
          'ReliquaryAffixExcelConfigData',
        )
      }
      const propType = toEnum(
        FightProp,
        artifactAffixJson.propType,
        'FightProp',
        {
          source: 'ReliquaryAffixExcelConfigData',
          recordId: propId,
          path: 'propType',
        },
      )
      const propValue = result[propType]
      if (propValue) result[propType] = propValue + artifactAffixJson.propValue
      else result[propType] = artifactAffixJson.propValue
    })
    return Object.entries(result).map(([key, value]) => {
      return new StatProperty(
        toEnum(FightProp, key, 'FightProp', { path: 'aggregatedSubStat' }),
        value,
      )
    })
  }
}
