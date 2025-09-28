/**
 * Error thrown when value is out of range
 */
export class OutOfRangeError extends Error {
  public readonly name: string

  /**
   * Create a OutOfRangeError
   * @param message error message
   * @param inputValue out of range value
   * @param min minimum value
   * @param max maximum value
   * @example
   * ```ts
   * const level = 25
   * if (level > 20) {
   *   throw new OutOfRangeError('level', level, 0, 20)
   * }
   * ```
   */
  constructor(message: string, inputValue: number, min: number, max: number) {
    super(
      `${message}: ${String(inputValue)} is out of range [${String(min)} ~ ${String(max)}]`,
    )
    this.name = 'OutOfRangeError'
  }
}
