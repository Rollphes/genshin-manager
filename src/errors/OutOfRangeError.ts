/**
 * Error thrown if the value is out of range
 */
export class OutOfRangeError extends Error {
  public readonly name: string

  /**
   * Create a OutOfRangeError
   * @param message The error message
   * @param inputValue The value that is out of range
   * @param min the minimum value
   * @param max the maximum value
   */
  constructor(message: string, inputValue: number, min: number, max: number) {
    super(`${message}: ${inputValue} is out of range [${min} ~ ${max}]`)
    this.name = 'OutOfRangeError'
  }
}
