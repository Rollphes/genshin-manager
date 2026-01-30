import {
  calculatePromoteLevel,
  ExcelBinPropertyNotFoundError,
} from '@genshin-manager/core'
import type { ExcelBinCache, TextMapIndex } from '@genshin-manager/data'

import { ImageAssets } from '@/assets/ImageAssets'
import type { CostItem } from '@/character/CharacterAscension'
import { StatProperty } from '@/common/StatProperty'
import { FightProp } from '@/types/enums'
import type { RepositoryDependencies } from '@/types/RepositoryDependencies'
import { Weapon } from '@/weapon/Weapon'
import { WeaponAscension } from '@/weapon/WeaponAscension'
import { WeaponInfo } from '@/weapon/WeaponInfo'
import { WeaponRefinement } from '@/weapon/WeaponRefinement'

/**
 * Repository for building Weapon DTOs from ExcelBin and TextMap data.
 * All data access is async due to lazy ExcelBinCache loading.
 */
export class WeaponRepository {
  /** Blacklisted weapon IDs (unobtainable / internal) */
  private static readonly blackWeaponIds = new Set([
    10002, 10003, 10004, 10005, 10006, 10008, 11411, 11508, 12304, 12508, 12509,
    13304, 13503, 14306, 14411, 14508, 15306, 20001,
  ])

  private readonly excelBinCache: ExcelBinCache
  private readonly textMap: TextMapIndex
  private readonly imageBaseURL: string

  /**
   * Create a WeaponRepository
   * @param deps - Repository dependencies
   * @param imageBaseURL - Base URL for image assets
   */
  constructor(deps: RepositoryDependencies, imageBaseURL: string) {
    this.excelBinCache = deps.excelBinCache
    this.textMap = deps.textMap
    this.imageBaseURL = imageBaseURL
  }

  /**
   * Build a full Weapon aggregate DTO
   * @param weaponId - Weapon ID
   * @param level - Weapon level (1-90)
   * @param isAscended - Whether weapon is ascended
   * @param refinementRank - Refinement rank (1-5)
   * @returns Weapon aggregate DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getWeapon(
    weaponId: number,
    level = 1,
    isAscended = true,
    refinementRank = 1,
  ): Promise<Weapon> {
    const info = await this.getWeaponInfo(
      weaponId,
      level,
      isAscended,
      refinementRank,
    )
    const ascension = await this.getWeaponAscension(weaponId, info.promoteLevel)
    const refinement = await this.getWeaponRefinement(weaponId, refinementRank)
    const allAscensionMaterials = await this.getAllAscensionMaterials(weaponId)

    return new Weapon({
      info,
      ascension,
      refinement,
      allAscensionMaterials,
    })
  }

  /**
   * Get all obtainable weapon IDs
   * @returns Array of weapon IDs
   */
  public async getAllWeaponIds(): Promise<number[]> {
    const results = await this.excelBinCache
      .from('WeaponExcelConfigData')
      .select(['id'])
      .execute()

    return results
      .filter((r) => !WeaponRepository.blackWeaponIds.has(r.id.value))
      .map((r) => r.id.value)
  }

  /**
   * Build WeaponInfo DTO
   * @param weaponId - Weapon ID
   * @param level - Weapon level (1-90)
   * @param isAscended - Whether weapon is ascended
   * @param refinementRank - Refinement rank (1-5)
   * @returns WeaponInfo DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getWeaponInfo(
    weaponId: number,
    level = 1,
    isAscended = true,
    refinementRank = 1,
  ): Promise<WeaponInfo> {
    const weaponResult = await this.excelBinCache
      .fromWithTextMap('WeaponExcelConfigData', this.textMap)
      .select([
        'id',
        'nameTextMapHash',
        'descTextMapHash',
        'weaponType',
        'rankLevel',
        'weaponPromoteId',
        'skillAffix',
        'weaponProp',
        'icon',
        'awakenIcon',
      ])
      .where('id', weaponId)
      .executeTakeFirst()

    if (!weaponResult)
      throw new ExcelBinPropertyNotFoundError('WeaponExcelConfigData', weaponId)

    const promoteResults = await this.excelBinCache
      .from('WeaponPromoteExcelConfigData')
      .select(['weaponPromoteId', 'promoteLevel', 'unlockMaxLevel'])
      .execute()

    const promotesJson = promoteResults.filter(
      (r) => r.weaponPromoteId.value === weaponResult.weaponPromoteId.value,
    )
    const promoteLevel = calculatePromoteLevel(
      promotesJson.map((r) => ({
        promoteLevel: r.promoteLevel.value,
        unlockMaxLevel: r.unlockMaxLevel.value,
      })) as never,
      level,
      isAscended,
    )

    const ascension = await this.getWeaponAscension(weaponId, promoteLevel)

    // Build stats from growth curves - extract raw values
    const weaponProps = weaponResult.weaponProp.map((prop) => ({
      propType: prop.propType.value,
      type: prop.type.value,
      initValue: prop.initValue.value,
    }))
    const stats = await this.buildWeaponStats(
      weaponProps,
      level,
      ascension.addProps,
    )

    // Refinement skill info
    const refinement = await this.getWeaponRefinement(weaponId, refinementRank)

    const name = weaponResult.nameTextMapHash.toText()
    const description = weaponResult.descTextMapHash.toText()

    const isAwaken = promoteLevel >= 2
    const iconName = isAwaken
      ? weaponResult.awakenIcon.value
      : weaponResult.icon.value

    // Compute max level from max promote level
    const maxPromoteLevel = Math.max(
      ...promotesJson.map((p) => p.promoteLevel.value),
    )
    const maxPromoteEntry = promotesJson.find(
      (p) => p.promoteLevel.value === maxPromoteLevel,
    )
    const maxLevel = maxPromoteEntry?.unlockMaxLevel.value ?? 90

    return new WeaponInfo({
      id: weaponId,
      name,
      description,
      type: weaponResult.weaponType.value as never,
      skillName: refinement.skillName,
      skillDescription: refinement.skillDescription,
      level,
      maxLevel,
      promoteLevel,
      isAscended,
      refinementRank,
      rarity: weaponResult.rankLevel.value,
      stats,
      isAwaken,
      icon: this.createImageAssets(iconName),
    })
  }

  /**
   * Build WeaponAscension DTO
   * @param weaponId - Weapon ID
   * @param promoteLevel - Promote level (0-6)
   * @returns WeaponAscension DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getWeaponAscension(
    weaponId: number,
    promoteLevel: number,
  ): Promise<WeaponAscension> {
    const weaponResult = await this.excelBinCache
      .from('WeaponExcelConfigData')
      .select(['id', 'weaponPromoteId'])
      .where('id', weaponId)
      .executeTakeFirst()

    if (!weaponResult)
      throw new ExcelBinPropertyNotFoundError('WeaponExcelConfigData', weaponId)

    const promoteResults = await this.excelBinCache
      .from('WeaponPromoteExcelConfigData')
      .select([
        'weaponPromoteId',
        'promoteLevel',
        'costItems',
        'coinCost',
        'addProps',
        'unlockMaxLevel',
      ])
      .execute()

    const promoteResult = promoteResults.find(
      (r) =>
        r.weaponPromoteId.value === weaponResult.weaponPromoteId.value &&
        r.promoteLevel.value === promoteLevel,
    )

    if (!promoteResult) {
      throw new ExcelBinPropertyNotFoundError(
        'WeaponPromoteExcelConfigData',
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
        name: propType,
        value,
      })
    })

    return new WeaponAscension({
      id: weaponId,
      promoteLevel,
      costItems,
      costMora: promoteResult.coinCost.value,
      addProps,
      unlockMaxLevel: promoteResult.unlockMaxLevel.value,
    })
  }

  /**
   * Build WeaponRefinement DTO
   * @param weaponId - Weapon ID
   * @param refinementRank - Refinement rank (1-5)
   * @returns WeaponRefinement DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getWeaponRefinement(
    weaponId: number,
    refinementRank: number,
  ): Promise<WeaponRefinement> {
    const weaponResult = await this.excelBinCache
      .from('WeaponExcelConfigData')
      .select(['id', 'skillAffix'])
      .where('id', weaponId)
      .executeTakeFirst()

    if (!weaponResult)
      throw new ExcelBinPropertyNotFoundError('WeaponExcelConfigData', weaponId)

    const skillAffixArr = weaponResult.skillAffix.value as number[]
    const skillAffix = skillAffixArr[0]

    if (skillAffix === 0) {
      return new WeaponRefinement({
        id: weaponId,
        refinementRank,
        skillName: undefined,
        skillDescription: undefined,
        addProps: [],
      })
    }

    const affixResults = await this.excelBinCache
      .fromWithTextMap('EquipAffixExcelConfigData', this.textMap)
      .select(['id', 'level', 'nameTextMapHash', 'descTextMapHash', 'addProps'])
      .execute()

    const affixResult = affixResults.find(
      (r) => r.id.value === skillAffix && r.level.value === refinementRank - 1,
    )

    if (!affixResult) {
      return new WeaponRefinement({
        id: weaponId,
        refinementRank,
        skillName: undefined,
        skillDescription: undefined,
        addProps: [],
      })
    }

    const skillName = affixResult.nameTextMapHash.toText()
    const skillDescription = affixResult.descTextMapHash.toText()

    const addProps: StatProperty[] = affixResult.addProps
      .map((addProp) => ({
        propType: addProp.propType.toEnum(FightProp),
        value: addProp.value.value,
      }))
      .filter((item) => item.propType !== FightProp.FightPropNone)
      .map(
        (item) =>
          new StatProperty({
            type: item.propType,
            name: item.propType,
            value: item.value,
          }),
      )

    return new WeaponRefinement({
      id: weaponId,
      refinementRank,
      skillName,
      skillDescription,
      addProps,
    })
  }

  /**
   * Collect all ascension materials across all promote levels
   * @param weaponId - Weapon ID
   * @returns Aggregated cost items
   */
  private async getAllAscensionMaterials(
    weaponId: number,
  ): Promise<CostItem[]> {
    const weaponResult = await this.excelBinCache
      .from('WeaponExcelConfigData')
      .select(['id', 'weaponPromoteId'])
      .where('id', weaponId)
      .executeTakeFirst()

    if (!weaponResult) return []

    const promoteResults = await this.excelBinCache
      .from('WeaponPromoteExcelConfigData')
      .select(['weaponPromoteId', 'promoteLevel'])
      .execute()

    const promotes = promoteResults.filter(
      (r) => r.weaponPromoteId.value === weaponResult.weaponPromoteId.value,
    )
    const maxPromoteLevel = Math.max(
      ...promotes.map((p) => p.promoteLevel.value),
    )

    const materialsMap = new Map<number, number>()
    for (let i = 1; i <= maxPromoteLevel; i++) {
      const ascension = await this.getWeaponAscension(weaponId, i)
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
   * Build weapon stats from growth curves
   * @param weaponProps - Weapon property LocatedArray
   * @param level - Weapon level
   * @param ascensionAddProps - Ascension added properties
   * @returns Array of StatProperty
   */
  private async buildWeaponStats(
    weaponProps: { propType: string; type: string; initValue: number }[],
    level: number,
    ascensionAddProps: readonly StatProperty[],
  ): Promise<StatProperty[]> {
    const curveResults = await this.excelBinCache
      .from('WeaponCurveExcelConfigData')
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

    const stats: StatProperty[] = []
    for (const weaponProp of weaponProps) {
      if (!weaponProp.initValue) continue

      const propType = this.toFightProp(weaponProp.propType)
      const curveType = weaponProp.type

      let curveValue = 1
      if (curveInfos) {
        const curveInfo = curveInfos.find((info) => info.type === curveType)
        curveValue = curveInfo?.value ?? 1
      }

      const addValue =
        ascensionAddProps.find((p) => p.type === propType)?.value ?? 0
      const statValue = weaponProp.initValue * curveValue + addValue

      stats.push(
        new StatProperty({
          type: propType,
          name: propType,
          value: statValue,
        }),
      )
    }

    return stats
  }

  /**
   * Convert string to FightProp enum
   * @param value - String value
   * @returns FightProp enum value
   */
  private toFightProp(value: string): FightProp {
    const entries = Object.entries(FightProp)
    const found = entries.find(([, v]) => {
      const vStr: string = v
      return vStr === value
    })
    if (found) return found[1]

    // Fallback to FightPropNone for empty/undefined values
    return FightProp.FightPropNone
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
