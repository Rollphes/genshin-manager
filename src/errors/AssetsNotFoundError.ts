import { ExcelBinOutputs, TextMapLanguage } from '@/types'

/**
 * Error thrown when the assets are not found
 */
export class AssetsNotFoundError extends Error {
  public readonly id: string | number | undefined
  public readonly key: keyof (typeof ExcelBinOutputs & typeof TextMapLanguage)
  public readonly name: string

  /**
   * Create a AssetsNotFoundError
   * @param key key of assets
   * @param id ID of the specified asset
   * @example
   * ```ts
   * if (!assetExists) {
   *   throw new AssetsNotFoundError('MaterialExcelConfigData', 104001)
   * }
   * ```
   */
  constructor(
    key: keyof (typeof ExcelBinOutputs & typeof TextMapLanguage),
    id?: string | number,
  ) {
    const dictionary = {
      ...ExcelBinOutputs,
      ...TextMapLanguage,
    }

    super(
      `${dictionary[key].toString()} ${
        id !== undefined ? String(id) : ''
      } was not found. Try to update cached assets with Client#deploy`,
    )

    this.name = 'AssetsNotFoundError'
    this.key = key
    this.id = id
  }
}
