/**
 * Type of Json primitive values
 */
export type JsonPrimitive = string | number | boolean | null | undefined

/**
 * Type of Json value
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

/**
 * Type of Json object
 */
export interface JsonObject {
  readonly [key: string]: JsonValue
}

/**
 * Type of Json array
 */
export type JsonArray = readonly JsonValue[]

/**
 * Path to a property in a JSON object hierarchy
 * @example ['root', 0, 'child'] represents root[0].child
 */
export type JsonPropertyPath = (string | number)[]

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
  readonly keyPaths: ReadonlyMap<string, JsonPropertyPath>
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
  readonly keyMappings: ReadonlyMap<JsonPropertyPath, string>
  /** Confidence score 0-1, higher is better */
  readonly confidence: number
  /** List of errors encountered during decoding */
  readonly errors?: readonly string[]
  /** Paths that had partial matches */
  readonly partialMatches?: readonly JsonPropertyPath[]
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

/**
 * Enhanced master file structure with recursive support
 */
export interface EncryptedKeyMasterFile {
  /**
   * Metadata
   */
  metadata: {
    sourceFile: string
    generatedAt: string
  }
  /**
   * Primary key mapping template (decoded reference object with highest data density)
   */
  keyMappingTemplate: JsonObject
  /**
   * Alternative patterns for structural variations (optional, ordered by data density)
   */
  alternativePatterns?: JsonObject[]
}
