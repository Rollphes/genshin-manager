/**
 * Domain data with materials and related characters/weapons
 */
export interface DomainData {
  /** Domain name */
  readonly name: string
  /** Domain description */
  readonly description: string
  /** Reward material IDs */
  readonly materialIds: readonly number[]
  /** Character IDs that use these materials */
  readonly characterIds: readonly number[]
  /** Weapon IDs that use these materials */
  readonly weaponIds: readonly number[]
}

/**
 * Constructor data for DailyFarming
 */
export interface DailyFarmingData {
  /** Day of week (0=Sunday, 1=Monday, ..., 6=Saturday) */
  readonly dayOfWeek: number
  /** Talent book material IDs */
  readonly talentBookIds: readonly number[]
  /** Weapon material IDs */
  readonly weaponMaterialIds: readonly number[]
  /** Domains available on this day */
  readonly domains: readonly DomainData[]
}

/**
 * Daily farming schedule data.
 * Pure DTO — no static dependencies.
 */
export class DailyFarming {
  /** Day of week */
  public readonly dayOfWeek: number
  /** Talent book material IDs */
  public readonly talentBookIds: readonly number[]
  /** Weapon material IDs */
  public readonly weaponMaterialIds: readonly number[]
  /** Domains */
  public readonly domains: readonly DomainData[]

  /**
   * Create a DailyFarming
   * @param data - Pre-resolved daily farming data
   */
  constructor(data: DailyFarmingData) {
    this.dayOfWeek = data.dayOfWeek
    this.talentBookIds = data.talentBookIds
    this.weaponMaterialIds = data.weaponMaterialIds
    this.domains = data.domains
  }
}
