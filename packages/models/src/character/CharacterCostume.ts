import type { ImageAssets } from '@/assets/ImageAssets'

/**
 * Constructor data for CharacterCostume
 */
export interface CharacterCostumeData {
  /** Costume ID */
  readonly id: number
  /** Character ID */
  readonly characterId: number
  /** Costume name */
  readonly name: string
  /** Costume description */
  readonly description: string
  /** Costume quality */
  readonly quality: number
  /** Side icon */
  readonly sideIcon: ImageAssets
  /** Icon */
  readonly icon: ImageAssets
  /** Art */
  readonly art: ImageAssets
  /** Card */
  readonly card: ImageAssets
}

/**
 * Character costume.
 * Pure DTO.
 */
export class CharacterCostume {
  /** Costume ID */
  public readonly id: number
  /** Character ID */
  public readonly characterId: number
  /** Costume name */
  public readonly name: string
  /** Costume description */
  public readonly description: string
  /** Costume quality */
  public readonly quality: number
  /** Side icon */
  public readonly sideIcon: ImageAssets
  /** Icon */
  public readonly icon: ImageAssets
  /** Art */
  public readonly art: ImageAssets
  /** Card */
  public readonly card: ImageAssets

  /**
   * Create a CharacterCostume
   * @param data - Pre-resolved costume data
   */
  constructor(data: CharacterCostumeData) {
    this.id = data.id
    this.characterId = data.characterId
    this.name = data.name
    this.description = data.description
    this.quality = data.quality
    this.sideIcon = data.sideIcon
    this.icon = data.icon
    this.art = data.art
    this.card = data.card
  }
}
