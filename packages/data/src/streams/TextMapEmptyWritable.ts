import { Writable } from 'stream'

import { splitBuffer } from '@/streams/splitBuffer'

/**
 * TextMap entry emitted from TextMapEmptyWritable
 */
export interface TextMapEntry {
  /** TextMap hash ID as string */
  readonly textMapHash: string
  /** Localized text value */
  readonly textValue: string
}

/**
 * Writable stream that parses TextMap JSON lines and emits textMapHash-textValue pairs
 */
export class TextMapEmptyWritable extends Writable {
  private buffer: Buffer = Buffer.from('')

  /**
   * Processes incoming buffer chunks and emits parsed key-value pairs
   * @param chunk - Buffer chunk to process
   * @param _encoding - Buffer encoding (unused)
   * @param callback - Callback to signal completion
   * @internal
   */
  public _write(
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

    for (const line of lines) {
      const matchArray = line.match(/(?<=")([^"\\]|\\.)*?(?=")/g)
      if (!matchArray || matchArray.length < 3) continue

      const [textMapHash, , textValue] = matchArray

      const entry: TextMapEntry = {
        textMapHash,
        textValue: textValue.replace(/\\n/g, '\n'),
      }
      this.emit('data', entry)
    }

    callback()
  }
}
