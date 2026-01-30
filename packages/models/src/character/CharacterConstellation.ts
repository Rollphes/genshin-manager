import type { ImageAssets } from '@/assets/ImageAssets'

/**
 * Constructor data for CharacterConstellation
 */
export interface CharacterConstellationData {
  /** Constellation ID */
  readonly id: number
  /** Constellation name */
  readonly name: string
  /** Constellation description */
  readonly description: string
  /** Constellation icon */
  readonly icon: ImageAssets
  /** Whether the constellation is locked */
  readonly locked: boolean
}

/**
 * Character constellation.
 * Pure DTO.
 */
export class CharacterConstellation {
  /** Constellation ID */
  public readonly id: number
  /** Constellation name */
  public readonly name: string
  /** Constellation description */
  public readonly description: string
  /** Constellation icon */
  public readonly icon: ImageAssets
  /** Whether the constellation is locked */
  public readonly locked: boolean

  /**
   * Create a CharacterConstellation
   * @param data - Pre-resolved constellation data
   */
  constructor(data: CharacterConstellationData) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.icon = data.icon
    this.locked = data.locked
  }
}
