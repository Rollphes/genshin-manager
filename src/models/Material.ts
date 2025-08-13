import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ItemType, MaterialType } from '@/types'

/**
 * Class of material
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
   * @param materialId Material ID
   */
  constructor(materialId: number) {
    this.id = materialId
    const materialJson = Client._getJsonFromCachedExcelBinOutput(
      'MaterialExcelConfigData',
      this.id,
    )
    const nameTextMapHash = materialJson.nameTextMapHash as number
    const descTextMapHash = materialJson.descTextMapHash as number
    this.name = Client._cachedTextMap.get(String(nameTextMapHash)) ?? ''
    this.description = Client._cachedTextMap.get(String(descTextMapHash)) ?? ''
    this.icon = new ImageAssets(materialJson.icon as string)
    this.pictures = (materialJson.picPath as string[]).map(
      (v) => new ImageAssets(v),
    )
    this.itemType = materialJson.itemType as ItemType
    this.materialType = materialJson.materialType as MaterialType | undefined
  }

  /**
   * Get all material IDs
   * @returns All material IDs
   */
  public static get allMaterialIds(): number[] {
    const materialDatas = Object.values(
      Client._getCachedExcelBinOutputByName('MaterialExcelConfigData'),
    )
    return materialDatas.map((data) => data.id as number)
  }

  /**
   * Get material ID by name
   * @param name Material name
   * @returns Material ID
   */
  public static getMaterialIdByName(name: string): number[] {
    return Client._searchIdInExcelBinOutByText(
      'MaterialExcelConfigData',
      name,
    ).map((k) => +k)
  }
}
