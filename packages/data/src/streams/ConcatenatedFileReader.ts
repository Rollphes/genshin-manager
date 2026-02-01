import { GeneralError } from '@genshin-manager/core'
import fs from 'fs'
import { Readable } from 'stream'

import type { Location } from '@/paths/Location'

/**
 * File segment metadata for concatenated reading
 */
interface FileSegment {
  /** Location for this segment */
  readonly location: Location
  /** Resolved absolute file path */
  readonly resolvedPath: string
  /** Size of this segment in bytes */
  readonly size: number
  /** Cumulative start offset in the logical file */
  readonly baseOffset: number
}

/**
 * Reads multiple split files as a single logical file
 *
 * Handles TextMap split files like TextMapRU_0.json, TextMapRU_1.json
 * providing unified byte offsets across all segments.
 */
export class ConcatenatedFileReader {
  private readonly segments: readonly FileSegment[]
  private readonly totalSize: number
  private fileHandles: Map<string, fs.promises.FileHandle> | undefined

  /**
   * Create a ConcatenatedFileReader
   * @param locations - Ordered array of Locations to concatenate
   * @throws {@link GeneralError} - If any file does not exist
   */
  constructor(locations: readonly Location[]) {
    let offset = 0
    const segments: FileSegment[] = []

    for (const location of locations) {
      const resolvedPath = location.resolve()
      if (!fs.existsSync(resolvedPath))
        throw new GeneralError(`File not found: ${resolvedPath}`)

      const stats = fs.statSync(resolvedPath)
      segments.push({
        location,
        resolvedPath,
        size: stats.size,
        baseOffset: offset,
      })
      offset += stats.size
    }

    this.segments = segments
    this.totalSize = offset
  }

  /**
   * Total size of all files combined in bytes
   */
  public get size(): number {
    return this.totalSize
  }

  /**
   * Number of file segments
   */
  public get segmentCount(): number {
    return this.segments.length
  }

  /**
   * Read bytes at a logical offset across all segments
   * @param offset - Byte offset in the logical concatenated file
   * @param length - Number of bytes to read
   * @returns Buffer with read data
   */
  public async read(offset: number, length: number): Promise<Buffer> {
    await this.ensureOpen()

    const result = Buffer.alloc(length)
    let bytesRead = 0
    let remaining = length
    let currentOffset = offset

    for (const segment of this.segments) {
      const segmentEnd = segment.baseOffset + segment.size
      if (currentOffset >= segmentEnd) continue
      if (remaining <= 0) break

      const localOffset = currentOffset - segment.baseOffset
      const readLength = Math.min(remaining, segment.size - localOffset)

      const handle = this.fileHandles?.get(segment.resolvedPath)
      if (!handle) continue

      const { bytesRead: n } = await handle.read(
        result,
        bytesRead,
        readLength,
        localOffset,
      )
      bytesRead += n
      remaining -= n
      currentOffset += n
    }

    return bytesRead < length ? result.subarray(0, bytesRead) : result
  }

  /**
   * Read a line starting at the given offset
   * Reads until newline character or end of file
   * @param offset - Byte offset to start reading from
   * @returns The line content as string (without newline)
   */
  public async readLine(offset: number): Promise<string> {
    const chunkSize = 4096
    let currentOffset = offset
    const chunks: Buffer[] = []

    while (currentOffset < this.totalSize) {
      const readLen = Math.min(chunkSize, this.totalSize - currentOffset)
      const chunk = await this.read(currentOffset, readLen)

      const newlineIdx = chunk.indexOf(0x0a) // '\n'
      if (newlineIdx >= 0) {
        chunks.push(chunk.subarray(0, newlineIdx))
        break
      }

      chunks.push(chunk)
      currentOffset += chunk.length

      if (chunk.length < readLen) break
    }

    return Buffer.concat(chunks).toString('utf8')
  }

  /**
   * Create a readable stream over all segments
   * @returns Readable stream
   */
  /**
   * Read all segment files synchronously and return concatenated content as string
   * @returns Concatenated file content
   */
  public readAllSync(): string {
    const buffers: Buffer[] = []
    for (const segment of this.segments)
      buffers.push(fs.readFileSync(segment.resolvedPath))

    return Buffer.concat(buffers).toString('utf8')
  }

  /**
   * Creates a readable stream that concatenates all segment files
   * @returns Readable stream of all files concatenated
   */
  public createReadStream(): Readable {
    const segments = this.segments
    let segmentIdx = 0
    let currentStream: fs.ReadStream | undefined

    const output = new Readable({
      read(): void {
        // Managed externally via pipe
      },
    })

    function pipeNext(): void {
      if (segmentIdx >= segments.length) {
        output.push(null)
        return
      }

      currentStream = fs.createReadStream(segments[segmentIdx].resolvedPath)
      segmentIdx++

      currentStream.on('data', (chunk: Buffer | string) => {
        if (!output.push(chunk)) {
          currentStream?.pause()
          output.once('drain', () => {
            currentStream?.resume()
          })
        }
      })
      currentStream.on('end', () => {
        pipeNext()
      })
      currentStream.on('error', (err) => {
        output.destroy(err)
      })
    }

    pipeNext()
    return output
  }

  /**
   * Close all open file handles
   */
  public async close(): Promise<void> {
    if (!this.fileHandles) return

    for (const handle of this.fileHandles.values()) await handle.close()

    this.fileHandles = undefined
  }

  /**
   * Open file handles for random access reads
   */
  private async ensureOpen(): Promise<void> {
    if (this.fileHandles) return

    this.fileHandles = new Map()
    for (const segment of this.segments) {
      const handle = await fs.promises.open(segment.resolvedPath, 'r')
      this.fileHandles.set(segment.resolvedPath, handle)
    }
  }
}
