import type { LocatedArray } from '@/value/LocatedArray'
import type { LocatedValue } from '@/value/LocatedValue'

/**
 * Valid index key types for WHERE conditions
 */
export type IndexKey = string | number

/**
 * WHERE condition for equality check
 */
export interface WhereEqCondition {
  /** Condition type */
  readonly type: 'eq'
  /** Column name */
  readonly key: string
  /** Value to match */
  readonly value: IndexKey
}

/**
 * WHERE condition for IN check
 */
export interface WhereInCondition {
  /** Condition type */
  readonly type: 'in'
  /** Column name */
  readonly key: string
  /** Values to match */
  readonly values: readonly IndexKey[]
}

/**
 * Union type of all WHERE conditions
 */
export type WhereCondition = WhereEqCondition | WhereInCondition

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
