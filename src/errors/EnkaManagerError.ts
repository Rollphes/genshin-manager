/**
 * Error thrown when the EnkaManager fails
 */
export class EnkaManagerError extends Error {
  /**
   * Create a EnkaManagerError
   * @param msg Error message
   */
  constructor(msg: string) {
    super(msg)
  }
}
