import type { StatProperty } from '@/common/StatProperty'

/**
 * Cost item for ascension
 */
export interface CostItem {
  /** Material ID */
  readonly id: number
  /** Required count */
  readonly count: number
}

/**
 * Constructor data for CharacterAscension
 */
export interface CharacterAscensionData {
  /** Character ID */
  readonly id: number
  /** Promote level */
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
 * Character ascension data at a specific promote level.
 * Pure DTO.
 */
export class CharacterAscension {
  /** Character ID */
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
   * Create CharacterAscension
   * @param data - Pre-resolved ascension data
   */
  constructor(data: CharacterAscensionData) {
    this.id = data.id
    this.promoteLevel = data.promoteLevel
    this.costItems = data.costItems
    this.costMora = data.costMora
    this.addProps = data.addProps
    this.unlockMaxLevel = data.unlockMaxLevel
  }
}
