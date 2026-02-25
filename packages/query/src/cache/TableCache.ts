import { LRUCache } from 'lru-cache'

import { IndexRegistry } from '@/cache/IndexRegistry'
import { Table } from '@/cache/Table'
import type { QueryLocation } from '@/location/QueryLocation'

/**
 * Abstract base class for table caching with LRU eviction and index management
 * Provides lazy loading of tables with automatic index creation
 * @template TTableName - The table name type
 * @template TRecord - The record type (preserves exact property types)
 */
export abstract class TableCache<TTableName extends string, TRecord> {
  /** Index pattern registry */
  protected readonly indexRegistry: IndexRegistry<TTableName>

  /** LRU cache for loaded tables */
  protected readonly tables: LRUCache<TTableName, Table<TRecord>>

  /**
   * Creates a new TableCache
   * @param maxTables - Maximum number of tables to keep in cache (0 = default 1000)
   */
  constructor(maxTables = 0) {
    this.indexRegistry = new IndexRegistry()

    const options: LRUCache.Options<
      TTableName,
      Table<TRecord>,
      unknown
    > = maxTables > 0 ? { max: maxTables } : { max: 1000 }
    this.tables = new LRUCache(options)
  }

  /**
   * Gets the number of cached tables
   * @returns Number of cached tables
   */
  public get size(): number {
    return this.tables.size
  }

  /**
   * Registers index patterns for a table
   * These patterns will be applied when the table is loaded
   * @param tableName - The table to register patterns for
   * @param patterns - Array of column combinations to index
   */
  public registerIndex(
    tableName: TTableName,
    patterns: (keyof TRecord & string)[][],
  ): void {
    this.indexRegistry.register(tableName, patterns)
  }

  /**
   * Gets a table, loading it if necessary
   * @param tableName - The table to get
   * @returns The table with indexes built
   */
  public async getTable(tableName: TTableName): Promise<Table<TRecord>> {
    const cached = this.tables.get(tableName)
    if (cached) return cached

    // Load table data
    const data = await this.loadTableData(tableName)
    const table = new Table(data)

    // Build indexes
    const patterns = this.indexRegistry.getPatterns(tableName)
    if (patterns) for (const pattern of patterns) table.createIndex(pattern)

    this.tables.set(tableName, table)
    return table
  }

  /**
   * Checks if a table is currently cached
   * @param tableName - The table to check
   * @returns True if the table is in cache
   */
  public has(tableName: TTableName): boolean {
    return this.tables.has(tableName)
  }

  /**
   * Removes a table from the cache
   * @param tableName - The table to remove
   * @returns True if the table was removed
   */
  public evict(tableName: TTableName): boolean {
    return this.tables.delete(tableName)
  }

  /**
   * Clears all cached tables
   */
  public clear(): void {
    this.tables.clear()
  }

  /**
   * Loads table data from storage
   * Subclasses must implement this to provide actual data loading
   * @param tableName - The table to load
   * @returns Array of records
   */
  protected abstract loadTableData(tableName: TTableName): Promise<TRecord[]>

  /**
   * Creates a QueryLocation for the specified table
   * Subclasses must implement this to provide location tracking
   * @param tableName - The table name
   * @returns A QueryLocation instance
   */
  protected abstract createLocation(tableName: TTableName): QueryLocation
}
