import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { FileLocation } from '@/paths/FileLocation'
import { ConcatenatedFileReader } from '@/streams/ConcatenatedFileReader'

describe('ConcatenatedFileReader', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'concat-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  function writeFile(name: string, content: string): FileLocation {
    const filePath = path.join(tmpDir, name)
    fs.writeFileSync(filePath, content, 'utf8')
    return FileLocation.fromPath(filePath)
  }

  describe('constructor', () => {
    it('should create reader with single file', () => {
      const p = writeFile('a.json', '{"1":"hello"}')
      const reader = new ConcatenatedFileReader([p])

      expect(reader.segmentCount).toBe(1)
      expect(reader.size).toBeGreaterThan(0)
    })

    it('should create reader with multiple files', () => {
      const p1 = writeFile('a_0.json', '{"1":"hello"}\n')
      const p2 = writeFile('a_1.json', '{"2":"world"}\n')
      const reader = new ConcatenatedFileReader([p1, p2])

      expect(reader.segmentCount).toBe(2)
    })

    it('should throw for non-existent file', () => {
      expect(
        () => new ConcatenatedFileReader(['/nonexistent/file.json']),
      ).toThrow()
    })
  })

  describe('read', () => {
    it('should read bytes from single file', async () => {
      const content = '{"1":"hello"}'
      const p = writeFile('a.json', content)
      const reader = new ConcatenatedFileReader([p])

      const buf = await reader.read(0, content.length)
      expect(buf.toString('utf8')).toBe(content)

      await reader.close()
    })

    it('should read bytes across file boundaries', async () => {
      const content1 = 'AAAA'
      const content2 = 'BBBB'
      const p1 = writeFile('a_0.json', content1)
      const p2 = writeFile('a_1.json', content2)
      const reader = new ConcatenatedFileReader([p1, p2])

      // Read across boundary (offset 2, length 4 = "AA" + "BB")
      const buf = await reader.read(2, 4)
      expect(buf.toString('utf8')).toBe('AABB')

      await reader.close()
    })

    it('should handle reading past end of file', async () => {
      const content = 'short'
      const p = writeFile('a.json', content)
      const reader = new ConcatenatedFileReader([p])

      const buf = await reader.read(0, 100)
      expect(buf.toString('utf8')).toBe(content)

      await reader.close()
    })
  })

  describe('readLine', () => {
    it('should read a line at offset', async () => {
      const content = '"1":"hello",\n"2":"world"\n'
      const p = writeFile('a.json', content)
      const reader = new ConcatenatedFileReader([p])

      const line = await reader.readLine(0)
      expect(line).toBe('"1":"hello",')

      await reader.close()
    })

    it('should read line at specific offset', async () => {
      const content = '"1":"hello",\n"2":"world"\n'
      const p = writeFile('a.json', content)
      const reader = new ConcatenatedFileReader([p])

      // Offset past first newline
      const firstNewline = content.indexOf('\n') + 1
      const line = await reader.readLine(firstNewline)
      expect(line).toBe('"2":"world"')

      await reader.close()
    })

    it('should handle line without trailing newline', async () => {
      const content = '"1":"hello"'
      const p = writeFile('a.json', content)
      const reader = new ConcatenatedFileReader([p])

      const line = await reader.readLine(0)
      expect(line).toBe('"1":"hello"')

      await reader.close()
    })
  })

  describe('createReadStream', () => {
    it('should stream single file content', async () => {
      const content = '{"1":"hello"}'
      const p = writeFile('a.json', content)
      const reader = new ConcatenatedFileReader([p])

      const stream = reader.createReadStream()
      const chunks: Buffer[] = []

      await new Promise<void>((resolve, reject) => {
        stream.on('data', (chunk: Buffer) => chunks.push(chunk))
        stream.on('end', resolve)
        stream.on('error', reject)
      })

      expect(Buffer.concat(chunks).toString('utf8')).toBe(content)
    })

    it('should stream multiple files in order', async () => {
      const p1 = writeFile('a_0.json', 'AAA')
      const p2 = writeFile('a_1.json', 'BBB')
      const reader = new ConcatenatedFileReader([p1, p2])

      const stream = reader.createReadStream()
      const chunks: Buffer[] = []

      await new Promise<void>((resolve, reject) => {
        stream.on('data', (chunk: Buffer) => chunks.push(chunk))
        stream.on('end', resolve)
        stream.on('error', reject)
      })

      expect(Buffer.concat(chunks).toString('utf8')).toBe('AAABBB')
    })
  })

  describe('close', () => {
    it('should close without error', async () => {
      const p = writeFile('a.json', 'test')
      const reader = new ConcatenatedFileReader([p])

      // Force open by reading
      await reader.read(0, 1)
      await reader.close()
    })

    it('should handle close without open', async () => {
      const p = writeFile('a.json', 'test')
      const reader = new ConcatenatedFileReader([p])

      // Close without ever reading (no handles opened)
      await reader.close()
    })

    it('should handle double close', async () => {
      const p = writeFile('a.json', 'test')
      const reader = new ConcatenatedFileReader([p])

      await reader.read(0, 1)
      await reader.close()
      await reader.close()
    })
  })

  describe('size', () => {
    it('should report correct total size', () => {
      const p1 = writeFile('a_0.json', 'AAAA') // 4 bytes
      const p2 = writeFile('a_1.json', 'BB') // 2 bytes
      const reader = new ConcatenatedFileReader([p1, p2])

      expect(reader.size).toBe(6)
    })
  })
})
