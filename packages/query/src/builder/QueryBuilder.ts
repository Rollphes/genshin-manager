import type {
  IndexKey,
  OrderByConfig,
  SelectedRecord,
  WhereCondition,
} from '@/builder/types'
import type { Location } from '@/location/Location'
import { LocatedArray } from '@/value/LocatedArray'
import { LocatedValue } from '@/value/LocatedValue'
import type { TextMapProvider } from '@/value/types'

/**
 * Abstract query builder with SQL-like syntax
 * Provides select, where, orderBy, limit, offset operations
 * Subclasses implement actual data fetching
 * @template TRecord - The record type (preserves exact property types)
 * @template TSelected - Currently selected property keys
 * @template TTableName - The table name type for type safety
 */
export abstract class QueryBuilder<
  TRecord,
  TSelected extends keyof TRecord = keyof TRecord,
  TTableName extends string = string,
> {
  /** Table name for this query */
  protected readonly tableName: TTableName

  /** WHERE conditions */
  protected whereConditions: readonly WhereCondition[] = []

  /** Selected properties (undefined = all) */
  protected selectedProps: readonly (keyof TRecord & string)[] | undefined

  /** ORDER BY configuration */
  protected orderByConfig: OrderByConfig | undefined

  /** LIMIT count */
  protected limitCount: number | undefined

  /** OFFSET count */
  protected offsetCount: number | undefined

  /**
   * Creates a new QueryBuilder
   * @param tableName - The table name
   */
  constructor(tableName: TTableName) {
    this.tableName = tableName
  }

  /**
   * Selects specific properties from the record
   * @param props - Array of property names to select
   * @returns A new QueryBuilder with updated selection
   */
  public select<P extends (keyof TRecord & string)[]>(
    props: P,
  ): QueryBuilder<TRecord, P[number], TTableName> {
    const cloned = this.clone<P[number]>()
    cloned.selectedProps = props
    return cloned
  }

  /**
   * Selects all properties from the record
   * @returns A new QueryBuilder with all properties selected
   */
  public selectAll(): QueryBuilder<TRecord, keyof TRecord, TTableName> {
    const cloned = this.clone<keyof TRecord>()
    cloned.selectedProps = undefined
    return cloned
  }

  /**
   * Adds a WHERE equality condition
   * @param property - The property to filter on
   * @param value - The value to match
   * @returns A new QueryBuilder with the condition added
   */
  public where<P extends keyof TRecord & string>(
    property: P,
    value: TRecord[P] & IndexKey,
  ): QueryBuilder<TRecord, TSelected, TTableName> {
    const cloned = this.clone<TSelected>()
    cloned.whereConditions = [
      ...this.whereConditions,
      { type: 'eq', key: property, value },
    ]
    return cloned
  }

  /**
   * Adds a WHERE IN condition
   * @param property - The property to filter on
   * @param values - The values to match
   * @returns A new QueryBuilder with the condition added
   */
  public whereIn<P extends keyof TRecord & string>(
    property: P,
    values: readonly (TRecord[P] & IndexKey)[],
  ): QueryBuilder<TRecord, TSelected, TTableName> {
    const cloned = this.clone<TSelected>()
    cloned.whereConditions = [
      ...this.whereConditions,
      { type: 'in', key: property, values },
    ]
    return cloned
  }

  /**
   * Sets the ORDER BY clause
   * @param property - The property to sort by
   * @param direction - The sort direction
   * @returns A new QueryBuilder with ordering configured
   */
  public orderBy(
    property: keyof TRecord & string,
    direction: 'asc' | 'desc',
  ): QueryBuilder<TRecord, TSelected, TTableName> {
    const cloned = this.clone<TSelected>()
    cloned.orderByConfig = { key: property, direction }
    return cloned
  }

  /**
   * Sets the LIMIT clause
   * @param count - Maximum number of records to return
   * @returns A new QueryBuilder with limit configured
   */
  public limit(count: number): QueryBuilder<TRecord, TSelected, TTableName> {
    const cloned = this.clone<TSelected>()
    cloned.limitCount = count
    return cloned
  }

  /**
   * Sets the OFFSET clause
   * @param count - Number of records to skip
   * @returns A new QueryBuilder with offset configured
   */
  public offset(count: number): QueryBuilder<TRecord, TSelected, TTableName> {
    const cloned = this.clone<TSelected>()
    cloned.offsetCount = count
    return cloned
  }

  /**
   * Executes the query and returns all matching records
   * @returns Array of selected records wrapped with LocatedValue/LocatedArray
   */
  public async execute(): Promise<SelectedRecord<TRecord, TSelected>[]> {
    // 1. Execute query (subclass implementation)
    let results = await this.executeQuery()

    // 2. Apply ORDER BY
    // Dynamic property access: orderByConfig.key is validated at query build time via type constraints
    if (this.orderByConfig) {
      const { key, direction } = this.orderByConfig
      results = [...results].sort((a, b) => {
        const aRec = a as Record<string, TRecord[keyof TRecord]>
        const bRec = b as Record<string, TRecord[keyof TRecord]>
        const aVal = aRec[key]
        const bVal = bRec[key]
        const cmp = this.compareValues(aVal, bVal)
        return direction === 'asc' ? cmp : -cmp
      })
    }

    // 3. Apply OFFSET
    if (this.offsetCount !== undefined)
      results = results.slice(this.offsetCount)

    // 4. Apply LIMIT
    if (this.limitCount !== undefined)
      results = results.slice(0, this.limitCount)

    // 5. Build selected records with LocatedValue wrappers
    return results.map((record) => this.buildSelectedRecord(record))
  }

  /**
   * Executes the query and returns the first matching record
   * @returns The first selected record or undefined
   */
  public async executeTakeFirst(): Promise<
    SelectedRecord<TRecord, TSelected> | undefined
  > {
    const cloned = this.limit(1)
    const results = await cloned.execute()
    return results[0]
  }

  /**
   * Executes the query and returns the first matching record, throwing if not found
   * @returns The first selected record
   * @throws {@link Error} - If no record is found
   */
  public async executeTakeFirstOrThrow(): Promise<
    SelectedRecord<TRecord, TSelected>
  > {
    const result = await this.executeTakeFirst()
    if (!result) throw this.createNotFoundError()

    return result
  }

  /**
   * Gets the TextMapProvider for text lookups
   * Subclasses may override to provide text lookup capability
   * @returns TextMapProvider or undefined
   */
  protected getTextMapProvider(): TextMapProvider | undefined {
    return undefined
  }

  /**
   * Copies state from this builder to a clone
   * @param cloned - The cloned builder to copy state to
   */
  protected copyStateTo(
    cloned: QueryBuilder<TRecord, TSelected, TTableName>,
  ): void {
    cloned.whereConditions = [...this.whereConditions]
    cloned.selectedProps = this.selectedProps
      ? [...this.selectedProps]
      : undefined
    cloned.orderByConfig = this.orderByConfig
    cloned.limitCount = this.limitCount
    cloned.offsetCount = this.offsetCount
  }

  /**
   * Builds a SelectedRecord from a raw record
   * @param record - The raw record
   * @returns The selected record with LocatedValue wrappers
   */
  protected buildSelectedRecord(
    record: TRecord,
  ): SelectedRecord<TRecord, TSelected> {
    // Result accumulator with LocatedValue/LocatedArray wrappers
    const selected = new Map<
      string,
      | LocatedValue<TRecord[keyof TRecord]>
      | LocatedArray<TRecord[keyof TRecord]>
    >()
    // Dynamic access: TRecord is validated at subclass level; cast for Object.keys compatibility
    const recordObj = record as Record<string, TRecord[keyof TRecord]>
    const props =
      this.selectedProps ??
      (Object.keys(recordObj) as (keyof TRecord & string)[])
    const location = this.getLocation()
    const textMapProvider = this.getTextMapProvider()

    for (const prop of props) {
      const value = recordObj[prop]
      const propLocation = location.prop(prop)

      if (Array.isArray(value)) {
        selected.set(
          prop,
          new LocatedArray(value, propLocation, textMapProvider),
        )
      } else {
        selected.set(
          prop,
          new LocatedValue(value, propLocation, textMapProvider),
        )
      }
    }

    return Object.fromEntries(selected) as SelectedRecord<TRecord, TSelected>
  }

  /**
   * Compares two values for sorting
   * @param a - First value
   * @param b - Second value
   * @returns Comparison result (-1, 0, or 1)
   */
  private compareValues(a: unknown, b: unknown): number {
    if (a === b) return 0
    if (a === null || a === undefined) return 1
    if (b === null || b === undefined) return -1

    if (typeof a === 'number' && typeof b === 'number') return a - b

    if (typeof a === 'string' && typeof b === 'string')
      return a.localeCompare(b)

    // Convert to string for comparison (handles remaining types)
    return this.toComparableString(a).localeCompare(this.toComparableString(b))
  }

  /**
   * Converts a value to a comparable string
   * @param val - The value to convert
   * @returns String representation
   */
  private toComparableString(val: unknown): string {
    if (typeof val === 'object' && val !== null) return JSON.stringify(val)
    if (typeof val === 'boolean') return val ? 'true' : 'false'
    if (typeof val === 'number') return val.toString()
    if (typeof val === 'string') return val
    return ''
  }

  /**
   * Executes the query and returns raw record data
   * Subclasses must implement this to fetch data from storage
   * @returns Array of raw records
   */
  protected abstract executeQuery(): Promise<TRecord[]>

  /**
   * Creates an error for when no record is found
   * Subclasses must implement this to provide appropriate error type
   * @returns An error instance
   */
  protected abstract createNotFoundError(): Error

  /**
   * Gets the Location for the current query
   * Subclasses must implement this to provide location tracking
   * @returns A Location instance
   */
  protected abstract getLocation(): Location

  /**
   * Creates a clone of this QueryBuilder with new type parameters
   * Subclasses must implement this to create proper instances
   * @returns A new QueryBuilder instance
   */
  protected abstract clone<NewSelected extends keyof TRecord>(): QueryBuilder<
    TRecord,
    NewSelected,
    TTableName
  >
}
