import { Readable } from 'stream'

/**
 * ReadableStreamWrapper
 */
export class ReadableStreamWrapper extends Readable {
  /**
   * Create ReadableStreamWrapper.
   * @param reader ReadableStreamDefaultReader
   */
  constructor(private reader: ReadableStreamDefaultReader<Uint8Array>) {
    super()
  }

  /**
   * Read.
   */
  public _read(): void {
    this.reader
      .read()
      .then(({ done, value }) => {
        if (done) this.push(null)
        else if (value) this.push(Buffer.from(value))
      })
      .catch((err) => {
        this.emit('error', err)
      })
  }
}
