import type { StatProperty } from '@/common/StatProperty'

/**
 * Constructor data for CharacterBaseStats
 */
export interface CharacterBaseStatsData {
  /** Character ID */
  readonly id: number
  /** Character level */
  readonly level: number
  /** Promote level */
  readonly promoteLevel: number
  /** Whether character is ascended */
  readonly isAscended: boolean
  /** Calculated stat properties */
  readonly stats: readonly StatProperty[]
}

/**
 * Character base stats at a specific level and ascension.
 * Pure DTO — stats are pre-calculated by Repository.
 */
export class CharacterBaseStats {
  /** Character ID */
  public readonly id: number
  /** Character level */
  public readonly level: number
  /** Promote level */
  public readonly promoteLevel: number
  /** Whether character is ascended */
  public readonly isAscended: boolean
  /** Calculated stat properties */
  public readonly stats: readonly StatProperty[]

  /**
   * Create CharacterBaseStats
   * @param data - Pre-calculated base stats data
   */
  constructor(data: CharacterBaseStatsData) {
    this.id = data.id
    this.level = data.level
    this.promoteLevel = data.promoteLevel
    this.isAscended = data.isAscended
    this.stats = data.stats
  }
}
