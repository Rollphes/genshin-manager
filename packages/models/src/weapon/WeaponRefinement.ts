import type { StatProperty } from '@/common/StatProperty'

/**
 * Constructor data for WeaponRefinement
 */
export interface WeaponRefinementData {
  /** Weapon ID */
  readonly id: number
  /** Refinement rank (1-5) */
  readonly refinementRank: number
  /** Skill name */
  readonly skillName: string | undefined
  /** Skill description */
  readonly skillDescription: string | undefined
  /** Added stat properties from refinement */
  readonly addProps: readonly StatProperty[]
}

/**
 * Weapon refinement data at a specific rank.
 * Pure DTO.
 */
export class WeaponRefinement {
  /** Weapon ID */
  public readonly id: number
  /** Refinement rank */
  public readonly refinementRank: number
  /** Skill name */
  public readonly skillName: string | undefined
  /** Skill description */
  public readonly skillDescription: string | undefined
  /** Added stat properties */
  public readonly addProps: readonly StatProperty[]

  /**
   * Create a WeaponRefinement
   * @param data - Pre-resolved weapon refinement data
   */
  constructor(data: WeaponRefinementData) {
    this.id = data.id
    this.refinementRank = data.refinementRank
    this.skillName = data.skillName
    this.skillDescription = data.skillDescription
    this.addProps = data.addProps
  }
}
