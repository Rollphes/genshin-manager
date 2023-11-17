import { Readable } from 'stream'

export class ReadableStreamWrapper extends Readable {
  constructor(private reader: ReadableStreamDefaultReader<Uint8Array>) {
    super()
  }

  _read() {
    this.reader
      .read()
      .then(({ done, value }) => {
        if (done) {
          this.push(null)
        } else if (value) {
          this.push(Buffer.from(value))
        }
      })
      .catch((err) => {
        this.emit('error', err)
      })
  }
}
