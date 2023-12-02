import { ExcelBinOutputs, TextMapLanguage } from '@/types'

/**
 * Error thrown when the assets are not found
 */
export class AssetsNotFoundError extends Error {
  public readonly id?: string | number
  public readonly key: keyof (typeof ExcelBinOutputs & typeof TextMapLanguage)
  public readonly name: string

  /**
   * Create a AssetsNotFoundError
   * @param key Key of assets
   * @param id ID of the specified asset
   */
  constructor(
    key: keyof (typeof ExcelBinOutputs & typeof TextMapLanguage),
    id?: string | number,
  ) {
    const dictionary = { ...ExcelBinOutputs, ...TextMapLanguage }

    super(
      `${dictionary[key]} ${
        id ?? ''
      } was not found. Try to update cached assets with Client#deploy`,
    )

    this.name = 'AssetsNotFoundError'
    this.key = key
    this.id = id
  }
}
