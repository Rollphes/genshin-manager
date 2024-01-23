/**
 * Error thrown when an audio is not found
 */
export class AudioNotFoundError extends Error {
  public readonly audioName: string
  public readonly name: string
  public readonly url: string

  /**
   * Create a AudioNotFoundError
   * @param audioName Name of the audio
   * @param url URL of the audio
   */
  constructor(audioName: string, url: string) {
    super(`${audioName || 'undefined audio'} was not found.`)

    this.name = 'AudioNotFoundError'
    this.audioName = audioName
    this.url = url
  }
}
