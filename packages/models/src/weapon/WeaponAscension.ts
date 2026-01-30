import type { CostItem } from '@/character/CharacterAscension'
import type { StatProperty } from '@/common/StatProperty'

/**
 * Constructor data for WeaponAscension
 */
export interface WeaponAscensionData {
  /** Weapon ID */
  readonly id: number
  /** Promote level (0-6) */
  readonly promoteLevel: number
  /** Cost items */
  readonly costItems: readonly CostItem[]
  /** Cost mora */
  readonly costMora: number
  /** Added stat properties */
  readonly addProps: readonly StatProperty[]
  /** Max level unlocked by this ascension */
  readonly unlockMaxLevel: number
}

/**
 * Weapon ascension data at a specific promote level.
 * Pure DTO.
 */
export class WeaponAscension {
  /** Weapon ID */
  public readonly id: number
  /** Promote level */
  public readonly promoteLevel: number
  /** Cost items */
  public readonly costItems: readonly CostItem[]
  /** Cost mora */
  public readonly costMora: number
  /** Added stat properties */
  public readonly addProps: readonly StatProperty[]
  /** Max level unlocked */
  public readonly unlockMaxLevel: number

  /**
   * Create a WeaponAscension
   * @param data - Pre-resolved weapon ascension data
   */
  constructor(data: WeaponAscensionData) {
    this.id = data.id
    this.promoteLevel = data.promoteLevel
    this.costItems = data.costItems
    this.costMora = data.costMora
    this.addProps = data.addProps
    this.unlockMaxLevel = data.unlockMaxLevel
  }
}
