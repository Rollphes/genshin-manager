import path from 'path'

import { asJsonObject } from '@/domain/typeGuards/asJsonObject'
import { asJsonObjectArray } from '@/domain/typeGuards/asJsonObjectArray'
import type { JsonObject } from '@/domain/types/json'
import { extractTextHashes } from '@/infrastructure/cache/extractTextHashes'
import { EncryptedKeyDecoder } from '@/infrastructure/crypto/EncryptedKeyDecoder'
import { loadExcelBinFile } from '@/infrastructure/dataLoader/loadExcelBinFile'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'
import { logger } from '@/infrastructure/logger/Logger'
import { ExcelBinOutputs } from '@/infrastructure/types/excelBinOutputs'
import { MasterFileMap as GeneratedMasterFileMap } from '@/infrastructure/types/generated/MasterFileMap'

/**
 * Extract keys with primitive values from object type
 */
export type PrimitiveKeys<T> = {
  [K in keyof T]: T[K] extends string | number | boolean ? K : never
}[keyof T]

/**
 * Index key type (primitive values only)
 */
type IndexKey = string | number | boolean

/**
 * Type guard to check if a value is a primitive index key
 * @param value - Value to check
 */
function isPrimitiveKey(value: unknown): value is IndexKey {
  const type = typeof value
  return type === 'string' || type === 'number' || type === 'boolean'
}

/**
 * Options for ExcelBinCache
 */
interface ExcelBinCacheOptions {
  /**
   * Path to ExcelBinOutput folder
   */
  readonly folderPath: string
  /**
   * Whether to auto-fix corrupted files
   */
  readonly autoFix: boolean
}

/**
 * Result of ExcelBinCache load operation
 */
interface ExcelBinLoadResult {
  /**
   * Whether the load was successful
   */
  readonly success: boolean
  /**
   * Whether all ExcelBinOutput files need re-download
   */
  readonly redownloadRequired?: boolean
}

/**
 * Manages ExcelBinOutput cache with flat array structure and lazy indexing
 */
export class ExcelBinCache {
  private readonly folderPath: string
  private readonly autoFix: boolean

  /**
   * Flat array data storage: table name → array of records
   */
  private readonly data = new Map<
    keyof GeneratedMasterFileMap,
    GeneratedMasterFileMap[keyof GeneratedMasterFileMap][]
  >()

  /**
   * Lazy index cache: "table_property" → (value → records[])
   */
  private readonly groupByCache = new Map<
    string,
    Map<IndexKey, GeneratedMasterFileMap[keyof GeneratedMasterFileMap][]>
  >()

  /**
   * Creates an instance of ExcelBinCache
   * @param options - Cache options
   */
  constructor(options: ExcelBinCacheOptions) {
    this.folderPath = options.folderPath
    this.autoFix = options.autoFix
  }

  /**
   * Get all ExcelBinOutput keys
   */
  public static get allKeys(): Set<keyof typeof ExcelBinOutputs> {
    return new Set(
      Object.keys(ExcelBinOutputs).map(
        (key) => key as keyof typeof ExcelBinOutputs,
      ),
    )
  }

  /**
   * Extract text hashes from current cache
   */
  public extractTextHashes(): Set<number> {
    const allData: Record<string, Record<string, JsonObject>> = {}
    for (const [key, records] of this.data) {
      const indexed: Record<string, JsonObject> = {}
      for (let i = 0; i < records.length; i++)
        indexed[String(i)] = asJsonObject(records[i])

      allData[key] = indexed
    }
    return extractTextHashes(allData)
  }

  /**
   * Get all records for a table
   * @param table - Table name
   * @throws AssetNotFoundError if table not loaded
   */
  public getAll<K extends keyof GeneratedMasterFileMap>(
    table: K,
  ): GeneratedMasterFileMap[K][] {
    const records = this.data.get(table)
    if (!records) throw new AssetNotFoundError(table)
    return records as GeneratedMasterFileMap[K][]
  }

  /**
   * Check if table is loaded
   * @param table - Table name
   */
  public hasTable(table: keyof GeneratedMasterFileMap): boolean {
    return this.data.has(table)
  }

  /**
   * Filter records by property value (uses lazy index for O(1) after first call)
   * @param table - Table name
   * @param property - Property name to filter by
   * @param value - Value to match
   * @throws AssetNotFoundError if table not loaded
   */
  public filterBy<
    K extends keyof GeneratedMasterFileMap,
    P extends PrimitiveKeys<GeneratedMasterFileMap[K]>,
  >(
    table: K,
    property: P,
    value: GeneratedMasterFileMap[K][P],
  ): GeneratedMasterFileMap[K][] {
    const records = this.data.get(table)
    if (!records) throw new AssetNotFoundError(table)

    const cacheKey = `${table}_${String(property)}`
    let indexed = this.groupByCache.get(cacheKey)

    if (!indexed) {
      indexed = this.buildIndex(records, property as string)
      this.groupByCache.set(cacheKey, indexed)
    }

    const result = indexed.get(value as IndexKey)
    return (result ?? []) as GeneratedMasterFileMap[K][]
  }

  /**
   * Find first record by property value
   * @param table - Table name
   * @param property - Property name to filter by
   * @param value - Value to match
   * @throws AssetNotFoundError if table not loaded
   */
  public findBy<
    K extends keyof GeneratedMasterFileMap,
    P extends PrimitiveKeys<GeneratedMasterFileMap[K]>,
  >(
    table: K,
    property: P,
    value: GeneratedMasterFileMap[K][P],
  ): GeneratedMasterFileMap[K] | undefined {
    return this.filterBy(table, property, value)[0]
  }

  /**
   * Search records by text (full scan)
   * @param table - Table name
   * @param text - Text to search
   * @param textMap - TextMap data for hash lookup
   */
  public searchByText<K extends keyof GeneratedMasterFileMap>(
    table: K,
    text: string,
    textMap: Map<number, string>,
  ): GeneratedMasterFileMap[K][] {
    const records = this.getAll(table)
    const lowerText = text.toLowerCase()

    return records.filter((record) => {
      const obj = asJsonObject(record)
      return Object.keys(obj).some((key) => {
        if (key.includes('TextMapHash')) {
          const hashValue = obj[key]
          if (typeof hashValue === 'number') {
            const textValue = textMap.get(hashValue)
            if (textValue) return textValue.toLowerCase().includes(lowerText)
          }
        }
        return false
      })
    })
  }

  /**
   * Load cache from files
   * @param keys - Keys to load
   * @returns Load result with success status and optional redownload flag
   */
  public async load(
    keys: Set<keyof typeof ExcelBinOutputs>,
  ): Promise<ExcelBinLoadResult> {
    this.clear()

    for (const key of keys) {
      const loadResult = await this.loadSingleFile(key)
      if (loadResult.redownloadRequired) return loadResult
    }

    return { success: true }
  }

  /**
   * Clear all cached data and indexes
   */
  public clear(): void {
    this.data.clear()
    this.groupByCache.clear()
  }

  /**
   * Build index for a property
   * @param records - Records to index
   * @param property - Property name to index by
   */
  private buildIndex<T extends object>(
    records: T[],
    property: string,
  ): Map<IndexKey, T[]> {
    const index = new Map<IndexKey, T[]>()

    for (const record of records) {
      if (!(property in record)) continue
      const value: unknown = (record as Record<string, unknown>)[property]
      if (isPrimitiveKey(value)) {
        const existing = index.get(value)
        if (existing) existing.push(record)
        else index.set(value, [record])
      }
    }

    return index
  }

  /**
   * Load a single file
   * @param key - ExcelBinOutput key
   */
  private async loadSingleFile(
    key: keyof typeof ExcelBinOutputs,
  ): Promise<ExcelBinLoadResult> {
    const filename = ExcelBinOutputs[key]
    const filePath = path.join(this.folderPath, filename)

    const result = await loadExcelBinFile<GeneratedMasterFileMap[typeof key]>(
      filePath,
      { autoFix: this.autoFix, fileName: filename },
    )

    if (result.redownloadRequired)
      return { success: false, redownloadRequired: true }

    if (result.data) {
      const decoded = this.decodeKeys(key, result.data)
      this.data.set(key, decoded)

      logger.debug(
        `ExcelBinCache: ${key} loaded (${String(decoded.length)} records)`,
      )
    }

    return { success: true }
  }

  /**
   * Decode encrypted keys in data
   * @param key - Table name
   * @param data - Raw data
   * @remarks The casts are safe because:
   * - MasterFileMap types extend JsonObject (input)
   * - EncryptedKeyDecoder returns DecodedType<K> = MasterFileMap[K][] (output)
   */
  private decodeKeys<K extends keyof typeof ExcelBinOutputs>(
    key: K,
    data: readonly GeneratedMasterFileMap[K][],
  ): GeneratedMasterFileMap[K][] {
    const decoder = new EncryptedKeyDecoder(key)
    return decoder.execute(
      asJsonObjectArray(data),
    ) as GeneratedMasterFileMap[K][]
  }
}
