import type { Language } from '@genshin-manager/core'
import { Transform } from 'stream'

import { TextMapFormatError } from '@/errors/TextMapFormatError'
import { FileLocation } from '@/paths/FileLocation'
import { splitBuffer } from '@/streams/splitBuffer'

/**
 * Transform stream that filters and reformats TextMap JSON by text map hashes
 */
export class TextMapTransform extends Transform {
  private readonly language: Language
  private readonly filterSet: ReadonlySet<number>
  private readonly location: FileLocation
  private buffer: Buffer = Buffer.from('')
  private firstFlag = true

  /**
   * Constructor for TextMapTransform
   * @param language - Target language for error reporting
   * @param filterSet - Set of text hashes to include in output
   * @param fileName - Optional file name for error reporting
   */
  constructor(
    language: Language,
    filterSet: ReadonlySet<number>,
    fileName?: string,
  ) {
    super()
    this.language = language
    this.filterSet = filterSet
    this.location = FileLocation.textMap(language, fileName)
  }

  /**
   * Transforms incoming buffer chunks by filtering and reformatting JSON entries
   * @param chunk - Buffer chunk to process
   * @param _encoding - Buffer encoding (unused)
   * @param callback - Callback to signal completion
   * @internal
   */
  public _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: () => void,
  ): void {
    const combinedBuffer = Buffer.concat([this.buffer, chunk])
    const lineBuffers = splitBuffer(combinedBuffer, Buffer.from('\n'))
    this.buffer = lineBuffers.pop() ?? Buffer.from('')

    if (lineBuffers.length === 0) {
      callback()
      return
    }

    const lines = lineBuffers.map((buffer) => buffer.toString())
    const isFirstChunk = this.firstFlag && lines[0]?.startsWith('{')

    if (isFirstChunk) this.push('{\n')

    for (const line of lines) {
      const matchArray = line.match(/(?<=")([^"\\]|\\.)*?(?=")/g)
      if (!matchArray || matchArray.length < 3) continue

      const [textMapHash, , textValue] = matchArray

      if (this.filterSet.has(+textMapHash)) {
        if (!this.firstFlag) this.push(',\n')
        this.firstFlag = false
        this.push(`"${textMapHash}":"${textValue.replace(/\\\\n/g, '\\n')}"`)
      }
    }

    callback()
  }

  /**
   * Flushes remaining buffer content to output
   * @param callback - Callback to signal completion
   * @internal
   */
  public _flush(callback: () => void): void {
    this.push('\n' + this.buffer.toString())
    callback()
  }

  /**
   * Validates the final buffer content ends with closing brace
   * @param callback - Callback to signal completion or error
   * @throws {@link TextMapFormatError} - When JSON does not end with closing brace
   * @internal
   */
  public _final(callback: (error?: Error) => void): void {
    if (!this.buffer.toString().endsWith('}')) {
      callback(
        new TextMapFormatError(
          this.language,
          this.location,
          `JSON does not end with closing brace: "${this.buffer.toString().slice(-50)}"`,
        ),
      )
      return
    }

    callback()
  }
}
