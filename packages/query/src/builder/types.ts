import type { LocatedArray } from '@/value/LocatedArray'
import type { LocatedValue } from '@/value/LocatedValue'

/**
 * Valid index key types for WHERE conditions
 */
export type IndexKey = string | number

/**
 * Comparison operators for WHERE conditions
 */
export type ComparisonOperator =
  | '='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'in'
  | 'like'

/**
 * WHERE condition with comparison operator (Kysely-style)
 */
export interface WhereComparisonCondition {
  /** Condition type */
  readonly type: 'comparison'
  /** Column name */
  readonly key: string
  /** Comparison operator */
  readonly operator: ComparisonOperator
  /** Value(s) to compare */
  readonly value: IndexKey | readonly IndexKey[]
}

/**
 * WHERE condition for OR logic
 */
export interface WhereOrCondition {
  /** Condition type */
  readonly type: 'or'
  /** Conditions to OR together */
  readonly conditions: readonly WhereCondition[]
}

/**
 * WHERE condition for AND logic
 */
export interface WhereAndCondition {
  /** Condition type */
  readonly type: 'and'
  /** Conditions to AND together */
  readonly conditions: readonly WhereCondition[]
}

/**
 * WHERE condition for NOT logic
 */
export interface WhereNotCondition {
  /** Condition type */
  readonly type: 'not'
  /** Condition to negate */
  readonly condition: WhereCondition
}

/**
 * Union type of all WHERE conditions
 */
export type WhereCondition =
  | WhereComparisonCondition
  | WhereOrCondition
  | WhereAndCondition
  | WhereNotCondition

/**
 * Expression builder for constructing WHERE conditions
 * @template TRecord - The record type for type-safe property access
 */
export interface ExpressionBuilder<TRecord> {
  /**
   * Creates a comparison condition
   * @param property - Property name to compare
   * @param operator - Comparison operator
   * @param value - Value(s) to compare against
   * @returns A comparison condition
   */
  <P extends keyof TRecord & string>(
    property: P,
    operator: ComparisonOperator,
    value: (TRecord[P] & IndexKey) | readonly (TRecord[P] & IndexKey)[],
  ): WhereComparisonCondition

  /**
   * Creates an OR condition from multiple conditions
   * @param conditions - Conditions to OR together
   * @returns An OR condition
   */
  or(conditions: readonly WhereCondition[]): WhereOrCondition

  /**
   * Creates an AND condition from multiple conditions
   * @param conditions - Conditions to AND together
   * @returns An AND condition
   */
  and(conditions: readonly WhereCondition[]): WhereAndCondition

  /**
   * Creates a NOT condition
   * @param condition - Condition to negate
   * @returns A NOT condition
   */
  not(condition: WhereCondition): WhereNotCondition
}

/**
 * Expression builder callback parameter type
 * @template TRecord - The record type for type-safe property access
 */
export interface ExpressionBuilderArg<TRecord> {
  /** Expression builder function for creating conditions */
  readonly eb: ExpressionBuilder<TRecord>
  /** Creates an OR condition */
  readonly or: (conditions: readonly WhereCondition[]) => WhereOrCondition
  /** Creates an AND condition */
  readonly and: (conditions: readonly WhereCondition[]) => WhereAndCondition
  /** Creates a NOT condition */
  readonly not: (condition: WhereCondition) => WhereNotCondition
}

/**
 * ORDER BY configuration
 */
export interface OrderByConfig {
  /** Column to sort by */
  readonly key: string
  /** Sort direction */
  readonly direction: 'asc' | 'desc'
}

/**
 * Transforms a record type to wrap each property with LocatedValue/LocatedArray
 * @template TRecord - The original record type (preserves exact property types)
 * @template TSelected - The selected property keys
 */
export type SelectedRecord<TRecord, TSelected extends keyof TRecord> = {
  [P in TSelected]: TRecord[P] extends readonly (infer U)[]
    ? LocatedArray<U>
    : LocatedValue<TRecord[P]>
}
