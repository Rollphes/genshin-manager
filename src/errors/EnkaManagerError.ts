/**
 * Error thrown when the EnkaManager fails.
 */
export class EnkaManagerError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}
