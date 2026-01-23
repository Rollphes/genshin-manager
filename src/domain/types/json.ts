/**
 * Type of Json primitive values
 */
export type JsonPrimitive = string | number | boolean | null | undefined

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
 * Type of Json value
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray
