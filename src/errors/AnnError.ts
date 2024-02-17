/**
 * Error thrown when the getAnnList or getAnnContent request fails
 */
export class AnnError extends Error {
  public readonly name: string
  public readonly statusCode: number
  public readonly statusMessage: string
  public readonly url: string

  /**
   * Create a AnnError
   * @param res Response of getAnnList or getAnnContent request
   */
  constructor(res: Response) {
    const message = res.statusText
    super(message)

    this.name = 'AnnError'
    this.statusCode = res.status
    this.statusMessage = res.statusText
    this.url = res.url
  }
}
