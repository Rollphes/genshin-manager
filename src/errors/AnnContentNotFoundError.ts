/**
 * Error thrown when a AnnContent is not found
 */
export class AnnContentNotFoundError extends Error {
  public readonly name: string
  public readonly id: number

  /**
   * Create a AnnContentNotFoundError
   * @param id AnnContent ID
   */
  constructor(id: number) {
    super(`AnnContent ${id} not found`)
    this.name = 'AnnContentNotFoundError'
    this.id = id
  }
}
