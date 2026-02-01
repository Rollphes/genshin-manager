import { Language, logger } from '@genshin-manager/core'
import type { TextMapProvider } from '@genshin-manager/query'
import { Location as QueryLocation } from '@genshin-manager/query'
import { LRUCache } from 'lru-cache'

import { TextMapHashNotFoundError } from '@/errors/TextMapHashNotFoundError'
import type { FindTextMapFilesResult } from '@/loader/findTextMapFiles'
import { findTextMapFiles } from '@/loader/findTextMapFiles'
import { ConcatenatedFileReader } from '@/streams/ConcatenatedFileReader'

/**
 * Per-language TypedArray index for TextMap files
 */
interface LanguageIndex {
  /** Sorted hash array for binary search */
  readonly hashes: Uint32Array
  /** Byte offsets corresponding to each hash */
  readonly offsets: Uint32Array
  /** File reader for seeking to offsets */
  readonly reader: ConcatenatedFileReader
  /** Language code */
  readonly language: Language
}

/**
 * Temporary entry during index construction
 */
interface IndexEntry {
  readonly hash: number
  readonly offset: number
}

/**
 * Options for TextMapIndex
 */
export interface TextMapIndexOptions {
  /** Whether to auto-fix corrupted files (return redownload flag) */
  readonly autoFix: boolean
  /** Maximum number of text entries in LRU cache (default: 100000) */
  readonly textCacheSize?: number
}

/**
 * Result type for buildIndex
 */
export type BuildIndexResult =
  | { readonly success: true }
  | { readonly redownloadLanguage: Language }

/**
 * Hash pattern for extracting hash from a TextMap JSON line
 * Matches: "12345678":"text value"
 */
const hashPattern = /^"(\d+)"\s*:/

/**
 * TypedArray-based TextMap index with binary search and LRU text cache
 *
 * Responsibilities:
 * - Build TypedArray index (hashes + offsets) from TextMap files
 * - Binary search for O(log N) hash lookup
 * - LRU cache for frequently accessed text
 * - On-demand file reading via ConcatenatedFileReader
 *
 * Implements TextMapProvider for use with LocatedValue.toText()
 */
export class TextMapIndex implements TextMapProvider {
  private static readonly DEFAULT_CACHE_SIZE = 100000

  private readonly autoFix: boolean
  private readonly languageIndexes = new Map<Language, LanguageIndex>()
  private readonly textCache: LRUCache<string, string>
  private defaultLanguage: Language | undefined

  /**
   * Create a TextMapIndex
   * @param options - Index options
   */
  constructor(options: TextMapIndexOptions) {
    this.autoFix = options.autoFix
    this.textCache = new LRUCache<string, string>({
      max: options.textCacheSize ?? TextMapIndex.DEFAULT_CACHE_SIZE,
    })
  }

  /**
   * Current default language
   */
  public get currentLanguage(): Language | undefined {
    return this.defaultLanguage
  }

  /**
   * Number of language indexes built
   */
  public get languageCount(): number {
    return this.languageIndexes.size
  }

  /**
   * Build index for a language by scanning TextMap files
   * @param language - Language to index
   * @returns Build result (success or redownload required)
   */
  public async buildIndex(language: Language): Promise<BuildIndexResult> {
    // Close existing index for this language
    const existing = this.languageIndexes.get(language)
    if (existing) {
      await existing.reader.close()
      this.languageIndexes.delete(language)
    }

    // Find TextMap files using loader
    const findResult: FindTextMapFilesResult = findTextMapFiles({
      language,
      autoFix: this.autoFix,
    })

    if (!findResult.success)
      return { redownloadLanguage: findResult.redownloadLanguage }

    const locations = findResult.locations
    if (locations.length === 0) {
      logger.warn(`TextMapIndex: No files found for ${language}`)
      return { success: true }
    }

    const reader = new ConcatenatedFileReader([...locations])
    const entries = this.scanForEntries(reader)

    // Sort by hash for binary search
    entries.sort((a, b) => a.hash - b.hash)

    // Pack into TypedArrays
    const hashes = new Uint32Array(entries.length)
    const offsets = new Uint32Array(entries.length)

    for (let i = 0; i < entries.length; i++) {
      hashes[i] = entries[i].hash
      offsets[i] = entries[i].offset
    }

    this.languageIndexes.set(language, { hashes, offsets, reader, language })
    this.defaultLanguage = language

    logger.debug(
      `TextMapIndex: Built index for ${language} (${String(entries.length)} entries)`,
    )

    return { success: true }
  }

  /**
   * Get text by hash synchronously (from cache only)
   * Required by TextMapProvider interface for LocatedValue.toText()
   * @param hash - TextMap hash
   * @param language - Language (defaults to current language)
   * @returns Text string
   * @throws {@link TextMapHashNotFoundError} - If hash not found in cache
   */
  public getTextSync(hash: number, language?: Language): string {
    const lang = language ?? this.defaultLanguage

    if (!lang) {
      throw new TextMapHashNotFoundError(
        Language.En,
        QueryLocation.create('TextMap', Language.En),
        QueryLocation.create('unknown', ''),
        String(hash),
      )
    }

    const cacheKey = `${lang}_${String(hash)}`
    const cached = this.textCache.get(cacheKey)
    if (cached !== undefined) return cached

    throw new TextMapHashNotFoundError(
      lang,
      QueryLocation.create('TextMap', lang),
      QueryLocation.create('unknown', ''),
      String(hash),
    )
  }

  /**
   * Fetch text by hash, returning undefined if not found
   * @param hash - TextMap hash
   * @param language - Language (defaults to current language)
   * @returns Text string or undefined
   */
  public async fetchText(
    hash: number,
    language?: Language,
  ): Promise<string | undefined> {
    const lang = language ?? this.defaultLanguage
    if (!lang) return undefined

    // Check LRU cache first
    const cacheKey = `${lang}_${String(hash)}`
    const cached = this.textCache.get(cacheKey)
    if (cached !== undefined) return cached

    // Binary search in TypedArray index
    const langIndex = this.languageIndexes.get(lang)
    if (!langIndex) return undefined

    const idx = this.binarySearch(langIndex.hashes, hash)
    if (idx < 0) return undefined

    // Seek and read from file
    const offset = langIndex.offsets[idx]
    const text = await this.readTextAtOffset(langIndex.reader, offset, hash)

    if (text !== undefined) this.textCache.set(cacheKey, text)

    return text
  }

  /**
   * Fetch text by hash, throwing if not found
   * @param hash - TextMap hash
   * @param language - Language (defaults to current language)
   * @returns Text string
   * @throws {@link TextMapHashNotFoundError} - If hash not found
   */
  public async fetchTextRequired(
    hash: number,
    language?: Language,
  ): Promise<string> {
    const text = await this.fetchText(hash, language)
    const lang = language ?? this.defaultLanguage ?? Language.En
    if (text === undefined) {
      throw new TextMapHashNotFoundError(
        lang,
        QueryLocation.create('TextMap', lang),
        QueryLocation.create('unknown', ''),
        String(hash),
      )
    }
    return text
  }

  /**
   * Check if hash exists in index (O(log N), no file I/O)
   * @param hash - TextMap hash
   * @param language - Language (defaults to current language)
   * @returns True if hash exists in index
   */
  public has(hash: number, language?: Language): boolean {
    const lang = language ?? this.defaultLanguage
    if (!lang) return false

    const langIndex = this.languageIndexes.get(lang)
    if (!langIndex) return false

    return this.binarySearch(langIndex.hashes, hash) >= 0
  }

  /**
   * Batch load text for multiple hashes using sequential scan
   * @param hashes - Set of hashes to load
   * @param language - Language (defaults to current language)
   */
  public async batchLoad(
    hashes: Set<number>,
    language?: Language,
  ): Promise<void> {
    const lang = language ?? this.defaultLanguage
    if (!lang) return

    const langIndex = this.languageIndexes.get(lang)
    if (!langIndex) return

    // Filter to hashes not already cached
    const uncached: { hash: number; offset: number }[] = []
    for (const hash of hashes) {
      const cacheKey = `${lang}_${String(hash)}`
      if (this.textCache.has(cacheKey)) continue

      const idx = this.binarySearch(langIndex.hashes, hash)
      if (idx >= 0) uncached.push({ hash, offset: langIndex.offsets[idx] })
    }

    if (uncached.length === 0) return

    // Sort by offset for sequential I/O
    uncached.sort((a, b) => a.offset - b.offset)

    // Read all texts
    for (const { hash, offset } of uncached) {
      const text = await this.readTextAtOffset(langIndex.reader, offset, hash)
      if (text !== undefined) {
        const cacheKey = `${lang}_${String(hash)}`
        this.textCache.set(cacheKey, text)
      }
    }
  }

  /**
   * Close all file handles
   */
  public async close(): Promise<void> {
    for (const langIndex of this.languageIndexes.values())
      await langIndex.reader.close()

    this.languageIndexes.clear()
    this.textCache.clear()
    this.defaultLanguage = undefined
  }

  /**
   * Clear text cache only (keep indexes)
   */
  public clearTextCache(): void {
    this.textCache.clear()
  }

  /**
   * Scan files to build hash → offset entries
   * @param reader - File reader to scan
   */
  private scanForEntries(reader: ConcatenatedFileReader): IndexEntry[] {
    const entries: IndexEntry[] = []
    const content = reader.readAllSync()
    const lines = content.split('\n')
    let currentOffset = 0

    for (const line of lines) {
      const trimmed = line.trim()
      const match = hashPattern.exec(trimmed)

      if (match) {
        const hash = Number(match[1])
        if (!Number.isNaN(hash) && hash <= 0xffffffff)
          entries.push({ hash, offset: currentOffset })
      }

      // +1 for the newline separator
      currentOffset += Buffer.byteLength(line, 'utf8') + 1
    }

    return entries
  }

  /**
   * Read text value at a byte offset
   * @param reader - File reader to read from
   * @param offset - Byte offset to read at
   * @param expectedHash - Expected hash to validate
   */
  private async readTextAtOffset(
    reader: ConcatenatedFileReader,
    offset: number,
    expectedHash: number,
  ): Promise<string | undefined> {
    const line = await reader.readLine(offset)
    const trimmed = line.trim()

    // Parse: "hash":"value" or "hash": "value"
    const match = /^"(\d+)"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*$/.exec(trimmed)
    if (!match) return undefined

    const hash = Number(match[1])
    if (hash !== expectedHash) return undefined

    // Unescape JSON string escape sequences
    return match[2]
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
  }

  /**
   * Binary search in sorted Uint32Array
   * @param arr - Sorted array to search
   * @param target - Value to find
   * @returns Index of found element, or -1 if not found
   */
  private binarySearch(arr: Uint32Array, target: number): number {
    let lo = 0
    let hi = arr.length - 1

    while (lo <= hi) {
      const mid = (lo + hi) >>> 1
      const val = arr[mid]

      if (val === target) return mid
      if (val < target) lo = mid + 1
      else hi = mid - 1
    }

    return -1
  }
}
