/**
 * Error thrown when an image is not found.
 */
export class ImageNotFoundError extends Error {
  public readonly name: string
  public readonly imageName: string
  public readonly url: string

  /**
   * Create a ImageNotFoundError
   * @param imageName Name of the image
   * @param url URL of the image
   */
  constructor(imageName: string, url: string) {
    super(`${imageName || 'undefined image'} was not found.`)

    this.name = 'AssetsNotFoundError'
    this.imageName = imageName
    this.url = url
  }
}
