/**
 * Error thrown when value is out of range
 */
export class OutOfRangeError extends Error {
  public readonly name: string

  /**
   * Create a OutOfRangeError
   * @param message Error message
   * @param inputValue Out of range value
   * @param min Minimum value
   * @param max Maximum value
   */
  constructor(message: string, inputValue: number, min: number, max: number) {
    super(
      `${message}: ${String(inputValue)} is out of range [${String(min)} ~ ${String(max)}]`,
    )
    this.name = 'OutOfRangeError'
  }
}
