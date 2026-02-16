import { logger } from '@genshin-manager/core'
import type { TextMapProvider } from '@genshin-manager/query'
import { QueryLocation, TableCache } from '@genshin-manager/query'

import { EncryptedKeyDecoder } from '@/decoder/EncryptedKeyDecoder'
import { ExcelBinNotLoadedError } from '@/errors/ExcelBinNotLoadedError'
import { loadExcelBinFile } from '@/loader/loadExcelBinFile'
import { ExcelBinQuery } from '@/query/ExcelBinQuery'
import { ExcelBinOutputs } from '@/types/excelBinOutputs'
import type { MasterFileMap as GeneratedMasterFileMap } from '@/types/generated/MasterFileMap'

/**
 * Options for ExcelBinCache
 */
interface ExcelBinCacheOptions {
  /** Whether to auto-fix corrupted files */
  readonly autoFix: boolean
}

/**
 * Result of ExcelBinCache load operation
 */
interface ExcelBinLoadResult {
  /** Whether the load was successful */
  readonly success: boolean
  /** Whether all ExcelBinOutput files need re-download */
  readonly redownloadRequired?: boolean
}

/**
 * ExcelBin table cache extending TableCache
 * Provides lazy loading with automatic decryption and index building
 */
export class ExcelBinCache extends TableCache<
  keyof GeneratedMasterFileMap,
  GeneratedMasterFileMap[keyof GeneratedMasterFileMap]
> {
  /** Text hash extraction patterns */
  private static readonly textHashPatterns = {
    propertyName: /TextMapHash/,
    arrayProperties: ['tips', 'paramDescList'],
  } as const

  private readonly autoFix: boolean
  private loadedTables = new Set<keyof GeneratedMasterFileMap>()

  /**
   * Creates an instance of ExcelBinCache
   * @param options - Cache options
   */
  constructor(options: ExcelBinCacheOptions) {
    super(0) // 0 = unlimited tables
    this.autoFix = options.autoFix
    this.registerKnownIndexPatterns()
  }

  /** Get all ExcelBinOutput keys */
  public static get allKeys(): Set<keyof typeof ExcelBinOutputs> {
    return new Set(
      Object.keys(ExcelBinOutputs).map(
        (key) => key as keyof typeof ExcelBinOutputs,
      ),
    )
  }

  /**
   * Load all specified tables into cache
   * @param keys - Keys to load
   * @returns Load result with success status
   */
  public async load(
    keys: Set<keyof typeof ExcelBinOutputs>,
  ): Promise<ExcelBinLoadResult> {
    this.clear()
    this.loadedTables.clear()

    for (const key of keys) {
      const result = await this.loadSingleTable(key)
      if (result.redownloadRequired) return result
    }

    return { success: true }
  }

  /**
   * Extract text hashes from all loaded tables
   * @returns Set of text hashes
   */
  public extractTextHashes(): Set<number> {
    const hashes = new Set<number>()
    const { propertyName, arrayProperties } = ExcelBinCache.textHashPatterns

    for (const tableName of this.loadedTables) {
      const table = this.tables.get(tableName)
      if (!table) continue

      for (const entry of table.getAll()) {
        // Cast via unknown: MasterFileMap types don't have index signature
        this.extractHashesFromEntry(
          entry as unknown as Record<string, unknown>,
          hashes,
          propertyName,
          arrayProperties,
        )
      }
    }

    return hashes
  }

  /**
   * Check if ExcelBin is loaded
   * @param excelBinName - ExcelBin name
   * @returns True if ExcelBin is loaded
   */
  public hasExcelBin(excelBinName: keyof GeneratedMasterFileMap): boolean {
    return this.loadedTables.has(excelBinName)
  }

  /**
   * Creates a query builder for the specified ExcelBin table
   * @param excelBinName - The ExcelBin table name
   * @returns A new ExcelBinQuery instance
   */
  public from<K extends keyof GeneratedMasterFileMap>(
    excelBinName: K,
  ): ExcelBinQuery<K> {
    return new ExcelBinQuery(excelBinName, this)
  }

  /**
   * Creates a query builder with TextMap support
   * @param excelBinName - The ExcelBin table name
   * @param textMapProvider - TextMapProvider for text lookups
   * @returns A new ExcelBinQuery instance with TextMap support
   */
  public fromWithTextMap<K extends keyof GeneratedMasterFileMap>(
    excelBinName: K,
    textMapProvider: TextMapProvider,
  ): ExcelBinQuery<K> {
    return new ExcelBinQuery(excelBinName, this, textMapProvider)
  }

  /**
   * Gets all records for a table (synchronous, requires prior load)
   * @param tableName - The table name
   * @returns Array of records
   * @throws {@link ExcelBinNotLoadedError} - If table not loaded
   */
  public getRecords<K extends keyof GeneratedMasterFileMap>(
    tableName: K,
  ): GeneratedMasterFileMap[K][] {
    const table = this.tables.get(tableName)
    if (!table) {
      throw new ExcelBinNotLoadedError(
        QueryLocation.create('ExcelBin', tableName),
      )
    }
    return table.getAll() as GeneratedMasterFileMap[K][]
  }

  /**
   * Gets a single record by index key (O(1) lookup)
   * @param tableName - The table name
   * @param key - The index key name
   * @param value - The value to look up
   * @returns The record or undefined
   * @throws {@link ExcelBinNotLoadedError} - If table not loaded
   */
  public getByIndex<K extends keyof GeneratedMasterFileMap>(
    tableName: K,
    key: string,
    value: string | number,
  ): GeneratedMasterFileMap[K] | undefined {
    const table = this.tables.get(tableName)
    if (!table) {
      throw new ExcelBinNotLoadedError(
        QueryLocation.create('ExcelBin', tableName),
      )
    }
    return table.getByIndex(key, value) as GeneratedMasterFileMap[K] | undefined
  }

  /**
   * Checks if a table has an index for the given key
   * @param tableName - The table name
   * @param key - The index key name
   * @returns True if index exists
   */
  public hasIndex(
    tableName: keyof GeneratedMasterFileMap,
    key: string,
  ): boolean {
    const table = this.tables.get(tableName)
    if (!table) return false
    return table.hasIndex(key)
  }

  /**
   * Loads table data from file with decryption
   * @param tableName - The table to load
   * @returns Array of decoded records
   */
  protected async loadTableData(
    tableName: keyof GeneratedMasterFileMap,
  ): Promise<GeneratedMasterFileMap[keyof GeneratedMasterFileMap][]> {
    const result = await loadExcelBinFile<
      GeneratedMasterFileMap[typeof tableName],
      typeof tableName
    >({ autoFix: this.autoFix, excelBinName: tableName })

    if (!result.success) {
      throw new ExcelBinNotLoadedError(
        QueryLocation.create('ExcelBin', tableName),
      )
    }

    const decoder = new EncryptedKeyDecoder(
      tableName as keyof typeof ExcelBinOutputs,
    )
    return decoder.execute(result.data as never) as never
  }

  /**
   * Creates a Location for error reporting
   * @param tableName - The table name
   * @returns A Location instance
   */
  protected createLocation(
    tableName: keyof GeneratedMasterFileMap,
  ): QueryLocation {
    return QueryLocation.create('ExcelBin', tableName)
  }

  /**
   * Registers known index patterns for pre-building at load time
   * Type-safe registration using table-specific key types
   */
  private registerKnownIndexPatterns(): void {
    this.registerTableIndex('WeaponPromoteExcelConfigData', [
      ['weaponPromoteId'],
      ['weaponPromoteId', 'promoteLevel'],
    ])
    this.registerTableIndex('AvatarPromoteExcelConfigData', [
      ['avatarPromoteId'],
      ['avatarPromoteId', 'promoteLevel'],
    ])
    this.registerTableIndex('AvatarCostumeExcelConfigData', [
      ['skinId'],
      ['characterId', 'quality'],
    ])
    this.registerTableIndex('ProudSkillExcelConfigData', [
      ['proudSkillGroupId'],
      ['proudSkillGroupId', 'level'],
    ])
    this.registerTableIndex('FetterStoryExcelConfigData', [
      ['fetterId'],
      ['avatarId'],
    ])
    this.registerTableIndex('FettersExcelConfigData', [
      ['fetterId'],
      ['avatarId'],
    ])
    this.registerTableIndex('ReliquaryLevelExcelConfigData', [
      ['rank', 'level'],
    ])
    this.registerTableIndex('ReliquarySetExcelConfigData', [['setId']])
    this.registerTableIndex('EquipAffixExcelConfigData', [['affixId']])
    this.registerTableIndex('FetterInfoExcelConfigData', [['avatarId']])
    this.registerTableIndex('ManualTextMapConfigData', [['textMapId']])
    this.registerTableIndex('AvatarCurveExcelConfigData', [['level']])
    this.registerTableIndex('WeaponCurveExcelConfigData', [['level']])
    this.registerTableIndex('MonsterCurveExcelConfigData', [['level']])
  }

  /**
   * Type-safe index registration for a specific table
   * @param tableName - The table name
   * @param patterns - Index patterns with keys specific to that table
   */
  private registerTableIndex<K extends keyof GeneratedMasterFileMap>(
    tableName: K,
    patterns: (keyof GeneratedMasterFileMap[K] & string)[][],
  ): void {
    // Safe cast: patterns are validated at compile time per table type
    // Runtime behavior: string[][] stored in registry, used by Table.createIndex
    this.indexRegistry.register(tableName, patterns as string[][])
  }

  /**
   * Load a single table with error handling
   * @param key - ExcelBinOutput key
   * @returns Load result
   */
  private async loadSingleTable(
    key: keyof typeof ExcelBinOutputs,
  ): Promise<ExcelBinLoadResult> {
    try {
      await this.getTable(key)
      this.loadedTables.add(key)
      logger.debug(
        `ExcelBinCache: ${key} loaded (${String(this.tables.get(key)?.size ?? 0)} records)`,
      )
      return { success: true }
    } catch {
      return { success: false, redownloadRequired: true }
    }
  }

  /**
   * Extract hashes from an entry recursively
   * @param entry - Entry to extract from
   * @param hashes - Set to collect hashes
   * @param pattern - Property name pattern to match
   * @param arrayProperties - Array property names to extract from
   */
  private extractHashesFromEntry(
    entry: Record<string, unknown>,
    hashes: Set<number>,
    pattern: RegExp,
    arrayProperties: readonly string[],
  ): void {
    for (const [key, value] of Object.entries(entry)) {
      if (pattern.test(key) && typeof value === 'number') {
        hashes.add(value)
        continue
      }

      if (arrayProperties.includes(key) && Array.isArray(value)) {
        for (const item of value) if (typeof item === 'number') hashes.add(item)
        continue
      }

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        this.extractHashesFromEntry(
          value as Record<string, unknown>,
          hashes,
          pattern,
          arrayProperties,
        )
      }
    }
  }
}
