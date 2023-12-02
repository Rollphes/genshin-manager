const enkaNetworkStatusMessages: { [statusCode: number]: string } = {
  400: 'Wrong UID format',
  404: 'Player does not exist (MHY server said that)',
  424: 'Game maintenance / everything is broken after the game update',
  429: 'Rate-limited (either by my server or by MHY server)',
  500: 'General server error',
  503: 'I screwed up massively',
} as const

/**
 * Error thrown when the EnkaNetwork request fails
 */
export class EnkaNetworkError extends Error {
  public readonly name: string
  public readonly statusCode: number
  public readonly statusMessage: string

  /**
   * Create a EnkaNetworkError
   * @param res Response of EnkaNetwork request
   */
  constructor(res: Response) {
    const message = enkaNetworkStatusMessages[res.status] ?? 'Unknown error'
    super(message)

    this.name = 'EnkaNetworkError'
    this.statusCode = res.status
    this.statusMessage = res.statusText
  }
}
