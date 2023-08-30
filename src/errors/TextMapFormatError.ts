import { TextMapLanguage } from '@/types'

export class TextMapFormatError extends Error {
  public readonly name: string

  constructor(language: keyof typeof TextMapLanguage) {
    super(
      `Invalid json format. Check if the "${TextMapLanguage[language]}" is correct`,
    )

    this.name = 'TextMapFormatError'
  }
}
