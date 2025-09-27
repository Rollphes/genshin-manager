import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { WeaponAscension } from '@/models/weapon/WeaponAscension'
import { WeaponInfo } from '@/models/weapon/WeaponInfo'
import { WeaponRefinement } from '@/models/weapon/WeaponRefinement'
import { WeaponType } from '@/types'
import { calculatePromoteLevel } from '@/utils/calculatePromoteLevel'

/**
 * Unified weapon class providing comprehensive access to all weapon data
 */
export class Weapon {
  /**
   * Weapon ID
   */
  public readonly id: number
  /**
   * Weapon level
   */
  public readonly level: number
  /**
   * Weapon is ascended
   */
  public readonly isAscended: boolean
  /**
   * Weapon refinement rank
   */
  public readonly refinementRank: number
  /**
   * Weapon info instance
   */
  private readonly info: WeaponInfo
  /**
   * Weapon ascension instance
   */
  private readonly ascension: WeaponAscension
  /**
   * Weapon refinement instance
   */
  private readonly refinement: WeaponRefinement

  /**
   * Create a Weapon
   * @param weaponId Weapon ID
   * @param level Weapon level (1-90). Default: 1
   * @param isAscended Weapon is ascended. Default: true
   * @param refinementRank Weapon refinement rank (1-5). Default: 1
   */
  constructor(
    weaponId: number,
    level = 1,
    isAscended = true,
    refinementRank = 1,
  ) {
    this.id = weaponId
    this.level = level
    this.isAscended = isAscended
    this.refinementRank = refinementRank
    this.info = new WeaponInfo(weaponId, level, isAscended, refinementRank)
    this.ascension = new WeaponAscension(weaponId, this.info.promoteLevel)
    this.refinement = new WeaponRefinement(weaponId, refinementRank)
  }

  /**
   * Get all weapon IDs
   * @returns All weapon IDs
   */
  public static get allWeaponIds(): number[] {
    return WeaponInfo.allWeaponIds
  }

  /**
   * Weapon name
   */
  public get name(): string {
    return this.info.name
  }

  /**
   * Weapon description
   */
  public get description(): string {
    return this.info.description
  }

  /**
   * Weapon type
   */
  public get type(): WeaponType {
    return this.info.type
  }

  /**
   * Weapon skill name
   */
  public get skillName(): string | undefined {
    return this.info.skillName
  }

  /**
   * Weapon skill description
   */
  public get skillDescription(): string | undefined {
    return this.info.skillDescription
  }

  /**
   * Weapon max level
   */
  public get maxLevel(): number {
    return this.info.maxLevel
  }

  /**
   * Weapon promote level
   */
  public get promoteLevel(): number {
    return this.info.promoteLevel
  }

  /**
   * Weapon rarity
   */
  public get rarity(): number {
    return this.info.rarity
  }

  /**
   * Calculated weapon stats
   */
  public get stats(): StatProperty[] {
    return this.info.stats
  }

  /**
   * Whether the weapon is awakened
   */
  public get isAwaken(): boolean {
    return this.info.isAwaken
  }

  /**
   * Weapon icon
   */
  public get icon(): ImageAssets {
    return this.info.icon
  }

  /**
   * Weapon ascension materials
   */
  public get ascensionMaterials(): { id: number; count: number }[] {
    return this.ascension.costItems
  }

  /**
   * Weapon refinement effects
   */
  public get refinementAddProps(): StatProperty[] {
    return this.refinement.addProps
  }

  /**
   * Get weapon summary information
   * @returns Weapon summary object
   */
  public get summary(): {
    name: string
    type: WeaponType
    rarity: number
    level: string
    refinement: string
  } {
    return {
      name: this.name,
      type: this.type,
      rarity: this.rarity,
      level: `${String(this.level)}/${String(this.maxLevel)}`,
      refinement: `R${String(this.refinementRank)}`,
    }
  }

  /**
   * Check if weapon can ascend to next level
   * @returns True if weapon can ascend
   */
  public get isCanAscend(): boolean {
    const maxPromoteLevel = WeaponAscension.getMaxPromoteLevelByWeaponId(
      this.id,
    )
    return this.promoteLevel < maxPromoteLevel
  }

  /**
   * Get required materials for next ascension
   * @returns Array of materials needed for next ascension
   */
  public get nextAscensionMaterials(): { id: number; count: number }[] {
    if (!this.isCanAscend) return []
    const nextAscension = new WeaponAscension(this.id, this.promoteLevel + 1)
    return nextAscension.costItems
  }

  /**
   * Get total materials needed from current to max level
   * @returns Array of total materials needed
   */
  public get totalAscensionMaterials(): { id: number; count: number }[] {
    const maxPromoteLevel = WeaponAscension.getMaxPromoteLevelByWeaponId(
      this.id,
    )
    const materialsMap = new Map<number, number>()

    for (let i = this.promoteLevel + 1; i <= maxPromoteLevel; i++) {
      const ascension = new WeaponAscension(this.id, i)
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
   * Check if weapon can refine to next rank
   * @returns True if weapon can refine
   */
  public get isCanRefine(): boolean {
    const maxRefinementRank = WeaponRefinement.getMaxRefinementRankByWeaponId(
      this.id,
    )
    return this.refinementRank < maxRefinementRank
  }

  /**
   * Get max refinement rank for this weapon
   * @returns Max refinement rank
   */
  public get maxRefinementRank(): number {
    return WeaponRefinement.getMaxRefinementRankByWeaponId(this.id)
  }

  /**
   * Get weapon ID by name
   * @param name Weapon name
   * @returns Weapon ID
   */
  public static getWeaponIdByName(name: string): number[] {
    return WeaponInfo.getWeaponIdByName(name)
  }

  /**
   * Get refinement effect for specified rank
   * @param rank Refinement rank (1-5). Default: current rank
   * @returns Refinement effect
   */
  public getRefinementEffect(rank?: number): WeaponRefinement {
    const targetRank = rank ?? this.refinementRank
    return new WeaponRefinement(this.id, targetRank)
  }

  /**
   * Calculate weapon level upgrade materials
   * @param currentLevel Current weapon level
   * @param targetLevel Target weapon level
   * @returns Array of materials needed
   */
  public calculateWeaponLevelMaterials(
    currentLevel: number,
    targetLevel: number,
  ): { id: number; count: number }[] {
    const materialsMap = new Map<number, number>()

    const weaponJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponExcelConfigData',
      this.id,
    )
    const weaponPromotesJson = Client._getJsonFromCachedExcelBinOutput(
      'WeaponPromoteExcelConfigData',
      weaponJson.weaponPromoteId as number,
    )

    const currentPromoteLevel = calculatePromoteLevel(
      weaponPromotesJson,
      currentLevel,
      false,
    )
    const targetPromoteLevel = calculatePromoteLevel(
      weaponPromotesJson,
      targetLevel,
      false,
    )

    for (
      let promoteLevel = currentPromoteLevel + 1;
      promoteLevel <= targetPromoteLevel;
      promoteLevel++
    ) {
      const ascension = new WeaponAscension(this.id, promoteLevel)
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
}
