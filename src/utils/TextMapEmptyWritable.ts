import { Writable } from 'stream'

/**
 * TextMapEmptyWritable
 * @extends Writable
 */
export class TextMapEmptyWritable extends Writable {
  private buffer: Buffer = Buffer.from('')

  public _write(chunk: Buffer, encoding: BufferEncoding, callback: () => void) {
    const combinedBuffer = Buffer.concat([this.buffer, chunk])
    const str = combinedBuffer.toString()
    const lines = str.split('\n')

    this.buffer = Buffer.from(lines.pop() || '')

    lines.forEach((line) => {
      const matchArray = line.match(/(?<=")([^"\\]|\\.)*?(?=")/g)
      if (!matchArray) return
      const [key, , value] = matchArray
      this.emit('data', {
        key: key,
        value: value.replace(/\\n/g, '\n'),
      })
    })

    callback()
  }
}
