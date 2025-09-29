import { Transform } from 'stream'

import { TextMapFormatError } from '@/errors/content/ContentError'
import { TextMapLanguage } from '@/types'

/**
 * TextMapTransform
 */
export class TextMapTransform extends Transform {
  private readonly language: keyof typeof TextMapLanguage
  private readonly filterSet: Set<number>
  private buffer: Buffer = Buffer.from('')
  private firstFlag = true

  /**
   * Create a TextMapTransform
   * @param language language
   * @param filterSet filter set
   */
  constructor(language: keyof typeof TextMapLanguage, filterSet: Set<number>) {
    super()
    this.language = language
    this.filterSet = filterSet
  }

  /**
   * Transform
   * @param chunk buffer
   * @param encoding encoding
   * @param callback callback
   */
  public _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: () => void,
  ): void {
    const combinedBuffer = Buffer.concat([this.buffer, chunk])
    const lineBuffers = this.splitBuffer(combinedBuffer, Buffer.from('\n'))
    this.buffer = lineBuffers.pop() ?? Buffer.from('')

    if (lineBuffers.length === 0) {
      callback()
      return
    }

    const lines = lineBuffers.map((buffer) => buffer.toString())
    const isFirstChunk = this.firstFlag && lines[0].startsWith('{')

    if (isFirstChunk) this.push('{\n')

    lines.forEach((line) => {
      const matchArray = line.match(/(?<=")([^"\\]|\\.)*?(?=")/g)
      if (!matchArray) return
      const [key, , value] = matchArray
      if (this.filterSet.has(+key)) {
        if (!this.firstFlag) this.push(',\n')
        this.firstFlag = false
        this.push(`"${key}":"${value.replace(/\\\\n/g, '\\n')}"`)
      }
    })

    callback()
  }

  /**
   * Flush
   * @param callback callback
   */
  public _flush(callback: () => void): void {
    this.push('\n' + this.buffer.toString())
    callback()
  }

  /**
   * Final
   * @param callback callback
   */
  public _final(callback: () => void): void {
    if (!this.buffer.toString().endsWith('}')) {
      throw new TextMapFormatError(
        this.language,
        'JSON ending with }',
        this.buffer.toString(),
      )
    }

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
