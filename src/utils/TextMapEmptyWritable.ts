import { Writable } from 'stream'

/**
 * TextMapEmptyWritable
 */
export class TextMapEmptyWritable extends Writable {
  private buffer: Buffer = Buffer.from('')

  /**
   * Create TextMapEmptyWritable.
   * @param chunk Buffer
   * @param encoding Encoding
   * @param callback Callback
   */
  public _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: () => void,
  ): void {
    const combinedBuffer = Buffer.concat([this.buffer, chunk])
    const lineBuffers = this.splitBuffer(combinedBuffer, Buffer.from('\n'))
    this.buffer = lineBuffers.pop() || Buffer.from('')

    const lines = lineBuffers.map((buffer) => buffer.toString())

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

  private splitBuffer(array: Buffer, separator: Buffer): Buffer[] {
    const result: Buffer[] = []
    let start = 0
    let index: number

    while ((index = array.indexOf(separator, start)) !== -1) {
      result.push(array.slice(start, index))
      start = index + separator.length
    }

    result.push(array.slice(start))

    return result
  }
}
