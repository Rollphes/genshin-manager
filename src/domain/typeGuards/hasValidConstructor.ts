/**
 * Type definition for class prototype with constructor
 */
interface ClassPrototypeWithConstructor {
  /** Constructor function with toString method */
  constructor: { toString: () => string }
}

/**
 * Type guard to check if a value has a valid constructor property
 * @param obj - Value to check
 * @returns true if obj has a valid constructor
 */
export function hasValidConstructor(
  obj: unknown,
): obj is ClassPrototypeWithConstructor {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'constructor' in obj &&
    typeof obj.constructor === 'function' &&
    typeof obj.constructor.toString === 'function'
  )
}
