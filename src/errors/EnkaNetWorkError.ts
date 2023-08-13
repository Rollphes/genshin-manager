export class EnkaNetworkError extends Error {
  public readonly name: string
  public readonly statusCode: number
  public readonly statusMessage: string

  constructor(message: string, statusCode: number, statusMessage: string) {
    super(message)

    this.name = 'EnkaNetworkError'
    this.statusCode = statusCode
    this.statusMessage = statusMessage
  }
}
