import { ExcelBinPropertyNotFoundError } from '@genshin-manager/core'
import type { ExcelBinCache, TextMapIndex } from '@genshin-manager/data'

import type { ArtifactAppendProp } from '@/artifact/Artifact'
import { Artifact } from '@/artifact/Artifact'
import { SetBonus } from '@/artifact/SetBonus'
import { ImageAssets } from '@/assets/ImageAssets'
import { StatProperty } from '@/common/StatProperty'
import { EquipType, FightProp } from '@/types/enums'
import type { RepositoryDependencies } from '@/types/RepositoryDependencies'

/**
 * Repository for building Artifact and SetBonus DTOs from ExcelBin and TextMap data.
 */
export class ArtifactRepository {
  /** Max level map by rarity */
  private static readonly maxLevelMap: Record<number, number> = {
    1: 5,
    2: 5,
    3: 12,
    4: 16,
    5: 20,
  }

  /** Set IDs that activate with 1 piece */
  private static readonly oneSetBonusIds = new Set([
    15009, 15010, 15011, 15012, 15013,
  ])

  /** Unobtainable set IDs */
  private static readonly blackSetIds = new Set([15000, 15004, 15012])

  /** Unobtainable artifact IDs */
  private static readonly blackArtifactIds = new Set([
    23300, 23301, 23302, 23303, 23304, 23305, 23306, 23307, 23308, 23309, 23310,
    23311, 23312, 23313, 23314, 23315, 23316, 23317, 23318, 23329, 23330, 23334,
    23335, 23336, 23337, 23338, 23339, 23340,
  ])

  private readonly excelBinCache: ExcelBinCache
  private readonly textMap: TextMapIndex
  private readonly imageBaseURL: string

  /**
   * Create an ArtifactRepository
   * @param deps - Repository dependencies
   * @param imageBaseURL - Base URL for image assets
   */
  constructor(deps: RepositoryDependencies, imageBaseURL: string) {
    this.excelBinCache = deps.excelBinCache
    this.textMap = deps.textMap
    this.imageBaseURL = imageBaseURL
  }

  /**
   * Build an Artifact DTO
   * @param artifactId - Artifact ID
   * @param mainPropId - Main stat ID from ReliquaryMainPropExcelConfigData
   * @param level - Artifact level (0-20)
   * @param appendPropIds - Sub-stat append prop IDs
   * @returns Artifact DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getArtifact(
    artifactId: number,
    mainPropId = 10001,
    level = 0,
    appendPropIds: readonly number[] = [],
  ): Promise<Artifact> {
    const result = await this.excelBinCache
      .fromWithTextMap('ReliquaryExcelConfigData', this.textMap)
      .select([
        'id',
        'nameTextMapHash',
        'descTextMapHash',
        'rankLevel',
        'setId',
        'equipType',
        'icon',
      ])
      .where('id', artifactId)
      .executeTakeFirst()

    if (!result) {
      throw new ExcelBinPropertyNotFoundError(
        'ReliquaryExcelConfigData',
        artifactId,
      )
    }

    const name = result.nameTextMapHash.toText()
    const description = result.descTextMapHash.toText()

    const rarity = result.rankLevel.value
    const setId = result.setId.value

    const { setName, setDescriptions } = setId
      ? await this.resolveSetInfo(setId)
      : { setName: undefined, setDescriptions: {} }

    // Main stat
    const mainStat = await this.resolveMainStat(mainPropId, rarity, level)

    // Sub stats
    const { subStats, appendProps } = await this.resolveSubStats(appendPropIds)

    return new Artifact({
      id: artifactId,
      level,
      type: result.equipType.toEnum(EquipType),
      name,
      description,
      setId,
      setName,
      setDescriptions,
      rarity,
      mainStat,
      subStats,
      appendProps,
      icon: new ImageAssets({
        name: result.icon.value,
        imageBaseURL: this.imageBaseURL,
      }),
    })
  }

  /**
   * Get all obtainable artifact IDs
   * @returns Array of artifact IDs
   */
  public async getAllArtifactIds(): Promise<number[]> {
    const results = await this.excelBinCache
      .from('ReliquaryExcelConfigData')
      .select(['id', 'setId'])
      .execute()

    return results
      .filter((r) => {
        const setIdValue = r.setId.value
        return (
          !ArtifactRepository.blackSetIds.has(setIdValue) &&
          !ArtifactRepository.blackArtifactIds.has(r.id.value)
        )
      })
      .map((r) => r.id.value)
  }

  /**
   * Build a SetBonus DTO from equipped artifacts
   * @param artifacts - Array of equipped Artifact DTOs
   * @returns SetBonus DTO
   */
  public buildSetBonus(artifacts: readonly Artifact[]): SetBonus {
    const pieceCountBySetId = new Map<number, number>()
    const firstArtifactBySetId = new Map<number, Artifact>()

    for (const artifact of artifacts) {
      if (artifact.setId !== undefined) {
        pieceCountBySetId.set(
          artifact.setId,
          (pieceCountBySetId.get(artifact.setId) ?? 0) + 1,
        )
        if (!firstArtifactBySetId.has(artifact.setId))
          firstArtifactBySetId.set(artifact.setId, artifact)
      }
    }

    const one: Artifact[] = []
    const two: Artifact[] = []
    const four: Artifact[] = []

    for (const [setId, count] of pieceCountBySetId) {
      const artifact = firstArtifactBySetId.get(setId)
      if (!artifact) continue

      if (ArtifactRepository.oneSetBonusIds.has(setId)) one.push(artifact)
      else if (count >= 4) four.push(artifact)
      else if (count >= 2) two.push(artifact)
    }

    return new SetBonus({
      oneSetBonus: one,
      twoSetBonus: two,
      fourSetBonus: four,
    })
  }

  /**
   * Get max level for an artifact by rarity
   * @param rarity - Artifact rarity (1-5)
   * @returns Max level
   */
  public getMaxLevel(rarity: number): number {
    return ArtifactRepository.maxLevelMap[rarity] ?? 0
  }

  /**
   * Resolve set name and descriptions
   * @param setId - Set ID
   * @returns Set info
   */
  private async resolveSetInfo(setId: number): Promise<{
    setName: string
    setDescriptions: Record<number, string | undefined>
  }> {
    const setResult = await this.excelBinCache
      .from('ReliquarySetExcelConfigData')
      .select(['setId', 'equipAffixId'])
      .where('setId', setId)
      .executeTakeFirst()

    if (!setResult) {
      throw new ExcelBinPropertyNotFoundError(
        'ReliquarySetExcelConfigData',
        setId,
      )
    }

    const equipAffixId = setResult.equipAffixId.value * 10
    const affixResult = await this.excelBinCache
      .fromWithTextMap('EquipAffixExcelConfigData', this.textMap)
      .select(['affixId', 'nameTextMapHash', 'descTextMapHash'])
      .where('affixId', equipAffixId)
      .executeTakeFirst()

    if (!affixResult) {
      throw new ExcelBinPropertyNotFoundError(
        'EquipAffixExcelConfigData',
        equipAffixId,
      )
    }

    const setName = affixResult.nameTextMapHash.toText()

    const setDescriptions: Record<number, string | undefined> = {}

    if (ArtifactRepository.oneSetBonusIds.has(setId)) {
      setDescriptions[1] = affixResult.descTextMapHash.toText()
    } else {
      setDescriptions[2] = affixResult.descTextMapHash.toText()

      const affix4Result = await this.excelBinCache
        .fromWithTextMap('EquipAffixExcelConfigData', this.textMap)
        .select(['affixId', 'descTextMapHash'])
        .where('affixId', equipAffixId + 1)
        .executeTakeFirst()

      if (affix4Result)
        setDescriptions[4] = affix4Result.descTextMapHash.toText()
    }

    return { setName, setDescriptions }
  }

  /**
   * Resolve main stat from level data
   * @param mainPropId - Main prop ID
   * @param rarity - Artifact rarity
   * @param level - Artifact level
   * @returns Main stat property
   */
  private async resolveMainStat(
    mainPropId: number,
    rarity: number,
    level: number,
  ): Promise<StatProperty> {
    const mainPropResult = await this.excelBinCache
      .from('ReliquaryMainPropExcelConfigData')
      .select(['id', 'propType'])
      .where('id', mainPropId)
      .executeTakeFirst()

    if (!mainPropResult) {
      throw new ExcelBinPropertyNotFoundError(
        'ReliquaryMainPropExcelConfigData',
        mainPropId,
      )
    }

    const levelResults = await this.excelBinCache
      .from('ReliquaryLevelExcelConfigData')
      .select(['rank', 'level', 'addProps'])
      .execute()

    const levelResult = levelResults.find(
      (r) => r.rank.value === rarity && r.level.value === level + 1,
    )
    if (!levelResult) {
      throw new ExcelBinPropertyNotFoundError(
        'ReliquaryLevelExcelConfigData',
        level + 1,
      )
    }

    const addProps = levelResult.addProps.map((ap) => ({
      propType: ap.propType.toEnum(FightProp),
      value: ap.value.value,
    }))
    const mainProp = addProps.find(
      (p) => p.propType === mainPropResult.propType.toEnum(FightProp),
    )
    if (!mainProp) {
      throw new ExcelBinPropertyNotFoundError(
        'ReliquaryLevelExcelConfigData.addProps',
        mainPropResult.propType.value,
      )
    }

    const propType = mainPropResult.propType.toEnum(FightProp)

    return new StatProperty({
      type: propType,
      name: propType,
      value: mainProp.value,
    })
  }

  /**
   * Resolve sub-stats from append prop IDs
   * @param appendPropIds - Append prop IDs
   * @returns Sub-stats and individual append props
   */
  private async resolveSubStats(appendPropIds: readonly number[]): Promise<{
    subStats: StatProperty[]
    appendProps: ArtifactAppendProp[]
  }> {
    const appendProps: ArtifactAppendProp[] = []
    const aggregated = new Map<FightProp, number>()

    for (const propId of appendPropIds) {
      const affixResult = await this.excelBinCache
        .from('ReliquaryAffixExcelConfigData')
        .select(['id', 'propType', 'propValue'])
        .where('id', propId)
        .executeTakeFirst()

      if (!affixResult) {
        throw new ExcelBinPropertyNotFoundError(
          'ReliquaryAffixExcelConfigData',
          propId,
        )
      }

      const propType = affixResult.propType.toEnum(FightProp)

      appendProps.push({
        id: propId,
        type: propType,
        value: affixResult.propValue.value,
      })

      aggregated.set(
        propType,
        (aggregated.get(propType) ?? 0) + affixResult.propValue.value,
      )
    }

    const subStats = [...aggregated.entries()].map(
      ([propType, value]) =>
        new StatProperty({
          type: propType,
          name: propType,
          value,
        }),
    )

    return { subStats, appendProps }
  }
}
