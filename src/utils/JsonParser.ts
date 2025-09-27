import type { JsonArray, JsonObject, JsonValue } from '@/types/json'

//TODO: 将来的に削除予定。型厳格化したい。削除したら上部の型はsrc/type/indexに移動(as あんま使いたくない)
/**
 * Class of json parser
 */
export class JsonParser {
  private readonly json: JsonObject | JsonArray

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
