/**
 * Type of Json value
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray

/**
 * Type of Json object
 */
export type JsonObject = { [key: string]: JsonValue }

/**
 * Type of Json array
 */
export type JsonArray = JsonValue[]

/**
 * Class of json parser
 */
export class JsonParser {
  private json: JsonObject | JsonArray

  /**
   * Create a JsonParser
   * @param jsonString Json string
   */
  constructor(jsonString: string) {
    this.json = JSON.parse(jsonString) as JsonObject | JsonArray
  }

  /**
   * Get value from json
   * @param propertyPath Property path
   * @returns Value
   */
  public get(propertyPath?: string): JsonValue | undefined {
    const properties = propertyPath
      ? propertyPath.replace(/\]/g, '').split(/\.|\[/)
      : []

    let value: JsonValue = this.json
    for (const property of properties) {
      if (Array.isArray(value)) value = value[+property]
      else if (typeof value === 'object' && value != null)
        value = value[property]
      else return undefined
    }
    return value
  }
}
