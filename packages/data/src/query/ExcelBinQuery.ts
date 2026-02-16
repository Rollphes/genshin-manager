import type { TextMapProvider, WhereCondition } from '@genshin-manager/query'
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
   * Uses index lookup for simple equality conditions when available
   * @returns Array of matching records
   */
  protected executeQuery(): Promise<MasterRecord<K>[]> {
    // No WHERE conditions: return all records
    if (this.whereConditions.length === 0) {
      return Promise.resolve(
        this.excelBinCache.getRecords(this.tableName) as MasterRecord<K>[],
      )
    }

    // Try to use index for the first simple equality condition
    const indexResult = this.tryIndexLookup()
    if (indexResult !== undefined) {
      // Found indexed result, filter with remaining conditions
      const remainingConditions = this.whereConditions.slice(1)
      if (remainingConditions.length === 0) return Promise.resolve(indexResult)

      const filtered = indexResult.filter((record) => {
        for (const condition of remainingConditions)
          if (!this.evaluateCondition(record, condition)) return false
        return true
      })
      return Promise.resolve(filtered)
    }

    // Fallback: full table scan with all conditions
    const allRecords = this.excelBinCache.getRecords(
      this.tableName,
    ) as MasterRecord<K>[]

    const filtered = allRecords.filter((record) => {
      for (const condition of this.whereConditions)
        if (!this.evaluateCondition(record, condition)) return false

      return true
    })
    return Promise.resolve(filtered)
  }

  /**
   * Attempts to use index lookup for the first equality condition
   * @remarks Called only when whereConditions.length > 0 (checked in executeQuery)
   * @returns Array with single record if found, empty array if not found, undefined if no index
   */
  private tryIndexLookup(): MasterRecord<K>[] | undefined {
    // Safe: executeQuery checks whereConditions.length > 0 before calling
    const firstCondition = this.whereConditions[0]

    // Only optimize simple top-level equality conditions
    if (firstCondition.type !== 'comparison' || firstCondition.operator !== '=')
      return undefined

    const key = firstCondition.key
    const value = firstCondition.value

    // Only string/number values can be indexed
    if (typeof value !== 'string' && typeof value !== 'number') return undefined

    // Check if index exists for this key
    if (!this.excelBinCache.hasIndex(this.tableName, key)) return undefined

    // Use O(1) index lookup
    const record = this.excelBinCache.getByIndex(this.tableName, key, value) as
      | MasterRecord<K>
      | undefined

    return record ? [record] : []
  }

  /**
   * Creates an error for when no record is found
   * @returns ExcelBinPropertyNotFoundError
   */
  protected createNotFoundError(): Error {
    const conditionStr = this.whereConditions
      .map((c) => this.formatCondition(c))
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
      if (condition.type === 'comparison' && condition.operator === '=') {
        location = location.filter(
          condition.key,
          condition.value as string | number,
        )
      }
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

  /**
   * Evaluates a WHERE condition against a record
   * @param record - The record to evaluate
   * @param condition - The condition to evaluate
   * @returns true if condition matches
   */
  private evaluateCondition(
    record: MasterRecord<K>,
    condition: WhereCondition,
  ): boolean {
    switch (condition.type) {
      case 'comparison': {
        const key = condition.key as keyof MasterRecord<K>
        const recordValue = record[key]
        return this.evaluateComparison(
          recordValue,
          condition.operator,
          condition.value,
        )
      }

      case 'or':
        return condition.conditions.some((c) =>
          this.evaluateCondition(record, c),
        )

      case 'and':
        return condition.conditions.every((c) =>
          this.evaluateCondition(record, c),
        )

      case 'not':
        return !this.evaluateCondition(record, condition.condition)
    }
  }

  /**
   * Evaluates a comparison operation
   * @param recordValue - The record field value
   * @param operator - The comparison operator
   * @param conditionValue - The condition value(s)
   * @returns true if comparison matches
   */
  private evaluateComparison(
    recordValue: MasterRecord<K>[keyof MasterRecord<K>],
    operator: string,
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    switch (operator) {
      case '=':
        return recordValue === conditionValue
      case '!=':
        return recordValue !== conditionValue
      case '>':
        return this.compareGreaterThan(recordValue, conditionValue)
      case '<':
        return this.compareLessThan(recordValue, conditionValue)
      case '>=':
        return this.compareGreaterOrEqual(recordValue, conditionValue)
      case '<=':
        return this.compareLessOrEqual(recordValue, conditionValue)
      case 'in':
        return this.evaluateIn(recordValue, conditionValue)
      case 'like':
        return this.evaluateLike(recordValue, conditionValue)
      default:
        return false
    }
  }

  /**
   * Compares two ordered values for greater-than
   * @param recordValue - The record field value
   * @param conditionValue - The condition value
   * @returns true if recordValue > conditionValue
   */
  private compareGreaterThan(
    recordValue: MasterRecord<K>[keyof MasterRecord<K>],
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue === 'number' && typeof conditionValue === 'number')
      return recordValue > conditionValue
    if (typeof recordValue === 'string' && typeof conditionValue === 'string')
      return recordValue > conditionValue
    return false
  }

  /**
   * Compares two ordered values for less-than
   * @param recordValue - The record field value
   * @param conditionValue - The condition value
   * @returns true if recordValue < conditionValue
   */
  private compareLessThan(
    recordValue: MasterRecord<K>[keyof MasterRecord<K>],
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue === 'number' && typeof conditionValue === 'number')
      return recordValue < conditionValue
    if (typeof recordValue === 'string' && typeof conditionValue === 'string')
      return recordValue < conditionValue
    return false
  }

  /**
   * Compares two ordered values for greater-than-or-equal
   * @param recordValue - The record field value
   * @param conditionValue - The condition value
   * @returns true if recordValue >= conditionValue
   */
  private compareGreaterOrEqual(
    recordValue: MasterRecord<K>[keyof MasterRecord<K>],
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue === 'number' && typeof conditionValue === 'number')
      return recordValue >= conditionValue
    if (typeof recordValue === 'string' && typeof conditionValue === 'string')
      return recordValue >= conditionValue
    return false
  }

  /**
   * Compares two ordered values for less-than-or-equal
   * @param recordValue - The record field value
   * @param conditionValue - The condition value
   * @returns true if recordValue <= conditionValue
   */
  private compareLessOrEqual(
    recordValue: MasterRecord<K>[keyof MasterRecord<K>],
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue === 'number' && typeof conditionValue === 'number')
      return recordValue <= conditionValue
    if (typeof recordValue === 'string' && typeof conditionValue === 'string')
      return recordValue <= conditionValue
    return false
  }

  /**
   * Evaluates IN condition
   * @param recordValue - The record field value
   * @param conditionValue - The condition values array
   * @returns true if value is in array
   */
  private evaluateIn(
    recordValue: MasterRecord<K>[keyof MasterRecord<K>],
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (!Array.isArray(conditionValue)) return false
    return conditionValue.includes(recordValue as string | number)
  }

  /**
   * Evaluates LIKE condition
   * @param recordValue - The record field value
   * @param conditionValue - The LIKE pattern
   * @returns true if pattern matches
   */
  private evaluateLike(
    recordValue: MasterRecord<K>[keyof MasterRecord<K>],
    conditionValue: string | number | readonly (string | number)[],
  ): boolean {
    if (typeof recordValue !== 'string' || typeof conditionValue !== 'string')
      return false

    // Escape regex special characters first, then convert SQL LIKE wildcards
    // This prevents ReDoS attacks and unintended regex matching
    const escaped = conditionValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = escaped.replace(/%/g, '.*').replace(/_/g, '.')
    return new RegExp(`^${pattern}$`, 'i').test(recordValue)
  }

  /**
   * Formats a WHERE condition for error message
   * @param condition - The condition to format
   * @returns Formatted condition string
   */
  private formatCondition(condition: WhereCondition): string {
    switch (condition.type) {
      case 'comparison':
        return `${condition.key}${condition.operator}${String(condition.value)}`
      case 'or':
        return `(${condition.conditions.map((c) => this.formatCondition(c)).join(' OR ')})`
      case 'and':
        return `(${condition.conditions.map((c) => this.formatCondition(c)).join(' AND ')})`
      case 'not':
        return `NOT(${this.formatCondition(condition.condition)})`
    }
  }
}
