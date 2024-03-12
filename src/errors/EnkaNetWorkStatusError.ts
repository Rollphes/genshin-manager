/**
 * Error thrown when the EnkaNetwork status request fails or response damage
 */
export class EnkaNetWorkStatusError extends Error {
  public readonly name: string
  public readonly statusCode: number | undefined
  public readonly statusMessage: string | undefined
  public readonly url: string | undefined

  /**
   * Create a EnkaNetworkStatusError
   * @param reason Response of status.enka.network or error message
   */
  constructor(reason: Response | string) {
    if (reason instanceof Response) {
      const message = reason.statusText
      super(message)

      this.name = 'EnkaNetworkStatusError'
      this.statusCode = reason.status
      this.statusMessage = reason.statusText
      this.url = reason.url
    } else {
      super(reason)
      this.name = 'EnkaNetworkStatusError'
      this.statusCode = undefined
      this.statusMessage = undefined
      this.url = undefined
    }
  }
}
