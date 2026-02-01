import { GeneralError } from '@genshin-manager/core'

import type { QueryLocation } from '@/location/QueryLocation'
import type { TextMapProvider } from '@/value/types'

/**
 * A value wrapper that tracks location information for error reporting
 * Provides type-safe transformation methods with automatic location tracking
 * @template T - The type of the wrapped value
 */
export class LocatedValue<T> {
  /** The wrapped value */
  public readonly value: T

  /** Location path for error messages */
  public readonly location: QueryLocation

  private readonly textMapProvider?: TextMapProvider

  /**
   * Creates a new LocatedValue
   * @param value - The value to wrap
   * @param location - The location path
   * @param textMapProvider - Optional TextMap provider for text lookups
   */
  constructor(
    value: T,
    location: QueryLocation,
    textMapProvider?: TextMapProvider,
  ) {
    this.value = value
    this.location = location
    this.textMapProvider = textMapProvider
  }

  /**
   * Converts the value to an enum member with type safety and location tracking
   * @param enumObj - The enum object to validate against
   * @returns The enum value
   * @throws {@link GeneralError} - If the value is not a valid enum member
   */
  public toEnum<E extends Record<string, string | number>>(
    enumObj: E,
  ): E[keyof E] {
    if (typeof this.value !== 'string' && typeof this.value !== 'number') {
      throw new GeneralError(
        `toEnum requires string or number value, got ${typeof this.value} at ${this.location.toString()}`,
      )
    }

    const entries = Object.entries(enumObj)
    const found = entries.find(([, v]) => v === this.value)

    if (!found) {
      const validValues = entries.map(([, v]) => String(v)).join(', ')
      throw new GeneralError(
        `Invalid enum value: ${String(this.value)}. Valid values: ${validValues} at ${this.location.toString()}`,
      )
    }

    // Type assertion is safe here because we verified the value exists in enumObj
    return this.value as E[keyof E]
  }

  /**
   * Looks up the text from TextMap using this value as a hash
   * @returns The localized text string
   * @throws {@link GeneralError} - If TextMapProvider is not available or value is not a number
   * @throws {@link TextMapHashNotFoundError} - If the hash is not found in TextMap
   */
  public toText(): string {
    if (!this.textMapProvider) {
      throw new GeneralError(
        `TextMapProvider not available. Use fromWithTextMap() to inject TextMapProvider. Location: ${this.location.toString()}`,
      )
    }

    if (typeof this.value !== 'number') {
      throw new GeneralError(
        `toText requires number (hash) value, got ${typeof this.value} at ${this.location.toString()}`,
      )
    }

    return this.textMapProvider.getTextSync(this.value)
  }

  /**
   * Checks if the value is defined (not undefined or null)
   * @returns True if value is defined
   */
  public isDefined(): this is LocatedValue<Exclude<T, undefined | null>> {
    return this.value !== undefined && this.value !== null
  }

  /**
   * Maps the value to a new value while preserving location
   * @param fn - The mapping function
   * @returns A new LocatedValue with the mapped value
   */
  public map<R>(fn: (value: T) => R): LocatedValue<R> {
    return new LocatedValue(fn(this.value), this.location, this.textMapProvider)
  }

  /**
   * Gets the raw value or a default if undefined
   * @param defaultValue - The default value to return if this value is undefined
   * @returns The value or default
   */
  public orDefault<D>(defaultValue: D): T | D {
    if (this.value === undefined || this.value === null) return defaultValue
    return this.value
  }
}
