import type { Artifact } from '@/artifact/Artifact'

/**
 * Constructor data for SetBonus
 */
export interface SetBonusData {
  /** Set bonuses activated by 1 piece */
  readonly oneSetBonus: readonly Artifact[]
  /** Set bonuses activated by 2 pieces */
  readonly twoSetBonus: readonly Artifact[]
  /** Set bonuses activated by 4 pieces */
  readonly fourSetBonus: readonly Artifact[]
}

/**
 * Artifact set bonus activation state.
 * Pure DTO — categorization is done by Repository.
 */
export class SetBonus {
  /** Set bonuses activated by 1 piece */
  public readonly oneSetBonus: readonly Artifact[]
  /** Set bonuses activated by 2 pieces */
  public readonly twoSetBonus: readonly Artifact[]
  /** Set bonuses activated by 4 pieces */
  public readonly fourSetBonus: readonly Artifact[]

  /**
   * Create a SetBonus
   * @param data - Pre-resolved set bonus data
   */
  constructor(data: SetBonusData) {
    this.oneSetBonus = data.oneSetBonus
    this.twoSetBonus = data.twoSetBonus
    this.fourSetBonus = data.fourSetBonus
  }
}
