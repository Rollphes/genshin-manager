import { Language } from '@genshin-manager/core'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TextMapIndex } from '@/cache/TextMapIndex'

vi.mock('@genshin-manager/core', async () => {
  const actual = await vi.importActual('@genshin-manager/core')
  return {
    ...(actual as Record<string, unknown>),
    logger: { debug: vi.fn(), warn: vi.fn() },
  }
})

describe('TextMapIndex', () => {
  let tmpDir: string
  let textMapDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'textmap-test-'))
    textMapDir = path.join(tmpDir, 'TextMap')
    fs.mkdirSync(textMapDir)
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  function writeTextMapFile(
    name: string,
    entries: Record<string, string>,
  ): void {
    const lines = ['{']
    const keys = Object.keys(entries)
    for (let i = 0; i < keys.length; i++) {
      const comma = i < keys.length - 1 ? ',' : ''
      lines.push(`"${keys[i]}":"${entries[keys[i]]}"${comma}`)
    }
    lines.push('}')
    fs.writeFileSync(path.join(textMapDir, name), lines.join('\n'), 'utf8')
  }

  describe('buildIndex', () => {
    it('should build index for a language', async () => {
      writeTextMapFile('TextMapEN.json', {
        '100': 'Hello',
        '200': 'World',
        '300': 'Test',
      })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      expect(index.languageCount).toBe(1)
      expect(index.currentLanguage).toBe(Language.En)
    })

    it('should handle missing files gracefully', async () => {
      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      expect(index.languageCount).toBe(0)
    })

    it('should build indexes for multiple languages', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })
      writeTextMapFile('TextMapJP.json', { '100': 'Konnichiwa' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      await index.buildIndex(Language.Ja)
      expect(index.languageCount).toBe(2)
    })

    it('should rebuild index for same language', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      // Rebuild should close old reader and create new one
      await index.buildIndex(Language.En)
      expect(index.languageCount).toBe(1)
    })
  })

  describe('getText', () => {
    it('should retrieve text by hash', async () => {
      writeTextMapFile('TextMapEN.json', {
        '100': 'Hello',
        '200': 'World',
      })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      const text = await index.getText(100)
      expect(text).toBe('Hello')
    })

    it('should return undefined for non-existent hash', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      const text = await index.getText(999)
      expect(text).toBeUndefined()
      await index.close()
    })

    it('should use LRU cache on second access', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)

      const text1 = await index.getText(100)
      const text2 = await index.getText(100) // Should hit cache
      expect(text1).toBe('Hello')
      expect(text2).toBe('Hello')
      await index.close()
    })

    it('should get text in specific language', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })
      writeTextMapFile('TextMapJP.json', { '100': 'Konnichiwa' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      await index.buildIndex(Language.Ja)

      const en = await index.getText(100, Language.En)
      const ja = await index.getText(100, Language.Ja)
      expect(en).toBe('Hello')
      expect(ja).toBe('Konnichiwa')
      await index.close()
    })

    it('should return undefined when no language loaded', async () => {
      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      const text = await index.getText(100)
      expect(text).toBeUndefined()
    })
  })

  describe('getTextRequired', () => {
    it('should return text when found', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      const text = await index.getTextRequired(100)
      expect(text).toBe('Hello')
    })

    it('should throw when hash not found', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      await expect(index.getTextRequired(999)).rejects.toThrow()
    })
  })

  describe('has', () => {
    it('should return true for existing hash', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      expect(index.has(100)).toBe(true)
    })

    it('should return false for non-existent hash', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      expect(index.has(999)).toBe(false)
    })

    it('should return false when no language loaded', () => {
      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      expect(index.has(100)).toBe(false)
    })
  })

  describe('batchLoad', () => {
    it('should batch load multiple hashes', async () => {
      writeTextMapFile('TextMapEN.json', {
        '100': 'Hello',
        '200': 'World',
        '300': 'Test',
      })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      await index.batchLoad(new Set([100, 200, 300]))

      // All should be in LRU cache now
      const t1 = await index.getText(100)
      const t2 = await index.getText(200)
      const t3 = await index.getText(300)
      expect(t1).toBe('Hello')
      expect(t2).toBe('World')
      expect(t3).toBe('Test')
    })

    it('should skip already cached hashes', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)

      // Pre-load into cache
      await index.getText(100)

      // Should not re-read from file
      await index.batchLoad(new Set([100]))
      expect(await index.getText(100)).toBe('Hello')
    })

    it('should handle empty hash set', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      await index.batchLoad(new Set())
    })
  })

  describe('split files', () => {
    it('should handle split TextMap files', async () => {
      // Simulate split files
      const lines0 = ['{\n"100":"Hello",\n"200":"World"\n}']
      const lines1 = ['{\n"300":"Test",\n"400":"More"\n}']

      fs.writeFileSync(
        path.join(textMapDir, 'TextMapEN.json'),
        lines0.join(''),
        'utf8',
      )
      fs.writeFileSync(
        path.join(textMapDir, 'TextMapEN_0.json'),
        lines1.join(''),
        'utf8',
      )

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      expect(index.has(100)).toBe(true)
      expect(index.has(300)).toBe(true)
    })
  })

  describe('close', () => {
    it('should close all file handles', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      await index.close()

      expect(index.languageCount).toBe(0)
      expect(index.currentLanguage).toBeUndefined()
    })
  })

  describe('clearTextCache', () => {
    it('should clear text cache but keep indexes', async () => {
      writeTextMapFile('TextMapEN.json', { '100': 'Hello' })

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      await index.getText(100) // Cache it
      index.clearTextCache()

      // Index should still work
      expect(index.has(100)).toBe(true)

      // But text needs re-reading
      const text = await index.getText(100)
      expect(text).toBe('Hello')

      await index.close()
    })
  })

  describe('escape handling', () => {
    it('should handle escaped characters in text', async () => {
      // Write manually to control escaping
      const content = '{\n"100":"Hello\\nWorld"\n}'
      fs.writeFileSync(path.join(textMapDir, 'TextMapEN.json'), content, 'utf8')

      const index = new TextMapIndex({
        folderPath: textMapDir,
        autoFix: false,
      })

      await index.buildIndex(Language.En)
      const text = await index.getText(100)
      expect(text).toBe('Hello\nWorld')

      await index.close()
    })
  })
})
