import type { TextMapProvider } from '@genshin-manager/query'
import { QueryBuilder, QueryLocation } from '@genshin-manager/query'

import type { ExcelBinCache } from '@/cache/ExcelBinCache'
import { ExcelBinPropertyNotFoundError } from '@/errors/ExcelBinPropertyNotFoundError'
import { ExcelBinJoinQuery } from '@/query/ExcelBinJoinQuery'
import type { MasterFileMap } from '@/types/generated/MasterFileMap'

/**
 * Record type alias for MasterFileMap values
 * Preserves exact property types from generated MasterFileMap
 * @template K - The MasterFileMap key
 */
type MasterRecord<K extends keyof MasterFileMap> = MasterFileMap[K]

/**
 * ExcelBin query builder extending the generic QueryBuilder
 * Provides type-safe queries against ExcelBinOutput tables
 * Uses MasterRecord to bridge generated types (without index signature)
 * with QueryBuilder's Record constraint
 * @template K - The ExcelBin table name
 * @template TSelected - Currently selected property keys
 */
export class ExcelBinQuery<
  K extends keyof MasterFileMap,
  TSelected extends keyof MasterRecord<K> = keyof MasterRecord<K>,
> extends QueryBuilder<MasterRecord<K>, TSelected, K> {
  private readonly excelBinCache: ExcelBinCache
  private readonly textMapProvider?: TextMapProvider

  /**
   * Creates a new ExcelBinQuery
   * @param excelBinName - The ExcelBin table name
   * @param excelBinCache - The ExcelBinCache instance
   * @param textMapProvider - Optional TextMapProvider for text lookups
   */
  constructor(
    excelBinName: K,
    excelBinCache: ExcelBinCache,
    textMapProvider?: TextMapProvider,
  ) {
    super(excelBinName)
    this.excelBinCache = excelBinCache
    this.textMapProvider = textMapProvider
  }

  /**
   * Creates an INNER JOIN query with another ExcelBin table
   * Only records with matching keys in both tables will be returned
   * @param joinTableName - The table to join with
   * @param fromKey - Key in this table to join on
   * @param toKey - Key in join table to match
   * @returns A new ExcelBinJoinQuery instance
   */
  public innerJoin<J extends keyof MasterFileMap>(
    joinTableName: J,
    fromKey: keyof MasterRecord<K> & string,
    toKey: keyof MasterRecord<J> & string,
  ): ExcelBinJoinQuery<K, J> {
    // Cast via unknown: innerJoin is called before select(), so TSelected equals the default (keyof MasterRecord<K>).
    // TypeScript cannot verify TSelected equals the default, requiring unknown intermediate cast.
    const baseQuery = this as unknown as ExcelBinQuery<K>
    return new ExcelBinJoinQuery(
      baseQuery,
      this.excelBinCache,
      this.tableName,
      joinTableName,
      fromKey,
      toKey,
      'inner',
      this.textMapProvider,
    )
  }

  /**
   * Creates a LEFT JOIN query with another ExcelBin table
   * All records from this table will be returned, with null values for unmatched join records
   * @param joinTableName - The table to join with
   * @param fromKey - Key in this table to join on
   * @param toKey - Key in join table to match
   * @returns A new ExcelBinJoinQuery instance
   */
  public leftJoin<J extends keyof MasterFileMap>(
    joinTableName: J,
    fromKey: keyof MasterRecord<K> & string,
    toKey: keyof MasterRecord<J> & string,
  ): ExcelBinJoinQuery<K, J> {
    // Cast via unknown: leftJoin is called before select(), so TSelected equals the default (keyof MasterRecord<K>).
    // TypeScript cannot verify TSelected equals the default, requiring unknown intermediate cast.
    const baseQuery = this as unknown as ExcelBinQuery<K>
    return new ExcelBinJoinQuery(
      baseQuery,
      this.excelBinCache,
      this.tableName,
      joinTableName,
      fromKey,
      toKey,
      'left',
      this.textMapProvider,
    )
  }

  /**
   * Executes the query and returns raw records from ExcelBinCache
   * @returns Array of matching records
   */
  protected executeQuery(): Promise<MasterRecord<K>[]> {
    // Get all records from cache
    // Cast required: getRecords returns GeneratedMasterFileMap[K][] which equals MasterRecord<K>[]
    const allRecords = this.excelBinCache.getRecords(
      this.tableName,
    ) as MasterRecord<K>[]

    // No WHERE conditions: return all records
    if (this.whereConditions.length === 0) return Promise.resolve(allRecords)

    // Filter records based on WHERE conditions
    const filtered = allRecords.filter((record) => {
      for (const condition of this.whereConditions) {
        // Cast required: condition.key is string but we need keyof MasterRecord<K>
        // Validated at query build time via where() method signature
        const key = condition.key as keyof MasterRecord<K>
        const recordValue = record[key]

        if (condition.type === 'eq') {
          if (recordValue !== condition.value) return false
        } else {
          // condition.type === 'in'
          // Cast required: recordValue type is unknown, but whereIn validates it's IndexKey compatible
          if (!condition.values.includes(recordValue as string | number))
            return false
        }
      }
      return true
    })
    return Promise.resolve(filtered)
  }

  /**
   * Creates an error for when no record is found
   * @returns ExcelBinPropertyNotFoundError
   */
  protected createNotFoundError(): Error {
    const conditionStr = this.whereConditions
      .map((c) => {
        if (c.type === 'eq') return `${c.key}=${String(c.value)}`
        return `${c.key} in [${c.values.map(String).join(',')}]`
      })
      .join(', ')

    return new ExcelBinPropertyNotFoundError(this.getLocation(), conditionStr)
  }

  /**
   * Gets the Location for the current query
   * @returns A QueryLocation instance with filter conditions
   */
  protected getLocation(): QueryLocation<'ExcelBin', K> {
    let location = QueryLocation.create('ExcelBin', this.tableName)

    for (const condition of this.whereConditions) {
      if (condition.type === 'eq')
        location = location.filter(condition.key, condition.value)
    }

    return location
  }

  /**
   * Gets the TextMapProvider for text lookups
   * @returns TextMapProvider or undefined
   */
  protected getTextMapProvider(): TextMapProvider | undefined {
    return this.textMapProvider
  }

  /**
   * Creates a clone of this ExcelBinQuery with new type parameters
   * @returns A new ExcelBinQuery instance
   */
  protected clone<NewSelected extends keyof MasterRecord<K>>(): ExcelBinQuery<
    K,
    NewSelected
  > {
    const cloned = new ExcelBinQuery<K, NewSelected>(
      this.tableName,
      this.excelBinCache,
      this.textMapProvider,
    )
    // Cast via unknown: copyStateTo expects QueryBuilder<MasterRecord<K>, TSelected, K>
    // but cloned is ExcelBinQuery<K, NewSelected>. Both share the same base structure.
    this.copyStateTo(
      cloned as unknown as QueryBuilder<MasterRecord<K>, TSelected, K>,
    )
    return cloned
  }
}
