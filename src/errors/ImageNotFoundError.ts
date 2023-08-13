export class ImageNotFoundError extends Error {
  public readonly name: string
  public readonly imageName: string
  public readonly url: string

  constructor(imageName: string, url: string) {
    super(`${imageName || 'undefined image'} was not found.`)

    this.name = 'AssetsNotFoundError'
    this.imageName = imageName
    this.url = url
  }
}
