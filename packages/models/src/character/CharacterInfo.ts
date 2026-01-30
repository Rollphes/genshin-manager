import type { BodyType, WeaponType } from '@/types/enums'
import type { Element } from '@/types/types'

/**
 * Constructor data for CharacterInfo
 */
export interface CharacterInfoData {
  /** Character ID */
  readonly id: number
  /** Default costume ID */
  readonly defaultCostumeId: number
  /** Character name */
  readonly name: string
  /** Max level (default: 90) */
  readonly maxLevel: number
  /** Skill depot ID */
  readonly depotId: number
  /** Element */
  readonly element: Element | undefined
  /** Skill order (skill IDs) */
  readonly skillOrder: readonly number[]
  /** Inherent skill order (proud skill group IDs) */
  readonly inherentSkillOrder: readonly number[]
  /** Constellation IDs */
  readonly constellationIds: readonly number[]
  /** Map of skill ID → proud skill group ID */
  readonly proudMap: ReadonlyMap<number, number>
  /** Rarity (0-5, Aloy has 0) */
  readonly rarity: number
  /** Weapon type */
  readonly weaponType: WeaponType
  /** Body type */
  readonly bodyType: BodyType
}

/**
 * Character basic information.
 * Pure DTO — no static dependencies.
 */
export class CharacterInfo {
  /** Character ID */
  public readonly id: number
  /** Default costume ID */
  public readonly defaultCostumeId: number
  /** Character name */
  public readonly name: string
  /** Max level */
  public readonly maxLevel: number
  /** Skill depot ID */
  public readonly depotId: number
  /** Element */
  public readonly element: Element | undefined
  /** Skill order */
  public readonly skillOrder: readonly number[]
  /** Inherent skill order */
  public readonly inherentSkillOrder: readonly number[]
  /** Constellation IDs */
  public readonly constellationIds: readonly number[]
  /** Map of skill ID → proud skill group ID */
  public readonly proudMap: ReadonlyMap<number, number>
  /** Rarity */
  public readonly rarity: number
  /** Weapon type */
  public readonly weaponType: WeaponType
  /** Body type */
  public readonly bodyType: BodyType

  /**
   * Create a CharacterInfo
   * @param data - Pre-resolved character info data
   */
  constructor(data: CharacterInfoData) {
    this.id = data.id
    this.defaultCostumeId = data.defaultCostumeId
    this.name = data.name
    this.maxLevel = data.maxLevel
    this.depotId = data.depotId
    this.element = data.element
    this.skillOrder = data.skillOrder
    this.inherentSkillOrder = data.inherentSkillOrder
    this.constellationIds = data.constellationIds
    this.proudMap = data.proudMap
    this.rarity = data.rarity
    this.weaponType = data.weaponType
    this.bodyType = data.bodyType
  }
}
