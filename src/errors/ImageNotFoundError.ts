/**
 * Error thrown when an image is not found
 */
export class ImageNotFoundError extends Error {
  public readonly imageName: string
  public readonly name: string
  public readonly url: string

  /**
   * Create a ImageNotFoundError
   * @param imageName Name of the image
   * @param url URL of the image
   */
  constructor(imageName: string, url: string) {
    super(`${imageName || 'undefined image'} was not found.`)

    this.name = 'ImageNotFoundError'
    this.imageName = imageName
    this.url = url
  }
}
