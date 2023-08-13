import { ExcelBinOutputs, TextMapLanguage } from '@/types'

export class AssetsNotFoundError extends Error {
  public readonly name: string
  public readonly key: keyof (typeof ExcelBinOutputs & typeof TextMapLanguage)
  public readonly id?: string | number

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
