import { ExcelBinPropertyNotFoundError } from '@genshin-manager/core'
import type { IndexKey, TextMapProvider } from '@genshin-manager/query'
import {
  JoinQueryBuilder,
  Location as QueryLocation,
} from '@genshin-manager/query'

import type { ExcelBinCache } from '@/cache/ExcelBinCache'
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
> extends JoinQueryBuilder<MasterRecord<K>, MasterRecord<J>, TSelected> {
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
    // Use internal execute that returns raw records without LocatedValue wrapping
    // Since baseQuery.execute() returns SelectedRecord, we need to get raw data
    const allRecords = this.excelBinCache.getRecords(this.baseTableName)
    return Promise.resolve(allRecords as MasterRecord<K>[])
  }

  /**
   * Gets a join record by key
   * @param joinKey - The key to look up
   * @returns The join record or undefined
   */
  protected getJoinRecord(
    joinKey: IndexKey,
  ): Promise<MasterRecord<J> | undefined> {
    const joinRecords = this.excelBinCache.getRecords(
      this.joinTableName as J,
    ) as MasterRecord<J>[]

    // Find record where toKey matches joinKey
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
      this.getBaseLocation().toString(),
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
      this.joinTableName as J,
      this.fromKey,
      this.toKey,
      this.joinType,
      this.textMapProvider,
    )
    this.copyStateTo(
      cloned as unknown as JoinQueryBuilder<
        MasterRecord<K>,
        MasterRecord<J>,
        TSelected
      >,
    )
    return cloned
  }

  /**
   * Gets the Location for the base record
   * @returns A QueryLocation instance
   */
  protected getBaseLocation(): QueryLocation {
    return QueryLocation.create('ExcelBin', this.baseTableName)
  }

  /**
   * Gets the Location for the join record
   * @returns A QueryLocation instance
   */
  protected getJoinLocation(): QueryLocation {
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
