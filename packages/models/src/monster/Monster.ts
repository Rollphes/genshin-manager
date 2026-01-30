import type { ImageAssets } from '@/assets/ImageAssets'
import type { StatProperty } from '@/common/StatProperty'
import type { SubType } from '@/types/enums'

/**
 * Constructor data for Monster
 */
export interface MonsterData {
  /** Monster ID */
  readonly id: number
  /** Monster level */
  readonly level: number
  /** Player count for co-op scaling */
  readonly playerCount: number
  /** Internal name */
  readonly internalName: string
  /** Monster name */
  readonly name: string
  /** Display name */
  readonly describeName: string
  /** Monster description */
  readonly description: string
  /** Display icon */
  readonly icon: ImageAssets | undefined
  /** Monster stats */
  readonly stats: readonly StatProperty[]
  /** Codex type */
  readonly codexType: SubType | undefined
}

/**
 * Monster data with stats and properties.
 * Pure DTO — no static dependencies.
 */
export class Monster {
  /** Monster ID */
  public readonly id: number
  /** Monster level */
  public readonly level: number
  /** Player count */
  public readonly playerCount: number
  /** Internal name */
  public readonly internalName: string
  /** Monster name */
  public readonly name: string
  /** Display name */
  public readonly describeName: string
  /** Monster description */
  public readonly description: string
  /** Display icon */
  public readonly icon: ImageAssets | undefined
  /** Monster stats */
  public readonly stats: readonly StatProperty[]
  /** Codex type */
  public readonly codexType: SubType | undefined

  /**
   * Create a Monster
   * @param data - Pre-resolved monster data
   */
  constructor(data: MonsterData) {
    this.id = data.id
    this.level = data.level
    this.playerCount = data.playerCount
    this.internalName = data.internalName
    this.name = data.name
    this.describeName = data.describeName
    this.description = data.description
    this.icon = data.icon
    this.stats = data.stats
    this.codexType = data.codexType
  }
}
