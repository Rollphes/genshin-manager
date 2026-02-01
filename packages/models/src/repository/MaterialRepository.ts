import type { ExcelBinCache, TextMapIndex } from '@genshin-manager/data'

import { ImageAssets } from '@/assets/ImageAssets'
import { Material } from '@/common/Material'
import { ItemType, MaterialType } from '@/types/enums'
import type { RepositoryDependencies } from '@/types/RepositoryDependencies'

/**
 * Repository for building Material DTOs from ExcelBin and TextMap data.
 */
export class MaterialRepository {
  private readonly excelBinCache: ExcelBinCache
  private readonly textMap: TextMapIndex
  private readonly imageBaseURL: string

  /**
   * Create a MaterialRepository
   * @param deps - Repository dependencies
   * @param imageBaseURL - Base URL for image assets
   */
  constructor(deps: RepositoryDependencies, imageBaseURL: string) {
    this.excelBinCache = deps.excelBinCache
    this.textMap = deps.textMap
    this.imageBaseURL = imageBaseURL
  }

  /**
   * Build a Material DTO
   * @param materialId - Material ID
   * @returns Material DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getMaterial(materialId: number): Promise<Material> {
    const result = await this.excelBinCache
      .fromWithTextMap('MaterialExcelConfigData', this.textMap)
      .select([
        'id',
        'nameTextMapHash',
        'descTextMapHash',
        'icon',
        'picPath',
        'itemType',
        'materialType',
      ])
      .where('id', '=', materialId)
      .executeTakeFirstOrThrow()

    const name = result.nameTextMapHash.toText()
    const description = result.descTextMapHash.toText()

    const picPath = result.picPath.value

    return new Material({
      id: materialId,
      name,
      description,
      icon: new ImageAssets({
        name: result.icon.value,
        imageBaseURL: this.imageBaseURL,
      }),
      pictures: picPath.map(
        (v) => new ImageAssets({ name: v, imageBaseURL: this.imageBaseURL }),
      ),
      itemType: result.itemType.toEnum(ItemType),
      materialType: result.materialType.toEnum(MaterialType),
    })
  }

  /**
   * Get all material IDs
   * @returns Array of material IDs
   */
  public async getAllMaterialIds(): Promise<number[]> {
    const results = await this.excelBinCache
      .from('MaterialExcelConfigData')
      .select(['id'])
      .execute()

    return results.map((r) => r.id.value)
  }
}
