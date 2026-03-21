import type { FlattenedEntry, PathSegment, ValueType } from '@/types'
import type { JsonObject, JsonPrimitive, JsonValue } from '@/types/json'

/**
 * Represents a flattened JSON object as an array of path-value entries
 */
export class FlatEntries {
  /**
   * Flattened entries from the JSON object
   */
  public readonly entries: FlattenedEntry[] = []

  /**
   * Create a new ObjectFlattener instance
   * @param obj - the JSON object to flatten
   */
  constructor(obj: JsonObject) {
    this.flattenRecursive(obj, [])
  }

  /**
   * Recursively flatten the value
   * @param value - current value to process
   * @param path - current path segments
   */
  private flattenRecursive(value: JsonValue, path: PathSegment[]): void {
    if (this.isPrimitive(value)) {
      this.addEntry(path, value)
      return
    }

    // Array or Object
    if (path.length > 0) this.addEntry(path, value)

    const entries = Array.isArray(value)
      ? value.entries()
      : Object.entries(value)

    ;[...entries].forEach(([key, child]) => {
      this.flattenRecursive(child, [...path, String(key) as PathSegment])
    })
  }

  /**
   * Add a flattened entry to the entries array
   * @param path - property path segments
   * @param value - JSON value at this path
   */
  private addEntry(path: PathSegment[], value: JsonValue): void {
    this.entries.push({
      path,
      value: this.isPrimitive(value) ? value : null,
      valueType: this.getValueType(value),
    })
  }

  /**
   * Get the value type of a JSON value
   * @param value - JSON value
   * @throws - Error if value type is unknown
   */
  private getValueType(value: JsonValue): ValueType {
    if (value === null) return 'null'
    if (Array.isArray(value)) return 'array'
    if (typeof value === 'object') return 'object'
    if (typeof value === 'string') return 'string'
    if (typeof value === 'number') return 'number'
    if (typeof value === 'boolean') return 'boolean'

    const _exhaustive: never = value
    throw new Error(`Unknown value type: ${String(_exhaustive)}`)
  }

  /**
   * Check if value is a JSON primitive
   * @param value - value to check
   */
  private isPrimitive(value: JsonValue): value is JsonPrimitive {
    const type = this.getValueType(value)
    return type !== 'array' && type !== 'object'
  }
}
