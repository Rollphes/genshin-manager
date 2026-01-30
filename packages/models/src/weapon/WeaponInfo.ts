import type { ImageAssets } from '@/assets/ImageAssets'
import type { StatProperty } from '@/common/StatProperty'
import type { WeaponType } from '@/types/enums'

/**
 * Constructor data for WeaponInfo
 */
export interface WeaponInfoData {
  /** Weapon ID */
  readonly id: number
  /** Weapon name */
  readonly name: string
  /** Weapon description */
  readonly description: string
  /** Weapon type */
  readonly type: WeaponType
  /** Weapon skill name */
  readonly skillName: string | undefined
  /** Weapon skill description */
  readonly skillDescription: string | undefined
  /** Weapon level */
  readonly level: number
  /** Weapon max level */
  readonly maxLevel: number
  /** Weapon promote level */
  readonly promoteLevel: number
  /** Whether the weapon is ascended */
  readonly isAscended: boolean
  /** Weapon refinement rank (1-5) */
  readonly refinementRank: number
  /** Weapon rarity (1-5) */
  readonly rarity: number
  /** Weapon stats */
  readonly stats: readonly StatProperty[]
  /** Whether the weapon icon shows awakened art */
  readonly isAwaken: boolean
  /** Weapon icon */
  readonly icon: ImageAssets
}

/**
 * Weapon basic information.
 * Pure DTO — no static dependencies.
 */
export class WeaponInfo {
  /** Weapon ID */
  public readonly id: number
  /** Weapon name */
  public readonly name: string
  /** Weapon description */
  public readonly description: string
  /** Weapon type */
  public readonly type: WeaponType
  /** Weapon skill name */
  public readonly skillName: string | undefined
  /** Weapon skill description */
  public readonly skillDescription: string | undefined
  /** Weapon level */
  public readonly level: number
  /** Weapon max level */
  public readonly maxLevel: number
  /** Weapon promote level */
  public readonly promoteLevel: number
  /** Whether the weapon is ascended */
  public readonly isAscended: boolean
  /** Weapon refinement rank */
  public readonly refinementRank: number
  /** Weapon rarity */
  public readonly rarity: number
  /** Weapon stats */
  public readonly stats: readonly StatProperty[]
  /** Whether the weapon icon shows awakened art */
  public readonly isAwaken: boolean
  /** Weapon icon */
  public readonly icon: ImageAssets

  /**
   * Create a WeaponInfo
   * @param data - Pre-resolved weapon info data
   */
  constructor(data: WeaponInfoData) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.type = data.type
    this.skillName = data.skillName
    this.skillDescription = data.skillDescription
    this.level = data.level
    this.maxLevel = data.maxLevel
    this.promoteLevel = data.promoteLevel
    this.isAscended = data.isAscended
    this.refinementRank = data.refinementRank
    this.rarity = data.rarity
    this.stats = data.stats
    this.isAwaken = data.isAwaken
    this.icon = data.icon
  }
}
