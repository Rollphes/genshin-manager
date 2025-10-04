/**
 * Type of Json primitive values
 */
export type JsonPrimitive = string | number | boolean | null | undefined

/**
 * Type of Json object
 */
export interface JsonObject {
  [key: string]: JsonValue
}

/**
 * Type of Json array
 */
export type JsonArray = JsonValue[]

/**
 * Type of Json value
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray
