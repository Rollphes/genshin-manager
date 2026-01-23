import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ItemType, MaterialType } from '@/types/enums'

/**
 * Represents a game material or resource used for character and weapon enhancement
 */
export class Material {
  /**
   * Material ID
   */
  public readonly id: number
  /**
   * Material name
   */
  public readonly name: string
  /**
   * Material description
   */
  public readonly description: string
  /**
   * Material icon
   */
  public readonly icon: ImageAssets
  /**
   * Material pictures
   */
  public readonly pictures: ImageAssets[]
  /**
   * Material type
   */
  public readonly itemType: ItemType
  /**
   * Material type
   */
  public readonly materialType?: MaterialType

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a Material
   * @param materialId - material ID
   * @example
   * ```ts
   * const material = new Material(104001)
   * console.log(material.name)
   * console.log(material.description)
   * ```
   */
  constructor(materialId: number) {
    this.id = materialId
    const materialJson = Client._findBy(
      'MaterialExcelConfigData',
      'id',
      this.id,
    )
    if (!materialJson) {
      throw new AssetNotFoundError(
        `Material ${String(this.id)}`,
        'MaterialExcelConfigData',
      )
    }
    const nameTextMapHash = materialJson.nameTextMapHash
    const descTextMapHash = materialJson.descTextMapHash
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''
    this.description = Client._cachedTextMap.get(descTextMapHash) ?? ''
    this.icon = new ImageAssets(materialJson.icon)
    this.pictures = materialJson.picPath.map((v) => new ImageAssets(v))
    this.itemType = materialJson.itemType
    this.materialType = materialJson.materialType
  }

  /**
   * Get all material IDs
   * @returns all material IDs
   * @example
   * ```ts
   * const allIds = Material.allMaterialIds
   * console.log(allIds.length)
   * ```
   */
  public static get allMaterialIds(): number[] {
    const materialDatas = Client._getAll('MaterialExcelConfigData')
    return materialDatas.map((data) => data.id)
  }

  /**
   * Get material ID by name
   * @param name - material name
   * @returns material ID
   * @example
   * ```ts
   * const ids = Material.getMaterialIdByName('Mystic Enhancement Ore')
   * console.log(ids)
   * ```
   */
  public static getMaterialIdByName(name: string): number[] {
    return Client._searchByText('MaterialExcelConfigData', name).map(
      (data) => data.id,
    )
  }
}
