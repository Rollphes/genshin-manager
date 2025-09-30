import type { JsonArray, JsonObject, JsonValue } from '@/types/json'

// TODO: Scheduled for future removal. Need to enforce stricter typing. Move types to src/types/index when removed (avoid using 'as' cast)
/**
 * JSON parser utility class
 */
export class JsonParser {
  private readonly json: JsonObject | JsonArray

  /**
   * Create a JsonParser
   * @param jsonString json string
   * @example
   * ```ts
   * const parser = new JsonParser('{"key": "value"}')
   * console.log(parser.get('key'))
   * ```
   */
  constructor(jsonString: string) {
    this.json = JSON.parse(jsonString) as JsonObject | JsonArray
  }

  /**
   * Get value from json
   * @param propertyPath property path
   * @returns value
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
