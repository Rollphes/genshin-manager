import { Readable } from 'stream'

/**
 * Wraps Web ReadableStream as Node.js Readable stream
 */
export class ReadableStreamWrapper extends Readable {
  /**
   * Constructor for ReadableStreamWrapper
   * @param reader - Web API ReadableStreamDefaultReader to wrap
   */
  constructor(private reader: ReadableStreamDefaultReader<Uint8Array>) {
    super()
  }

  /**
   * Reads data from the underlying reader and pushes to stream
   * @internal
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
