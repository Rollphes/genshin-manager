/**
 * Collects and aggregates enum values from generated Zod schemas.
 * Groups values by their common prefix and derives enum names automatically.
 */
export class EnumCollector {
  /** Regex for z.enum declarations */
  private static readonly enumPattern =
    /export const (\w+)Schema = z\.enum\(\[\s*([\s\S]*?)\s*\]\);/g

  /** Regex for extracting string values */
  private static readonly valuePattern = /"([^"]*)"/g

  /** Regex for valid UPPER_SNAKE_CASE enum values */
  private static readonly validEnumValuePattern = /^[A-Z][A-Z0-9_]*$/

  /** Collected enums: derivedEnumName -> Set<value> */
  private readonly enums = new Map<string, Set<string>>()

  /** Mapping: schemaName -> quicktypeEnumName -> derivedEnumNames[] */
  private readonly nameMapping = new Map<string, Map<string, string[]>>()

  /**
   * Get all derived enum names
   * @returns readonly array of enum names
   */
  public get enumNames(): readonly string[] {
    return [...this.enums.keys()]
  }

  /**
   * Get a defensive copy of the internal enum map
   * @returns readonly map of enumName to readonly set of values
   */
  public get enumsSnapshot(): ReadonlyMap<string, ReadonlySet<string>> {
    const copy = new Map<string, ReadonlySet<string>>()
    for (const [key, value] of this.enums.entries())
      copy.set(key, new Set(value))

    return copy
  }

  /**
   * Collect enum values from a schema string.
   * Values are grouped by their common prefix, not by quicktype's enum name.
   * @param schemaName - name of the schema being processed
   * @param schema - generated Zod schema string
   * @throws - Never throws
   */
  public collect(schemaName: string, schema: string): void {
    const pattern = new RegExp(EnumCollector.enumPattern.source, 'g')
    let match

    const schemaMapping =
      this.nameMapping.get(schemaName) ?? new Map<string, string[]>()
    if (!this.nameMapping.has(schemaName))
      this.nameMapping.set(schemaName, schemaMapping)

    while ((match = pattern.exec(schema)) !== null) {
      const quicktypeName = match[1]
      const valuesStr = match[2]

      const allValues = this.extractValues(valuesStr)
      const validValues = allValues.filter((v) => this.isValidValue(v))

      // Skip if enum contains non-UPPER_SNAKE_CASE values (keep as local enum)
      if (allValues.length !== validValues.length) continue

      // Skip if no valid values or only one value (not worth extracting)
      if (validValues.length <= 1) continue

      const values = validValues

      const groupedByPrefix = this.groupValuesByPrefix(values)
      const derivedNames: string[] = []

      for (const [, groupValues] of groupedByPrefix) {
        // Skip groups with only one value (not worth extracting)
        if (groupValues.length <= 1) continue

        const derivedName = this.deriveEnumName(groupValues)
        derivedNames.push(derivedName)

        const enumSet = this.enums.get(derivedName) ?? new Set<string>()
        if (!this.enums.has(derivedName)) this.enums.set(derivedName, enumSet)

        for (const value of groupValues) enumSet.add(value)
      }

      schemaMapping.set(quicktypeName, derivedNames)
    }
  }

  /**
   * Get name mapping for a specific schema (defensive copy)
   * @param schemaName - name of the schema
   * @returns readonly map of quicktypeName to readonly array of derivedNames
   * @throws - Never throws
   */
  public getNameMapping(
    schemaName: string,
  ): ReadonlyMap<string, readonly string[]> {
    const original = this.nameMapping.get(schemaName)
    if (!original) return new Map<string, string[]>()

    const copy = new Map<string, readonly string[]>()
    for (const [key, value] of original.entries()) copy.set(key, [...value])

    return copy
  }

  /**
   * Extract string values from enum values string
   * @param valuesStr - raw string containing enum values
   * @returns array of extracted values
   */
  private extractValues(valuesStr: string): string[] {
    const pattern = new RegExp(EnumCollector.valuePattern.source, 'g')
    const values: string[] = []
    let match

    while ((match = pattern.exec(valuesStr)) !== null) values.push(match[1])

    return values
  }

  /**
   * Check if a value is valid UPPER_SNAKE_CASE enum value
   * @param value - value to check
   * @returns true if valid
   */
  private isValidValue(value: string): boolean {
    // Must be UPPER_SNAKE_CASE format (e.g., ITEM_USE_ADD_EXP)
    return EnumCollector.validEnumValuePattern.test(value)
  }

  /**
   * Group values by their first segment prefix.
   * Only separates values with completely different first segments.
   * @param values - array of UPPER_SNAKE_CASE values
   * @returns Map of firstSegment -> values
   */
  private groupValuesByPrefix(values: string[]): Map<string, string[]> {
    const groups = new Map<string, string[]>()

    for (const value of values) {
      const firstSegment = value.split('_')[0]
      const group = groups.get(firstSegment) ?? []
      if (!groups.has(firstSegment)) groups.set(firstSegment, group)
      group.push(value)
    }

    return groups
  }

  /**
   * Derive enum name from values by finding common prefix
   * @param values - array of enum values
   * @returns PascalCase enum name
   */
  private deriveEnumName(values: string[]): string {
    const prefix = this.findCommonPrefix(values)
    return this.toPascalCase(prefix)
  }

  /**
   * Find the longest common prefix among values (by underscore segments)
   * @param values - array of UPPER_SNAKE_CASE values
   * @returns common prefix (e.g., "ITEM_USE")
   */
  private findCommonPrefix(values: string[]): string {
    if (values.length === 0) return ''
    if (values.length === 1) {
      const segments = values[0].split('_')
      return segments.slice(0, -1).join('_') || segments[0]
    }

    const segmentArrays = values.map((v) => v.split('_'))
    const minLength = Math.min(...segmentArrays.map((s) => s.length))

    const commonSegments: string[] = []
    for (let i = 0; i < minLength - 1; i++) {
      const segment = segmentArrays[0][i]
      if (segmentArrays.every((arr) => arr[i] === segment))
        commonSegments.push(segment)
      else break
    }

    // Ensure at least one segment
    if (commonSegments.length === 0 && segmentArrays[0].length > 0)
      return segmentArrays[0][0]

    return commonSegments.join('_')
  }

  /**
   * Convert UPPER_SNAKE_CASE to PascalCase
   * @param snakeCase - e.g., "ITEM_USE"
   * @returns PascalCase - e.g., "ItemUse"
   */
  private toPascalCase(snakeCase: string): string {
    return snakeCase
      .split('_')
      .map((segment) => segment.charAt(0) + segment.slice(1).toLowerCase())
      .join('')
  }
}
