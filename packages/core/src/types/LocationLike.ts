/**
 * Interface for Location-like objects
 * Allows error classes to accept both string paths and Location instances
 * Location class in @genshin-manager/query implements this interface
 */
export interface LocationLike {
  /**
   * Converts the location to a human-readable string representation
   * @returns String representation of the location path
   */
  toString(): string
}

/**
 * Type that accepts either a LocationLike object or a plain string
 * Used by error classes for backward compatibility
 */
export type LocationPath = LocationLike | string

/**
 * Converts a LocationPath to a string
 * @param location - LocationLike object or string
 * @returns String representation
 */
export function locationToString(location: LocationPath): string {
  if (typeof location === 'string') return location
  return location.toString()
}
