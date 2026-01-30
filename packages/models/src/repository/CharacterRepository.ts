import { ExcelBinPropertyNotFoundError } from '@genshin-manager/core'
import type { ExcelBinCache, TextMapIndex } from '@genshin-manager/data'

import { ImageAssets } from '@/assets/ImageAssets'
import { Character } from '@/character/Character'
import type { CostItem } from '@/character/CharacterAscension'
import { CharacterAscension } from '@/character/CharacterAscension'
import { CharacterBaseStats } from '@/character/CharacterBaseStats'
import { CharacterConstellation } from '@/character/CharacterConstellation'
import { CharacterCostume } from '@/character/CharacterCostume'
import { CharacterInfo } from '@/character/CharacterInfo'
import { CharacterInherentSkill } from '@/character/CharacterInherentSkill'
import { CharacterProfile } from '@/character/CharacterProfile'
import { CharacterStory } from '@/character/CharacterStory'
import { calculatePromoteLevel } from '@/common/calculatePromoteLevel'
import { StatProperty } from '@/common/StatProperty'
import { BodyType, CostElemType, FightProp, WeaponType } from '@/types/enums'
import type { RepositoryDependencies } from '@/types/RepositoryDependencies'
import { Element } from '@/types/types'

/**
 * Repository for building Character DTOs from ExcelBin and TextMap data.
 * All data access is async via ExcelBinCache queries.
 */
export class CharacterRepository {
  /** Element mapping from CostElemType */
  private static readonly elementMap: Record<string, Element | undefined> = {
    [CostElemType.None]: undefined,
    [CostElemType.Fire]: Element.Pyro,
    [CostElemType.Electric]: Element.Electro,
    [CostElemType.Ice]: Element.Cryo,
    [CostElemType.Wind]: Element.Anemo,
    [CostElemType.Water]: Element.Hydro,
    [CostElemType.Rock]: Element.Geo,
    [CostElemType.Grass]: Element.Dendro,
  }

  /** Quality type to rarity mapping */
  private static readonly qualityRarity: Record<string, number> = {
    QUALITY_ORANGE: 5,
    QUALITY_PURPLE: 4,
    QUALITY_ORANGE_SP: 0,
  }

  private readonly excelBinCache: ExcelBinCache
  private readonly textMap: TextMapIndex
  private readonly imageBaseURL: string

  /**
   * Create a CharacterRepository
   * @param deps - Repository dependencies
   * @param imageBaseURL - Base URL for image assets
   */
  constructor(deps: RepositoryDependencies, imageBaseURL: string) {
    this.excelBinCache = deps.excelBinCache
    this.textMap = deps.textMap
    this.imageBaseURL = imageBaseURL
  }

  /**
   * Build a full Character aggregate DTO
   * @param characterId - Character ID
   * @param level - Character level (1-90)
   * @param isAscended - Whether character is ascended
   * @param constellationLevel - Constellation level (0-6)
   * @param skillDepotId - Skill depot ID (for travelers)
   * @returns Character aggregate DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getCharacter(
    characterId: number,
    level = 1,
    isAscended = false,
    constellationLevel = 0,
    skillDepotId?: number,
  ): Promise<Character> {
    const info = await this.getCharacterInfo(characterId, skillDepotId)
    const baseStats = await this.getCharacterBaseStats(
      characterId,
      level,
      isAscended,
    )
    const ascension = await this.getCharacterAscension(
      characterId,
      baseStats.promoteLevel,
    )
    const constellations = await this.getConstellations(
      info.constellationIds,
      constellationLevel,
    )
    const inherentSkills = await this.getInherentSkills(info.inherentSkillOrder)
    const profile = await this.getCharacterProfile(characterId)
    const stories = await this.getCharacterStories(characterId)
    const costumes = await this.getCharacterCostumes(characterId)
    const allAscensionMaterials =
      await this.getAllAscensionMaterials(characterId)

    return new Character({
      info,
      baseStats,
      ascension,
      constellations,
      inherentSkills,
      profile,
      stories,
      costumes,
      constellationLevel,
      allAscensionMaterials,
    })
  }

  /**
   * Get all character IDs
   * @returns Array of character IDs
   */
  public async getAllCharacterIds(): Promise<number[]> {
    const results = await this.excelBinCache
      .from('AvatarExcelConfigData')
      .select(['id'])
      .execute()

    return results
      .filter((r) => r.id.value <= 11000000 && r.id.value !== 10000001)
      .map((r) => r.id.value)
  }

  /**
   * Build CharacterInfo DTO
   * @param characterId - Character ID
   * @param skillDepotId - Skill depot ID (for travelers)
   * @returns CharacterInfo DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getCharacterInfo(
    characterId: number,
    skillDepotId?: number,
  ): Promise<CharacterInfo> {
    const avatarResult = await this.excelBinCache
      .fromWithTextMap('AvatarExcelConfigData', this.textMap)
      .select([
        'id',
        'nameTextMapHash',
        'skillDepotId',
        'qualityType',
        'weaponType',
        'bodyType',
        'sideIconName',
      ])
      .where('id', characterId)
      .executeTakeFirst()

    if (!avatarResult) {
      throw new ExcelBinPropertyNotFoundError(
        'AvatarExcelConfigData',
        characterId,
      )
    }

    const costumeResults = await this.excelBinCache
      .from('AvatarCostumeExcelConfigData')
      .select(['characterId', 'quality', 'skinId'])
      .execute()

    const defaultCostumeData = costumeResults.find(
      (r) => r.characterId.value === characterId && r.quality.value === 0,
    )
    if (!defaultCostumeData) {
      throw new ExcelBinPropertyNotFoundError(
        'AvatarCostumeExcelConfigData',
        characterId,
      )
    }

    const isTraveler = [10000005, 10000007].includes(characterId)
    const depotId =
      skillDepotId && isTraveler
        ? skillDepotId
        : avatarResult.skillDepotId.value

    const depotResult = await this.excelBinCache
      .from('AvatarSkillDepotExcelConfigData')
      .select([
        'id',
        'energySkill',
        'skills',
        'talents',
        'inherentProudSkillOpens',
      ])
      .where('id', depotId)
      .executeTakeFirst()

    if (!depotResult) {
      throw new ExcelBinPropertyNotFoundError(
        'AvatarSkillDepotExcelConfigData',
        depotId,
      )
    }

    const energySkill = depotResult.energySkill.value

    let element: Element | undefined
    if (energySkill) {
      const skillResult = await this.excelBinCache
        .from('AvatarSkillExcelConfigData')
        .select(['id', 'costElemType'])
        .where('id', energySkill)
        .executeTakeFirst()

      if (skillResult) {
        const costElemType = skillResult.costElemType.value
        element = CharacterRepository.elementMap[costElemType]
      }
    }

    const name = avatarResult.nameTextMapHash.toText()

    const rawSkills = depotResult.skills.value.filter((id) => id !== 0)
    const skillOrder = [501, 701].includes(depotId)
      ? rawSkills.slice(0, 1)
      : rawSkills
          .slice(0, 2)
          .concat(energySkill)
          .filter((id) => id !== 0)

    const { filteredSkillOrder, proudMap, inherentSkillOrder } =
      await this.buildSkillData(skillOrder, depotResult.inherentProudSkillOpens)

    const constellationIds = depotResult.talents.value.filter((id) => id !== 0)

    const qualityType = avatarResult.qualityType.value
    const rarity =
      CharacterRepository.qualityRarity[
        typeof qualityType === 'string' ? qualityType : ''
      ] ?? 0

    return new CharacterInfo({
      id: characterId,
      defaultCostumeId: defaultCostumeData.skinId.value,
      name,
      maxLevel: 90,
      depotId,
      element,
      skillOrder: filteredSkillOrder,
      inherentSkillOrder,
      constellationIds,
      proudMap,
      rarity,
      weaponType: avatarResult.weaponType.toEnum(WeaponType),
      bodyType: avatarResult.bodyType.toEnum(BodyType),
    })
  }

  /**
   * Build CharacterBaseStats DTO
   * @param characterId - Character ID
   * @param level - Character level
   * @param isAscended - Whether character is ascended
   * @returns CharacterBaseStats DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getCharacterBaseStats(
    characterId: number,
    level: number,
    isAscended: boolean,
  ): Promise<CharacterBaseStats> {
    const avatarResult = await this.excelBinCache
      .from('AvatarExcelConfigData')
      .select([
        'id',
        'avatarPromoteId',
        'hpBase',
        'attackBase',
        'defenseBase',
        'critical',
        'criticalHurt',
        'propGrowCurves',
      ])
      .where('id', characterId)
      .executeTakeFirst()

    if (!avatarResult) {
      throw new ExcelBinPropertyNotFoundError(
        'AvatarExcelConfigData',
        characterId,
      )
    }

    const promoteResults = await this.excelBinCache
      .from('AvatarPromoteExcelConfigData')
      .select(['avatarPromoteId', 'promoteLevel', 'unlockMaxLevel'])
      .execute()

    const promotes = promoteResults.filter(
      (r) => r.avatarPromoteId.value === avatarResult.avatarPromoteId.value,
    )
    const promoteLevel = calculatePromoteLevel(
      promotes.map((r) => ({
        promoteLevel: r.promoteLevel.value,
        unlockMaxLevel: r.unlockMaxLevel.value,
      })),
      level,
      isAscended,
    )

    const ascension = await this.getCharacterAscension(
      characterId,
      promoteLevel,
    )

    const curveResults = await this.excelBinCache
      .from('AvatarCurveExcelConfigData')
      .select(['level', 'curveInfos'])
      .execute()

    const curveResult = curveResults.find((r) => r.level.value === level)
    const curveInfos: { type: string; value: number }[] | undefined =
      curveResult
        ? curveResult.curveInfos.map((info) => ({
            type: info.type.value,
            value: info.value.value,
          }))
        : undefined

    const propGrowCurves: { type: string; growCurve: string }[] =
      avatarResult.propGrowCurves.map((pgc) => ({
        type: pgc.type.value,
        growCurve: pgc.growCurve.value,
      }))

    const initStats: [FightProp, number][] = [
      [FightProp.FightPropBaseHP, avatarResult.hpBase.value],
      [FightProp.FightPropBaseAttack, avatarResult.attackBase.value],
      [FightProp.FightPropBaseDefense, avatarResult.defenseBase.value],
      [FightProp.FightPropCritical, avatarResult.critical.value],
      [FightProp.FightPropCriticalHurt, avatarResult.criticalHurt.value],
    ]

    const stats: StatProperty[] = initStats.map(([propType, initValue]) => {
      // Convert enum to string for type-safe comparison
      const propTypeStr: string = propType
      const propGrowCurve = propGrowCurves.find(
        (pgc) => pgc.type === propTypeStr,
      )

      if (propGrowCurve && curveInfos) {
        const curveInfo = curveInfos.find(
          (info) => info.type === propGrowCurve.growCurve,
        )
        const curveValue = curveInfo?.value ?? 1
        const addValue =
          ascension.addProps.find((p) => p.type === propType)?.value ?? 0
        return new StatProperty({
          type: propType,
          name: this.resolveStatName(propType),
          value: initValue * curveValue + addValue,
        })
      }

      if (
        propType === FightProp.FightPropCritical ||
        propType === FightProp.FightPropCriticalHurt
      ) {
        const addValue =
          ascension.addProps.find((p) => p.type === propType)?.value ?? 0
        return new StatProperty({
          type: propType,
          name: this.resolveStatName(propType),
          value: initValue + addValue,
        })
      }

      return new StatProperty({
        type: propType,
        name: this.resolveStatName(propType),
        value: initValue,
      })
    })

    // Add ascension props not in initStats
    for (const addProp of ascension.addProps)
      if (!stats.some((s) => s.type === addProp.type)) stats.push(addProp)

    return new CharacterBaseStats({
      id: characterId,
      level,
      promoteLevel,
      isAscended,
      stats,
    })
  }

  /**
   * Build CharacterAscension DTO
   * @param characterId - Character ID
   * @param promoteLevel - Promote level (0-6)
   * @returns CharacterAscension DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getCharacterAscension(
    characterId: number,
    promoteLevel: number,
  ): Promise<CharacterAscension> {
    const avatarResult = await this.excelBinCache
      .from('AvatarExcelConfigData')
      .select(['id', 'avatarPromoteId'])
      .where('id', characterId)
      .executeTakeFirst()

    if (!avatarResult) {
      throw new ExcelBinPropertyNotFoundError(
        'AvatarExcelConfigData',
        characterId,
      )
    }

    const promoteResults = await this.excelBinCache
      .from('AvatarPromoteExcelConfigData')
      .select([
        'avatarPromoteId',
        'promoteLevel',
        'costItems',
        'scoinCost',
        'addProps',
        'unlockMaxLevel',
      ])
      .execute()

    const promoteResult = promoteResults.find(
      (r) =>
        r.avatarPromoteId.value === avatarResult.avatarPromoteId.value &&
        r.promoteLevel.value === promoteLevel,
    )

    if (!promoteResult) {
      throw new ExcelBinPropertyNotFoundError(
        'AvatarPromoteExcelConfigData',
        promoteLevel,
      )
    }

    const costItems = promoteResult.costItems
      .filter((item) => item.id.value !== 0 && item.count.value !== 0)
      .map((item) => ({
        id: item.id.value,
        count: item.count.value,
      }))

    const addProps = promoteResult.addProps.map((addProp) => {
      const propType = addProp.propType.toEnum(FightProp)
      const value = addProp.value.value
      return new StatProperty({
        type: propType,
        name: this.resolveStatName(propType),
        value,
      })
    })

    return new CharacterAscension({
      id: characterId,
      promoteLevel,
      costItems,
      costMora: promoteResult.scoinCost.value,
      addProps,
      unlockMaxLevel: promoteResult.unlockMaxLevel.value,
    })
  }

  /**
   * Build CharacterConstellation DTOs
   * @param constellationIds - Constellation IDs
   * @param constellationLevel - Unlocked constellation level (0-6)
   * @returns Array of CharacterConstellation DTOs
   */
  private async getConstellations(
    constellationIds: readonly number[],
    constellationLevel: number,
  ): Promise<CharacterConstellation[]> {
    const talentResults = await this.excelBinCache
      .fromWithTextMap('AvatarTalentExcelConfigData', this.textMap)
      .select(['talentId', 'nameTextMapHash', 'descTextMapHash', 'icon'])
      .execute()

    const results: CharacterConstellation[] = []

    for (let i = 0; i < constellationIds.length; i++) {
      const constId = constellationIds[i]
      const talentResult = talentResults.find(
        (r) => r.talentId.value === constId,
      )
      if (!talentResult) continue

      const name = talentResult.nameTextMapHash.toText()
      const description = talentResult.descTextMapHash.toText()

      results.push(
        new CharacterConstellation({
          id: constId,
          name,
          description,
          icon: this.createImageAssets(talentResult.icon.value),
          locked: i >= constellationLevel,
        }),
      )
    }

    return results
  }

  /**
   * Build CharacterInherentSkill DTOs
   * @param inherentSkillOrder - Inherent skill group IDs
   * @returns Array of CharacterInherentSkill DTOs
   */
  private async getInherentSkills(
    inherentSkillOrder: readonly number[],
  ): Promise<CharacterInherentSkill[]> {
    const proudSkillResults = await this.excelBinCache
      .fromWithTextMap('ProudSkillExcelConfigData', this.textMap)
      .select([
        'proudSkillGroupId',
        'level',
        'nameTextMapHash',
        'descTextMapHash',
        'icon',
        'addProps',
      ])
      .execute()

    const results: CharacterInherentSkill[] = []

    for (const groupId of inherentSkillOrder) {
      const proudResult = proudSkillResults.find(
        (r) => r.proudSkillGroupId.value === groupId && r.level.value === 1,
      )
      if (!proudResult) continue

      const name = proudResult.nameTextMapHash.toText()
      const description = proudResult.descTextMapHash.toText()

      const addProps: StatProperty[] = proudResult.addProps
        .map((addProp) => ({
          propType: addProp.propType.toEnum(FightProp),
          value: addProp.value.value,
        }))
        .filter((item) => item.propType !== FightProp.FightPropNone)
        .map(
          (item) =>
            new StatProperty({
              type: item.propType,
              name: this.resolveStatName(item.propType),
              value: item.value,
            }),
        )

      results.push(
        new CharacterInherentSkill({
          id: groupId,
          name,
          description,
          icon: this.createImageAssets(proudResult.icon.value),
          addProps,
        }),
      )
    }

    return results
  }

  /**
   * Build CharacterProfile DTO
   * @param characterId - Character ID
   * @returns CharacterProfile DTO or undefined
   */
  private async getCharacterProfile(
    characterId: number,
  ): Promise<CharacterProfile | undefined> {
    const fetterResults = await this.excelBinCache
      .fromWithTextMap('FetterInfoExcelConfigData', this.textMap)
      .select([
        'avatarId',
        'fetterId',
        'avatarNativeTextMapHash',
        'avatarVisionAfterTextMapHash',
        'avatarVisionBeforTextMapHash',
        'avatarConstellationAfterTextMapHash',
        'avatarConstellationBeforTextMapHash',
        'avatarTitleTextMapHash',
        'avatarDetailTextMapHash',
        'cvChineseTextMapHash',
        'cvJapaneseTextMapHash',
        'cvEnglishTextMapHash',
        'cvKoreanTextMapHash',
        'infoBirthMonth',
        'infoBirthDay',
        'avatarAssocType',
      ])
      .execute()

    const fetterResult = fetterResults.find(
      (r) => r.avatarId.value === characterId,
    )
    if (!fetterResult) return undefined

    const native = fetterResult.avatarNativeTextMapHash.toText()
    const visionAfter = fetterResult.avatarVisionAfterTextMapHash.value
      ? fetterResult.avatarVisionAfterTextMapHash.toText()
      : undefined
    const visionBefore = fetterResult.avatarVisionBeforTextMapHash.value
      ? fetterResult.avatarVisionBeforTextMapHash.toText()
      : undefined
    const vision = visionAfter ?? visionBefore ?? ''

    const constAfter = fetterResult.avatarConstellationAfterTextMapHash.value
      ? fetterResult.avatarConstellationAfterTextMapHash.toText()
      : undefined
    const constBefore = fetterResult.avatarConstellationBeforTextMapHash.value
      ? fetterResult.avatarConstellationBeforTextMapHash.toText()
      : undefined
    const constellation = constAfter ?? constBefore ?? ''

    const title = fetterResult.avatarTitleTextMapHash.toText()
    const detail = fetterResult.avatarDetailTextMapHash.toText()

    const cvChinese = fetterResult.cvChineseTextMapHash.toText()
    const cvJapanese = fetterResult.cvJapaneseTextMapHash.toText()
    const cvEnglish = fetterResult.cvEnglishTextMapHash.toText()
    const cvKorean = fetterResult.cvKoreanTextMapHash.toText()

    const birthMonth = fetterResult.infoBirthMonth.value
    const birthDay = fetterResult.infoBirthDay.value

    return new CharacterProfile({
      characterId,
      fetterId: fetterResult.fetterId.value,
      birthDate: birthMonth ? new Date(0, birthMonth - 1, birthDay) : undefined,
      native,
      vision,
      constellation,
      title,
      detail,
      assocType: fetterResult.avatarAssocType.value,
      cv: {
        'zh-cn': cvChinese,
        ja: cvJapanese,
        en: cvEnglish,
        ko: cvKorean,
      },
    })
  }

  /**
   * Build CharacterStory DTOs for a character
   * @param characterId - Character ID
   * @returns Array of CharacterStory DTOs
   */
  private async getCharacterStories(
    characterId: number,
  ): Promise<CharacterStory[]> {
    const storyResults = await this.excelBinCache
      .fromWithTextMap('FetterStoryExcelConfigData', this.textMap)
      .select([
        'avatarId',
        'fetterId',
        'storyTitleTextMapHash',
        'storyTitle2TextMapHash',
        'storyContextTextMapHash',
        'storyContext2TextMapHash',
        'tips',
      ])
      .execute()

    const stories = storyResults.filter((r) => r.avatarId.value === characterId)

    const results: CharacterStory[] = []

    for (const story of stories) {
      const title1 = story.storyTitleTextMapHash.value
        ? story.storyTitleTextMapHash.toText()
        : undefined
      const title2 = story.storyTitle2TextMapHash.value
        ? story.storyTitle2TextMapHash.toText()
        : undefined
      const title = title1 ?? title2 ?? ''

      const content1 = story.storyContextTextMapHash.value
        ? story.storyContextTextMapHash.toText()
        : undefined
      const content2 = story.storyContext2TextMapHash.value
        ? story.storyContext2TextMapHash.toText()
        : undefined
      const content = content1 ?? content2 ?? ''

      const tips = story.tips.value
        .map((tipHash) => {
          if (!tipHash) return undefined
          return this.textMap.getTextSync(tipHash)
        })
        .filter((t): t is string => t !== undefined)

      results.push(
        new CharacterStory({
          fetterId: story.fetterId.value,
          characterId: story.avatarId.value,
          title,
          content,
          tips,
        }),
      )
    }

    return results
  }

  /**
   * Build CharacterCostume DTOs for a character
   * @param characterId - Character ID
   * @returns Array of CharacterCostume DTOs
   */
  private async getCharacterCostumes(
    characterId: number,
  ): Promise<CharacterCostume[]> {
    const costumeResults = await this.excelBinCache
      .fromWithTextMap('AvatarCostumeExcelConfigData', this.textMap)
      .select([
        'characterId',
        'skinId',
        'nameTextMapHash',
        'descTextMapHash',
        'quality',
        'sideIconName',
      ])
      .execute()

    const costumes = costumeResults.filter(
      (r) => r.characterId.value === characterId,
    )

    const avatarResult = await this.excelBinCache
      .from('AvatarExcelConfigData')
      .select(['id', 'sideIconName'])
      .where('id', characterId)
      .executeTakeFirst()

    if (!avatarResult) return []

    const results: CharacterCostume[] = []

    for (const costume of costumes) {
      const name = costume.nameTextMapHash.toText()
      const description = costume.descTextMapHash.toText()

      const quality = costume.quality.value
      const sideIconName = quality
        ? costume.sideIconName.value
        : avatarResult.sideIconName.value
      const sideIcon = this.createImageAssets(sideIconName)
      const nameParts = sideIcon.name.split('_')
      const avatarTag = nameParts[nameParts.length - 1]

      results.push(
        new CharacterCostume({
          id: costume.skinId.value,
          characterId,
          name,
          description,
          quality,
          sideIcon,
          icon: this.createImageAssets(`UI_AvatarIcon_${avatarTag}`),
          art: this.createImageAssets(
            quality
              ? `UI_Costume_${avatarTag}`
              : `UI_Gacha_AvatarImg_${avatarTag}`,
          ),
          card: this.createImageAssets(`UI_AvatarIcon_${avatarTag}_Card`),
        }),
      )
    }

    return results
  }

  /**
   * Collect all ascension materials across all promote levels
   * @param characterId - Character ID
   * @returns Aggregated cost items
   */
  private async getAllAscensionMaterials(
    characterId: number,
  ): Promise<CostItem[]> {
    const avatarResult = await this.excelBinCache
      .from('AvatarExcelConfigData')
      .select(['id', 'avatarPromoteId'])
      .where('id', characterId)
      .executeTakeFirst()

    if (!avatarResult) return []

    const promoteResults = await this.excelBinCache
      .from('AvatarPromoteExcelConfigData')
      .select(['avatarPromoteId', 'promoteLevel'])
      .execute()

    const promotes = promoteResults.filter(
      (r) => r.avatarPromoteId.value === avatarResult.avatarPromoteId.value,
    )
    const maxPromoteLevel = Math.max(
      ...promotes.map((p) => p.promoteLevel.value),
    )

    const materialsMap = new Map<number, number>()
    for (let i = 1; i <= maxPromoteLevel; i++) {
      const ascension = await this.getCharacterAscension(characterId, i)
      for (const item of ascension.costItems) {
        const current = materialsMap.get(item.id) ?? 0
        materialsMap.set(item.id, current + item.count)
      }
    }

    return Array.from(materialsMap.entries()).map(([id, count]) => ({
      id,
      count,
    }))
  }

  /**
   * Build skill data: filtered skill order, proud map, inherent skill order
   * @param rawSkillOrder - Raw skill IDs
   * @param inherentProudSkillOpens - Inherent proud skill opens from depot (raw array)
   * @param inherentProudSkillOpens.value - Array of proud skill group IDs
   * @returns Skill data with filtered order, proud map, and inherent skill order
   */
  private async buildSkillData(
    rawSkillOrder: number[],
    inherentProudSkillOpens: {
      value: readonly { proudSkillGroupId: number }[]
    },
  ): Promise<{
    filteredSkillOrder: number[]
    proudMap: Map<number, number>
    inherentSkillOrder: number[]
  }> {
    const skillResults = await this.excelBinCache
      .from('AvatarSkillExcelConfigData')
      .select(['id', 'proudSkillGroupId'])
      .execute()

    const proudMap = new Map<number, number>()
    const filteredSkillOrder: number[] = []
    for (const skillId of rawSkillOrder) {
      const skillResult = skillResults.find((r) => r.id.value === skillId)
      if (!skillResult) continue
      const proudId = skillResult.proudSkillGroupId.value
      if (proudId) {
        proudMap.set(skillId, proudId)
        filteredSkillOrder.push(skillId)
      }
    }

    const proudSkillResults = await this.excelBinCache
      .from('ProudSkillExcelConfigData')
      .select(['proudSkillGroupId', 'level', 'isHideLifeProudSkill'])
      .execute()

    const inherentSkillOrder: number[] = []

    for (const open of inherentProudSkillOpens.value) {
      if (open.proudSkillGroupId === 0) continue
      const proudSkillResult = proudSkillResults.find(
        (r) =>
          r.proudSkillGroupId.value === open.proudSkillGroupId &&
          r.level.value === 1,
      )
      if (!proudSkillResult) continue
      if (proudSkillResult.isHideLifeProudSkill.value) continue
      inherentSkillOrder.push(open.proudSkillGroupId)
    }

    return { filteredSkillOrder, proudMap, inherentSkillOrder }
  }

  /**
   * Resolve FightProp to display name
   * @param type - FightProp enum value
   * @returns Display name string
   */
  private resolveStatName(type: FightProp): string {
    return type.toString()
  }

  /**
   * Create an ImageAssets instance
   * @param name - Image name
   * @returns ImageAssets
   */
  private createImageAssets(name: string): ImageAssets {
    return new ImageAssets({ name, imageBaseURL: this.imageBaseURL })
  }
}
