/**
 * Error thrown when a AnnContent is not found
 */
export class AnnContentNotFoundError extends Error {
  public readonly id: number
  public readonly name: string

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
