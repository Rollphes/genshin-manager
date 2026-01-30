import type { CostItem } from '@/character/CharacterAscension'
import type { WeaponAscension } from '@/weapon/WeaponAscension'
import type { WeaponInfo } from '@/weapon/WeaponInfo'
import type { WeaponRefinement } from '@/weapon/WeaponRefinement'

/**
 * Constructor data for Weapon
 */
export interface WeaponData {
  /** Weapon info */
  readonly info: WeaponInfo
  /** Current ascension data */
  readonly ascension: WeaponAscension
  /** Current refinement data */
  readonly refinement: WeaponRefinement
  /** All ascension materials (for all promote levels) */
  readonly allAscensionMaterials: readonly CostItem[]
}

/**
 * Full weapon aggregate DTO.
 * Composes all weapon sub-DTOs into a single object.
 * Pure DTO — all data is pre-resolved by Repository.
 */
export class Weapon {
  /** Weapon info */
  public readonly info: WeaponInfo
  /** Current ascension data */
  public readonly ascension: WeaponAscension
  /** Current refinement data */
  public readonly refinement: WeaponRefinement
  /** All ascension materials */
  public readonly allAscensionMaterials: readonly CostItem[]

  /**
   * Create a Weapon
   * @param data - Pre-resolved weapon data
   */
  constructor(data: WeaponData) {
    this.info = data.info
    this.ascension = data.ascension
    this.refinement = data.refinement
    this.allAscensionMaterials = data.allAscensionMaterials
  }

  /** Weapon ID (shortcut) */
  public get id(): number {
    return this.info.id
  }

  /** Weapon name (shortcut) */
  public get name(): string {
    return this.info.name
  }

  /** Weapon level (shortcut) */
  public get level(): number {
    return this.info.level
  }

  /** Whether weapon can still ascend */
  public get isCanAscend(): boolean {
    return this.info.level < this.info.maxLevel
  }
}
