import type { LocationSegment } from '@/location/types'

/**
 * Represents a location path within a data source
 * Used for error messages and debugging to show exactly where in the data structure a problem occurred
 */
export class Location {
  private readonly segments: readonly LocationSegment[]

  private constructor(segments: readonly LocationSegment[]) {
    this.segments = segments
  }

  /**
   * Creates a root Location with the specified type and name
   * @param type - The type of data source (e.g., "ExcelBin", "TextMap")
   * @param name - The name of the specific data source (e.g., "AvatarExcelConfigData")
   * @returns A new Location instance
   */
  public static create(type: string, name: string): Location {
    return new Location([{ type: 'root', value: `${type}:${name}` }])
  }

  /**
   * Creates a child Location with property access
   * @param name - The property name
   * @returns A new Location instance with the property segment appended
   */
  public prop(name: string): Location {
    return new Location([...this.segments, { type: 'prop', value: name }])
  }

  /**
   * Creates a child Location with array index access
   * @param idx - The array index
   * @returns A new Location instance with the index segment appended
   */
  public index(idx: number): Location {
    return new Location([...this.segments, { type: 'index', value: idx }])
  }

  /**
   * Creates a child Location with a filter condition
   * @param key - The filter key
   * @param value - The filter value
   * @returns A new Location instance with the filter segment appended
   */
  public filter(key: string, value: string | number): Location {
    return new Location([...this.segments, { type: 'filter', key, value }])
  }

  /**
   * Converts the location to a human-readable string representation
   * @returns String representation of the location path
   */
  public toString(): string {
    return this.segments
      .map((seg) => {
        switch (seg.type) {
          case 'root':
            return seg.value
          case 'prop':
            return `.${seg.value}`
          case 'index':
            return `[${String(seg.value)}]`
          case 'filter':
            return `[${seg.key}=${String(seg.value)}]`
        }
      })
      .join('')
  }

  /**
   * Gets a copy of the location segments for debugging
   * @returns Readonly array of location segments
   */
  public getSegments(): readonly LocationSegment[] {
    return this.segments
  }
}
