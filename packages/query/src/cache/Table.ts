import { logger } from '@genshin-manager/core'

import type { IndexKey } from '@/cache/types'

/**
 * A single table with index management for fast lookups
 * Supports both single-key and composite-key indexes
 * @template TRecord - The record type (preserves exact property types)
 */
export class Table<TRecord> {
  private readonly data: readonly TRecord[]

  /** Primary index: key -> record index (for single-key indexes) */
  private readonly primaryIndexes = new Map<string, Map<IndexKey, number>>()

  /** Composite index: "key1:key2" -> compositeValue -> record indexes */
  private readonly compositeIndexes = new Map<
    string,
    Map<string, readonly number[]>
  >()

  /**
   * Creates a new Table with the given data
   * @param data - The records to store
   */
  constructor(data: readonly TRecord[]) {
    this.data = data
  }

  /**
   * Gets the number of records
   * @returns Record count
   */
  public get size(): number {
    return this.data.length
  }

  /**
   * Creates an index for the specified column(s)
   * @param pattern - The column(s) to index (single or composite)
   */
  public createIndex(pattern: readonly string[]): void {
    if (pattern.length === 1) this.createPrimaryIndex(pattern[0])
    else if (pattern.length > 1) this.createCompositeIndex(pattern)
  }

  /**
   * Gets a record by a single index key
   * @param key - The column name
   * @param value - The value to search for
   * @returns The record or undefined
   */
  public getByIndex(key: string, value: IndexKey): TRecord | undefined {
    const index = this.primaryIndexes.get(key)
    if (!index) return undefined

    const recordIndex = index.get(value)
    if (recordIndex === undefined) return undefined

    return this.data[recordIndex]
  }

  /**
   * Gets records by a composite index key
   * @param keys - The column names
   * @param values - The values to search for (in order)
   * @returns Array of matching records
   */
  public getByCompositeIndex(
    keys: readonly string[],
    values: readonly IndexKey[],
  ): readonly TRecord[] {
    const indexKey = keys.join(':')
    const index = this.compositeIndexes.get(indexKey)
    if (!index) return []

    // Use JSON.stringify to avoid separator collision
    // e.g., ['a:b', 'c'] and ['a', 'b:c'] become different keys
    const compositeValue = JSON.stringify(values)
    const recordIndexes = index.get(compositeValue)
    if (!recordIndexes) return []

    return recordIndexes.map((i) => this.data[i])
  }

  /**
   * Checks if a primary index exists for the given key
   * @param key - The column name
   * @returns True if index exists
   */
  public hasIndex(key: string): boolean {
    return this.primaryIndexes.has(key)
  }

  /**
   * Gets all records in the table
   * @returns All records
   */
  public getAll(): readonly TRecord[] {
    return this.data
  }

  /**
   * Creates a primary (single-key) index
   * @param key - The column to index
   */
  private createPrimaryIndex(key: string): void {
    if (this.primaryIndexes.has(key)) return

    const index = new Map<IndexKey, number>()

    for (let i = 0; i < this.data.length; i++) {
      const record = this.data[i]
      // Safe runtime access: key validity is checked at registration time
      const value = (record as Record<string, unknown>)[key]
      if (this.isValidIndexKey(value)) {
        if (index.has(value)) {
          logger.warn(
            `Table: Duplicate key detected for index "${key}": ${String(value)} ` +
              `(existing: record[${String(index.get(value))}], new: record[${String(i)}])`,
          )
        }
        index.set(value, i)
      }
    }

    this.primaryIndexes.set(key, index)
  }

  /**
   * Creates a composite (multi-key) index
   * @param pattern - The columns to index
   */
  private createCompositeIndex(pattern: readonly string[]): void {
    const indexKey = pattern.join(':')
    if (this.compositeIndexes.has(indexKey)) return

    const index = new Map<string, number[]>()

    for (let i = 0; i < this.data.length; i++) {
      const record = this.data[i]
      // Safe runtime access: key validity is checked at registration time
      const recordObj = record as Record<string, unknown>
      const values = pattern.map((key) => recordObj[key])

      if (values.every((v) => this.isValidIndexKey(v))) {
        // Use JSON.stringify to avoid separator collision
        // e.g., ['a:b', 'c'] and ['a', 'b:c'] become different keys
        const compositeValue = JSON.stringify(values)

        const existing = index.get(compositeValue)
        if (existing) existing.push(i)
        else index.set(compositeValue, [i])
      }
    }

    // Convert to readonly arrays
    const readonlyIndex = new Map<string, readonly number[]>()
    for (const [k, v] of index) readonlyIndex.set(k, v)

    this.compositeIndexes.set(indexKey, readonlyIndex)
  }

  /**
   * Checks if a value is a valid index key
   * @param value - The value to check
   * @returns True if valid
   */
  private isValidIndexKey(value: unknown): value is IndexKey {
    return typeof value === 'string' || typeof value === 'number'
  }
}
