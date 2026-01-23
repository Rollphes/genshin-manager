import { loadTextMapFiles } from '@/infrastructure/dataLoader/textMap'
import type { Language } from '@/types/types'

/**
 * Options for TextMapCache
 */
export interface TextMapCacheOptions {
  /**
   * Path to TextMap folder
   */
  readonly folderPath: string
  /**
   * Whether to auto-fix corrupted files
   */
  readonly autoFix: boolean
}

/**
 * Result of TextMapCache load operation
 */
export interface TextMapLoadResult {
  /**
   * Whether the load was successful
   */
  readonly success: boolean
  /**
   * Language that needs re-download (when success is false and autoFix is enabled)
   */
  readonly redownloadLanguage?: Language
}

/**
 * Manages TextMap cache
 */
export class TextMapCache {
  /**
   * Cached text map data
   */
  public readonly data = new Map<number, string>()

  private readonly folderPath: string
  private readonly autoFix: boolean

  /**
   * Creates an instance of TextMapCache
   * @param options - Cache options
   */
  constructor(options: TextMapCacheOptions) {
    this.folderPath = options.folderPath
    this.autoFix = options.autoFix
  }

  /**
   * Load TextMap for specified language
   * @param language - Language to load
   * @param textHashes - Set of text hashes to filter
   * @returns Load result with success status and optional redownload language
   */
  public async load(
    language: Language,
    textHashes: Set<number>,
  ): Promise<TextMapLoadResult> {
    const result = await loadTextMapFiles(this.folderPath, {
      autoFix: this.autoFix,
      language,
      textHashes,
    })

    if (result.redownloadLanguage)
      return { success: false, redownloadLanguage: result.redownloadLanguage }

    if (result.data) {
      this.data.clear()
      for (const [key, value] of result.data) this.data.set(key, value)
    }

    return { success: true }
  }

  /**
   * Clear all cached data
   */
  public clear(): void {
    this.data.clear()
  }
}
