import type { ImageAssets } from '@/assets/ImageAssets'
import type { StatProperty } from '@/common/StatProperty'

/**
 * Constructor data for CharacterInherentSkill
 */
export interface CharacterInherentSkillData {
  /** Inherent skill ID (proud skill group ID) */
  readonly id: number
  /** Inherent skill name */
  readonly name: string
  /** Inherent skill description */
  readonly description: string
  /** Inherent skill icon */
  readonly icon: ImageAssets
  /** Added stat properties */
  readonly addProps: readonly StatProperty[]
}

/**
 * Character inherent (passive) skill.
 * Pure DTO.
 */
export class CharacterInherentSkill {
  /** Inherent skill ID */
  public readonly id: number
  /** Inherent skill name */
  public readonly name: string
  /** Inherent skill description */
  public readonly description: string
  /** Inherent skill icon */
  public readonly icon: ImageAssets
  /** Added stat properties */
  public readonly addProps: readonly StatProperty[]

  /**
   * Create a CharacterInherentSkill
   * @param data - Pre-resolved inherent skill data
   */
  constructor(data: CharacterInherentSkillData) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.icon = data.icon
    this.addProps = data.addProps
  }
}
