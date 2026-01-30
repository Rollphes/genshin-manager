import type { CostItem } from '@/character/CharacterAscension'
import type { StatProperty } from '@/common/StatProperty'

/**
 * Constructor data for CharacterSkillAscension
 */
export interface CharacterSkillAscensionData {
  /** Skill ID */
  readonly id: number
  /** Skill level */
  readonly level: number
  /** Cost items */
  readonly costItems: readonly CostItem[]
  /** Cost mora */
  readonly costMora: number
  /** Added stat properties */
  readonly addProps: readonly StatProperty[]
}

/**
 * Character skill ascension (talent level-up costs).
 * Pure DTO.
 */
export class CharacterSkillAscension {
  /** Skill ID */
  public readonly id: number
  /** Skill level */
  public readonly level: number
  /** Cost items */
  public readonly costItems: readonly CostItem[]
  /** Cost mora */
  public readonly costMora: number
  /** Added stat properties */
  public readonly addProps: readonly StatProperty[]

  /**
   * Create a CharacterSkillAscension
   * @param data - Pre-resolved skill ascension data
   */
  constructor(data: CharacterSkillAscensionData) {
    this.id = data.id
    this.level = data.level
    this.costItems = data.costItems
    this.costMora = data.costMora
    this.addProps = data.addProps
  }
}
