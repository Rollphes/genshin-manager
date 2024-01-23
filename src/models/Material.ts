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
    this.name =
      Client.cachedTextMap.get(String(materialJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(materialJson.descTextMapHash)) || ''
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
  public static getAllMaterialIds(): number[] {
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
    const hashes = Client._searchHashInCachedTextMapByValue(name)
    return Client._searchKeyInExcelBinOutputByTextHashes(
      'MaterialExcelConfigData',
      hashes,
    ).map((k) => +k)
  }
}
