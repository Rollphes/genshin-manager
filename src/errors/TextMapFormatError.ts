import { TextMapLanguage } from '@/types'

/**
 * Error thrown when the text map is not in the correct format
 */
export class TextMapFormatError extends Error {
  public readonly name: string

  /**
   * Create a TextMapFormatError
   * @param language language of the text map
   */
  constructor(language: keyof typeof TextMapLanguage) {
    super(
      `Invalid json format. Check if the "${TextMapLanguage[language].join(', ')}" is correct`,
    )

    this.name = 'TextMapFormatError'
  }
}
