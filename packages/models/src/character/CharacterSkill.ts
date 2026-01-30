import type { ImageAssets } from '@/assets/ImageAssets'

/**
 * Constructor data for CharacterSkill
 */
export interface CharacterSkillData {
  /** Skill ID */
  readonly id: number
  /** Skill name */
  readonly name: string
  /** Skill description */
  readonly description: string
  /** Skill icon */
  readonly icon: ImageAssets
  /** Skill level (includes extra level from constellations) */
  readonly level: number
  /** Extra levels from constellations */
  readonly extraLevel: number
  /** Parameter descriptions */
  readonly paramDescriptions: readonly string[]
}

/**
 * Character skill (normal attack, elemental skill, or elemental burst).
 * Pure DTO.
 */
export class CharacterSkill {
  /** Skill ID */
  public readonly id: number
  /** Skill name */
  public readonly name: string
  /** Skill description */
  public readonly description: string
  /** Skill icon */
  public readonly icon: ImageAssets
  /** Skill level */
  public readonly level: number
  /** Extra levels from constellations */
  public readonly extraLevel: number
  /** Parameter descriptions */
  public readonly paramDescriptions: readonly string[]

  /**
   * Create a CharacterSkill
   * @param data - Pre-resolved skill data
   */
  constructor(data: CharacterSkillData) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.icon = data.icon
    this.level = data.level
    this.extraLevel = data.extraLevel
    this.paramDescriptions = data.paramDescriptions
  }
}
