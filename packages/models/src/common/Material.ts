import type { ImageAssets } from '@/assets/ImageAssets'
import type { ItemType, MaterialType } from '@/types/enums'

/**
 * Constructor data for Material
 */
export interface MaterialData {
  /** Material ID */
  readonly id: number
  /** Localized material name */
  readonly name: string
  /** Localized material description */
  readonly description: string
  /** Material icon */
  readonly icon: ImageAssets
  /** Material pictures */
  readonly pictures: readonly ImageAssets[]
  /** Item type */
  readonly itemType: ItemType
  /** Material type */
  readonly materialType?: MaterialType
}

/**
 * Represents a game material or resource.
 * Pure DTO — no static dependencies.
 */
export class Material {
  /** Material ID */
  public readonly id: number
  /** Localized material name */
  public readonly name: string
  /** Localized material description */
  public readonly description: string
  /** Material icon */
  public readonly icon: ImageAssets
  /** Material pictures */
  public readonly pictures: readonly ImageAssets[]
  /** Item type */
  public readonly itemType: ItemType
  /** Material type */
  public readonly materialType: MaterialType | undefined

  /**
   * Create a Material
   * @param data - Pre-resolved material data
   */
  constructor(data: MaterialData) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.icon = data.icon
    this.pictures = data.pictures
    this.itemType = data.itemType
    this.materialType = data.materialType
  }
}
