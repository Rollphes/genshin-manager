import { Readable } from 'stream'

/**
 * ReadableStreamWrapper
 */
export class ReadableStreamWrapper extends Readable {
  /**
   * Create a ReadableStreamWrapper
   * @param reader ReadableStreamDefaultReader
   */
  constructor(private reader: ReadableStreamDefaultReader<Uint8Array>) {
    super()
  }

  /**
   * Read
   */
  public _read(): void {
    this.reader
      .read()
      .then(({ done, value }) => {
        if (done) this.push(null)
        else this.push(Buffer.from(value))
      })
      .catch((err: unknown) => {
        this.emit('error', err)
      })
  }
}
