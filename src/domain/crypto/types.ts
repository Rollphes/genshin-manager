import type { JsonValue } from '@/domain/types/json'

/**
 * Key path type for tracking nested locations
 */
export type KeyPath = (string | number)[]

/**
 * Primitive pattern for matching simple values
 */
export interface PrimitivePattern {
  /** Pattern type discriminator */
  readonly type: 'primitive'
  /** Expected primitive value */
  readonly value: JsonValue
}

/**
 * Array pattern for matching array structures
 */
export interface ArrayPattern {
  /** Pattern type discriminator */
  readonly type: 'array'
  /** Patterns for array elements */
  readonly elements: readonly RecursivePattern[]
}

/**
 * Object pattern for matching object structures
 */
export interface ObjectPattern {
  /** Pattern type discriminator */
  readonly type: 'object'
  /** Patterns for object properties */
  readonly properties: ReadonlyMap<string, RecursivePattern>
  /** Original key paths for mapping */
  readonly keyPaths: ReadonlyMap<string, KeyPath>
}

/**
 * Enhanced pattern definition for recursive value matching
 */
export type RecursivePattern = PrimitivePattern | ArrayPattern | ObjectPattern

/**
 * Decoding result with path information
 */
export interface DecodingResult {
  /** Whether the decoding was successful */
  readonly success: boolean
  /** Maps encrypted key paths to original keys */
  readonly keyMappings: ReadonlyMap<KeyPath, string>
  /** Confidence score 0-1, higher is better */
  readonly confidence: number
  /** List of errors encountered during decoding */
  readonly errors?: readonly string[]
  /** Paths that had partial matches */
  readonly partialMatches?: readonly KeyPath[]
}

/**
 * Decoding options
 */
export interface DecodingOptions {
  /** Matching strategy: exact, subset, or fuzzy */
  readonly matchStrategy?: 'exact' | 'subset' | 'fuzzy'
  /** Maximum recursion depth */
  readonly maxDepth?: number
  /** Enable partial match mode */
  readonly enablePartialMatch?: boolean
}

/**
 * Required decoding options (all fields required)
 */
export type RequiredDecodingOptions = Required<DecodingOptions>
