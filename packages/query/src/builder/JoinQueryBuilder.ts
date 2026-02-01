import type { IndexKey } from '@/builder/types'
import type { Location } from '@/location/Location'
import { LocatedArray } from '@/value/LocatedArray'
import { LocatedValue } from '@/value/LocatedValue'
import type { TextMapProvider } from '@/value/types'

/**
 * Result type for joined records
 * Each property is wrapped in LocatedValue or LocatedArray
 * @template TBase - Base record type (preserves exact property types)
 * @template TJoin - Join record type (preserves exact property types)
 * @template TSelected - Selected property keys from both records
 */
export type JoinedRecord<
  TBase,
  TJoin,
  TSelected extends keyof TBase | keyof TJoin,
> = {
  [P in TSelected & string]: P extends keyof TBase
    ? TBase[P] extends readonly (infer U)[]
      ? LocatedArray<U>
      : LocatedValue<TBase[P]>
    : P extends keyof TJoin
      ? TJoin[P] extends readonly (infer U)[]
        ? LocatedArray<U>
        : LocatedValue<TJoin[P]>
      : never
}

/**
 * Abstract query builder for JOIN operations
 * Supports INNER JOIN and LEFT JOIN between two record types
 * @template TBase - Base record type (preserves exact property types)
 * @template TJoin - Join record type (preserves exact property types)
 * @template TSelected - Currently selected property keys
 * @template TJoinTableName - The join table name type for type safety
 */
export abstract class JoinQueryBuilder<
  TBase,
  TJoin,
  TSelected extends keyof TBase | keyof TJoin = keyof TBase | keyof TJoin,
  TJoinTableName extends string = string,
> {
  /** Name of the join table */
  protected readonly joinTableName: TJoinTableName

  /** Key in base record to join on */
  protected readonly fromKey: keyof TBase & string

  /** Key in join record to match */
  protected readonly toKey: keyof TJoin & string

  /** Type of join */
  protected readonly joinType: 'inner' | 'left'

  /** Selected properties from base record */
  protected selectedBaseProps: readonly (keyof TBase & string)[] | undefined

  /** Selected properties from join record */
  protected selectedJoinProps: readonly (keyof TJoin & string)[] | undefined

  /**
   * Creates a new JoinQueryBuilder
   * @param joinTableName - The join table name
   * @param fromKey - Key in base record to join on
   * @param toKey - Key in join record to match
   * @param joinType - Type of join (inner or left)
   */
  constructor(
    joinTableName: TJoinTableName,
    fromKey: keyof TBase & string,
    toKey: keyof TJoin & string,
    joinType: 'inner' | 'left',
  ) {
    this.joinTableName = joinTableName
    this.fromKey = fromKey
    this.toKey = toKey
    this.joinType = joinType
  }

  /**
   * Selects properties from both base and join records
   * @param baseProps - Properties to select from base record
   * @param joinProps - Properties to select from join record
   * @returns A new JoinQueryBuilder with updated selection
   */
  public select<
    BP extends (keyof TBase & string)[],
    JP extends (keyof TJoin & string)[],
  >(
    baseProps: BP,
    joinProps: JP,
  ): JoinQueryBuilder<TBase, TJoin, BP[number] | JP[number], TJoinTableName> {
    const cloned = this.clone<BP[number] | JP[number]>()
    cloned.selectedBaseProps = baseProps
    cloned.selectedJoinProps = joinProps
    return cloned
  }

  /**
   * Executes the query and returns all joined records
   * @returns Array of joined records wrapped with LocatedValue/LocatedArray
   */
  public async execute(): Promise<JoinedRecord<TBase, TJoin, TSelected>[]> {
    // 1. Get base records
    const baseResults = await this.executeBaseQuery()

    // 2. Perform JOIN
    const joined: JoinedRecord<TBase, TJoin, TSelected>[] = []

    for (const baseRecord of baseResults) {
      const joinKey = baseRecord[this.fromKey]

      if (!this.isValidIndexKey(joinKey)) {
        if (this.joinType === 'left')
          joined.push(this.buildJoinedRecord(baseRecord, undefined))

        continue
      }

      const joinRecord = await this.getJoinRecord(joinKey)

      if (joinRecord !== undefined)
        joined.push(this.buildJoinedRecord(baseRecord, joinRecord))
      else if (this.joinType === 'left')
        joined.push(this.buildJoinedRecord(baseRecord, undefined))

      // For inner join, skip records with no match
    }

    return joined
  }

  /**
   * Executes the query and returns the first joined record
   * @returns The first joined record or undefined
   */
  public async executeTakeFirst(): Promise<
    JoinedRecord<TBase, TJoin, TSelected> | undefined
  > {
    const results = await this.execute()
    return results[0]
  }

  /**
   * Executes the query and returns the first joined record, throwing if not found
   * @returns The first joined record
   * @throws {@link Error} - If no record is found
   */
  public async executeTakeFirstOrThrow(): Promise<
    JoinedRecord<TBase, TJoin, TSelected>
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
    cloned: JoinQueryBuilder<TBase, TJoin, TSelected, TJoinTableName>,
  ): void {
    cloned.selectedBaseProps = this.selectedBaseProps
      ? [...this.selectedBaseProps]
      : undefined
    cloned.selectedJoinProps = this.selectedJoinProps
      ? [...this.selectedJoinProps]
      : undefined
  }

  /**
   * Builds a joined record from base and join records
   * @param baseRecord - The base record
   * @param joinRecord - The join record (undefined for LEFT JOIN with no match)
   * @returns The joined record with LocatedValue wrappers
   */
  protected buildJoinedRecord(
    baseRecord: TBase,
    joinRecord: TJoin | undefined,
  ): JoinedRecord<TBase, TJoin, TSelected> {
    // Result accumulator with LocatedValue/LocatedArray wrappers
    const result = new Map<
      string,
      | LocatedValue<TBase[keyof TBase] | TJoin[keyof TJoin] | undefined>
      | LocatedArray<TBase[keyof TBase] | TJoin[keyof TJoin]>
    >()
    const textMapProvider = this.getTextMapProvider()

    // Dynamic access: TBase/TJoin validated at subclass level; cast for Object.keys compatibility
    const baseObj = baseRecord as Record<string, TBase[keyof TBase]>
    const joinObj = joinRecord as Record<string, TJoin[keyof TJoin]> | undefined

    // Add base record properties
    const baseProps =
      this.selectedBaseProps ??
      (Object.keys(baseObj) as (keyof TBase & string)[])
    const baseLocation = this.getBaseLocation()

    for (const prop of baseProps) {
      const value = baseObj[prop]
      const propLocation = baseLocation.prop(prop)

      if (Array.isArray(value))
        result.set(prop, new LocatedArray(value, propLocation, textMapProvider))
      else
        result.set(prop, new LocatedValue(value, propLocation, textMapProvider))
    }

    // Add join record properties
    const joinProps =
      this.selectedJoinProps ??
      (joinObj ? (Object.keys(joinObj) as (keyof TJoin & string)[]) : [])
    const joinLocation = this.getJoinLocation()

    for (const prop of joinProps) {
      const value = joinObj?.[prop]
      const propLocation = joinLocation.prop(prop)

      if (Array.isArray(value))
        result.set(prop, new LocatedArray(value, propLocation, textMapProvider))
      else
        result.set(prop, new LocatedValue(value, propLocation, textMapProvider))
    }

    return Object.fromEntries(result) as JoinedRecord<TBase, TJoin, TSelected>
  }

  /**
   * Checks if a value is a valid index key
   * @param value - The value to check
   * @returns True if valid
   */
  private isValidIndexKey(value: unknown): value is IndexKey {
    return typeof value === 'string' || typeof value === 'number'
  }

  /**
   * Executes the base query and returns raw records
   * Subclasses must implement this to fetch base data
   * @returns Array of base records
   */
  protected abstract executeBaseQuery(): Promise<TBase[]>

  /**
   * Gets a join record by key
   * Subclasses must implement this to fetch join data
   * @param joinKey - The key to look up
   * @returns The join record or undefined
   */
  protected abstract getJoinRecord(
    joinKey: IndexKey,
  ): Promise<TJoin | undefined>

  /**
   * Creates an error for when no record is found
   * Subclasses must implement this to provide appropriate error type
   * @returns An error instance
   */
  protected abstract createNotFoundError(): Error

  /**
   * Creates a clone of this JoinQueryBuilder with new type parameters
   * Subclasses must implement this to create proper instances
   * @returns A new JoinQueryBuilder instance
   */
  protected abstract clone<
    NewSelected extends keyof TBase | keyof TJoin,
  >(): JoinQueryBuilder<TBase, TJoin, NewSelected, TJoinTableName>

  /**
   * Gets the Location for the base record
   * Subclasses must implement this to provide location tracking
   * @returns A Location instance
   */
  protected abstract getBaseLocation(): Location

  /**
   * Gets the Location for the join record
   * Subclasses must implement this to provide location tracking
   * @returns A Location instance
   */
  protected abstract getJoinLocation(): Location
}
