/**
 * JSON primitive types
 */
export type JsonPrimitive = string | number | boolean | null

/**
 * JSON value types (recursive)
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

/**
 * JSON object type
 */
export interface JsonObject {
  [key: string]: JsonValue
}

/**
 * JSON array type
 */
export type JsonArray = JsonValue[]
