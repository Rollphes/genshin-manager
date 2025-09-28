/**
 * Error thrown when the EnkaNetwork status request fails
 */
export class EnkaNetWorkStatusError extends Error {
  public readonly name: string
  public readonly statusCode: number
  public readonly statusMessage: string
  public readonly url: string

  /**
   * Create a EnkaNetworkStatusError
   * @param reason response of status.enka.network
   */
  constructor(reason: Response) {
    const message = reason.statusText
    super(message)

    this.name = 'EnkaNetworkStatusError'
    this.statusCode = reason.status
    this.statusMessage = reason.statusText
    this.url = reason.url
  }
}
