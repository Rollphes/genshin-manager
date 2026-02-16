import type { IndexKey, TextMapProvider } from '@genshin-manager/query'
import { JoinQueryBuilder, QueryLocation } from '@genshin-manager/query'

import type { ExcelBinCache } from '@/cache/ExcelBinCache'
import { ExcelBinPropertyNotFoundError } from '@/errors/ExcelBinPropertyNotFoundError'
import type { ExcelBinQuery } from '@/query/ExcelBinQuery'
import type { MasterFileMap } from '@/types/generated/MasterFileMap'

/**
 * Record type alias for MasterFileMap values
 * Preserves exact property types from generated MasterFileMap
 * @template K - The MasterFileMap key
 */
type MasterRecord<K extends keyof MasterFileMap> = MasterFileMap[K]

/**
 * ExcelBin JOIN query builder extending the generic JoinQueryBuilder
 * Provides type-safe JOIN queries between ExcelBinOutput tables
 * @template K - The base ExcelBin table name
 * @template J - The join ExcelBin table name
 * @template TSelected - Currently selected property keys from both tables
 */
export class ExcelBinJoinQuery<
  K extends keyof MasterFileMap,
  J extends keyof MasterFileMap,
  TSelected extends keyof MasterRecord<K> | keyof MasterRecord<J> =
    | keyof MasterRecord<K>
    | keyof MasterRecord<J>,
> extends JoinQueryBuilder<MasterRecord<K>, MasterRecord<J>, TSelected, J> {
  private readonly baseQuery: ExcelBinQuery<K, keyof MasterRecord<K>>
  private readonly excelBinCache: ExcelBinCache
  private readonly textMapProvider?: TextMapProvider
  private readonly baseTableName: K

  /**
   * Creates a new ExcelBinJoinQuery
   * @param baseQuery - The base ExcelBinQuery
   * @param excelBinCache - The ExcelBinCache instance
   * @param baseTableName - The base table name
   * @param joinTableName - The join table name
   * @param fromKey - Key in base table to join on
   * @param toKey - Key in join table to match
   * @param joinType - Type of join (inner or left)
   * @param textMapProvider - Optional TextMapProvider for text lookups
   */
  constructor(
    baseQuery: ExcelBinQuery<K, keyof MasterRecord<K>>,
    excelBinCache: ExcelBinCache,
    baseTableName: K,
    joinTableName: J,
    fromKey: keyof MasterRecord<K> & string,
    toKey: keyof MasterRecord<J> & string,
    joinType: 'inner' | 'left',
    textMapProvider?: TextMapProvider,
  ) {
    super(joinTableName, fromKey, toKey, joinType)
    this.baseQuery = baseQuery
    this.excelBinCache = excelBinCache
    this.baseTableName = baseTableName
    this.textMapProvider = textMapProvider
  }

  /**
   * Executes the base query and returns raw records
   * @returns Array of base records
   */
  protected executeBaseQuery(): Promise<MasterRecord<K>[]> {
    // Get raw records without LocatedValue wrapping
    // Cast required: getRecords returns GeneratedMasterFileMap[K][] which equals MasterRecord<K>[]
    const allRecords = this.excelBinCache.getRecords(this.baseTableName)
    return Promise.resolve(allRecords as MasterRecord<K>[])
  }

  /**
   * Gets a join record by key using index lookup (O(1)) with fallback to linear scan
   * @param joinKey - The key to look up
   * @returns The join record or undefined
   */
  protected getJoinRecord(
    joinKey: IndexKey,
  ): Promise<MasterRecord<J> | undefined> {
    // Try O(1) index lookup first
    if (this.excelBinCache.hasIndex(this.joinTableName, this.toKey)) {
      const record = this.excelBinCache.getByIndex(
        this.joinTableName,
        this.toKey,
        joinKey,
      )
      return Promise.resolve(record as MasterRecord<J> | undefined)
    }

    // Fallback to linear scan if no index exists
    // Cast required: getRecords returns GeneratedMasterFileMap[J][] which equals MasterRecord<J>[]
    const joinRecords = this.excelBinCache.getRecords(
      this.joinTableName,
    ) as MasterRecord<J>[]

    return Promise.resolve(
      joinRecords.find((record) => record[this.toKey] === joinKey),
    )
  }

  /**
   * Creates an error for when no record is found
   * @returns ExcelBinPropertyNotFoundError
   */
  protected createNotFoundError(): Error {
    return new ExcelBinPropertyNotFoundError(
      this.getBaseLocation(),
      `JOIN ${this.joinTableName} ON ${this.fromKey} = ${this.toKey}`,
    )
  }

  /**
   * Creates a clone of this ExcelBinJoinQuery with new type parameters
   * @returns A new ExcelBinJoinQuery instance
   */
  protected clone<
    NewSelected extends keyof MasterRecord<K> | keyof MasterRecord<J>,
  >(): ExcelBinJoinQuery<K, J, NewSelected> {
    const cloned = new ExcelBinJoinQuery<K, J, NewSelected>(
      this.baseQuery,
      this.excelBinCache,
      this.baseTableName,
      this.joinTableName,
      this.fromKey,
      this.toKey,
      this.joinType,
      this.textMapProvider,
    )
    // Cast via unknown: copyStateTo expects JoinQueryBuilder with TSelected,
    // but cloned has NewSelected. Both share the same base structure.
    this.copyStateTo(
      cloned as unknown as JoinQueryBuilder<
        MasterRecord<K>,
        MasterRecord<J>,
        TSelected,
        J
      >,
    )
    return cloned
  }

  /**
   * Gets the Location for the base record
   * @returns A QueryLocation instance
   */
  protected getBaseLocation(): QueryLocation<'ExcelBin', K> {
    return QueryLocation.create('ExcelBin', this.baseTableName)
  }

  /**
   * Gets the Location for the join record
   * @returns A QueryLocation instance
   */
  protected getJoinLocation(): QueryLocation<'ExcelBin', J> {
    return QueryLocation.create('ExcelBin', this.joinTableName)
  }

  /**
   * Gets the TextMapProvider for text lookups
   * @returns TextMapProvider or undefined
   */
  protected getTextMapProvider(): TextMapProvider | undefined {
    return this.textMapProvider
  }
}
