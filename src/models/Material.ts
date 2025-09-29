import { Client } from '@/client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ItemType, MaterialType } from '@/types'

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
   * @param materialId material ID
   * @example
   * ```ts
   * const material = new Material(104001)
   * console.log(material.name)
   * console.log(material.description)
   * ```
   */
  constructor(materialId: number) {
    this.id = materialId
    const materialJson = Client._getJsonFromCachedExcelBinOutput(
      'MaterialExcelConfigData',
      this.id,
    )
    const nameTextMapHash = materialJson.nameTextMapHash as number
    const descTextMapHash = materialJson.descTextMapHash as number
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''
    this.description = Client._cachedTextMap.get(descTextMapHash) ?? ''
    this.icon = new ImageAssets(materialJson.icon as string)
    this.pictures = (materialJson.picPath as string[]).map(
      (v) => new ImageAssets(v),
    )
    this.itemType = materialJson.itemType as ItemType
    this.materialType = materialJson.materialType as MaterialType | undefined
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
    const materialDatas = Object.values(
      Client._getCachedExcelBinOutputByName('MaterialExcelConfigData'),
    )
    return materialDatas.map((data) => data.id as number)
  }

  /**
   * Get material ID by name
   * @param name material name
   * @returns material ID
   * @example
   * ```ts
   * const ids = Material.getMaterialIdByName('Mystic Enhancement Ore')
   * console.log(ids)
   * ```
   */
  public static getMaterialIdByName(name: string): number[] {
    return Client._searchIdInExcelBinOutByText(
      'MaterialExcelConfigData',
      name,
    ).map((k) => +k)
  }
}
