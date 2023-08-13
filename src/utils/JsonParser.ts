export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[]

export class JsonParser {
  private json: JsonObject | JsonArray

  constructor(jsonString: string) {
    this.json = JSON.parse(jsonString) as JsonObject | JsonArray
  }

  public get(propertyPath?: string): JsonValue | undefined {
    const properties = propertyPath
      ? propertyPath.replace(/\]/g, '').split(/\.|\[/)
      : []

    let value: JsonValue = this.json
    for (const property of properties) {
      if (Array.isArray(value)) {
        value = value[+property]
      } else if (typeof value === 'object' && value != null) {
        value = value[property]
      } else {
        return undefined
      }
    }
    return value
  }
}
