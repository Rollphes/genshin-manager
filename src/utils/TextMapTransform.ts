import { Transform } from 'stream'

import { TextMapFormatError } from '@/errors/TextMapFormatError'
import { TextMapLanguage } from '@/types'

/**
 * TextMapTransform
 * @extends Transform
 */
export class TextMapTransform extends Transform {
  private language: keyof typeof TextMapLanguage
  private filterList: Set<number>
  private buffer: Buffer = Buffer.from('')
  private firstFlag: boolean = true

  constructor(language: keyof typeof TextMapLanguage, filterList: Set<number>) {
    super()
    this.language = language
    this.filterList = filterList
  }

  public _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: () => void,
  ) {
    const combinedBuffer = Buffer.concat([this.buffer, chunk])
    const str = combinedBuffer.toString()
    const lines = str.split('\n')
    const isFirstChunk = str.startsWith('{')

    if (isFirstChunk) this.push('{\n')

    this.buffer = Buffer.from(lines.pop() || '')

    lines.forEach((line) => {
      const matchArray = line.match(/(?<=")([^"\\]|\\.)*?(?=")/g)
      if (!matchArray) return
      const [key, , value] = matchArray
      if (this.filterList.has(+key)) {
        if (!this.firstFlag) this.push(',\n')
        this.firstFlag = false
        this.push(`"${key}":"${value.replace(/\\\\n/g, '\\n')}"`)
      }
    })

    callback()
  }

  public _flush(callback: () => void) {
    this.push('\n' + this.buffer.toString())
    callback()
  }

  public _final(callback: () => void) {
    if (!this.buffer.toString().endsWith('}'))
      throw new TextMapFormatError(this.language)

    callback()
  }
}
