import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { FileLockManager } from '@/adapter/input/download/FileLockManager'

describe('FileLockManager', () => {
  let testDir: string
  let testFilePath: string
  let fileLockManager: FileLockManager

  beforeEach(() => {
    testDir = path.join(
      os.tmpdir(),
      `fileLockManagerTest-${String(Date.now())}`,
    )
    fs.mkdirSync(testDir, { recursive: true })
    testFilePath = path.join(testDir, 'test-file.txt')
    fileLockManager = new FileLockManager()
  })

  afterEach(() => {
    fileLockManager.clearAllLocks(testDir)
    if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true })
  })

  describe('withLock', () => {
    it('should execute operation and return result', async () => {
      const result = await fileLockManager.withLock(testFilePath, () => {
        return Promise.resolve('success')
      })
      expect(result).toBe('success')
    })

    it('should create lock file', async () => {
      await fileLockManager.withLock(testFilePath, () => {
        const lockFilePath = `${testFilePath}.lock`
        expect(fs.existsSync(lockFilePath)).toBe(true)
        return Promise.resolve()
      })
    })

    it('should release lock after operation completes', async () => {
      await fileLockManager.withLock(testFilePath, () => {
        return Promise.resolve('done')
      })
      const locked = await fileLockManager.isLocked(testFilePath)
      expect(locked).toBe(false)
    })

    it('should release lock even if operation throws', async () => {
      try {
        await fileLockManager.withLock(testFilePath, () => {
          return Promise.reject(new Error('Operation failed'))
        })
      } catch {
        // Expected error
      }
      const locked = await fileLockManager.isLocked(testFilePath)
      expect(locked).toBe(false)
    })
  })

  describe('isLocked', () => {
    it('should return false when lock file does not exist', async () => {
      const result = await fileLockManager.isLocked(testFilePath)
      expect(result).toBe(false)
    })

    it('should return false when file is not locked', async () => {
      // Create empty lock file without actually locking
      const lockFilePath = `${testFilePath}.lock`
      fs.writeFileSync(lockFilePath, '')
      const result = await fileLockManager.isLocked(testFilePath)
      expect(result).toBe(false)
    })
  })

  describe('clearAllLocks', () => {
    it('should remove all lock files in directory', () => {
      const lockFile1 = path.join(testDir, 'file1.lock')
      const lockFile2 = path.join(testDir, 'file2.lock')
      fs.writeFileSync(lockFile1, '')
      fs.writeFileSync(lockFile2, '')

      fileLockManager.clearAllLocks(testDir)

      expect(fs.existsSync(lockFile1)).toBe(false)
      expect(fs.existsSync(lockFile2)).toBe(false)
    })

    it('should not remove non-lock files', () => {
      const normalFile = path.join(testDir, 'normal.txt')
      const lockFile = path.join(testDir, 'test.lock')
      fs.writeFileSync(normalFile, 'content')
      fs.writeFileSync(lockFile, '')

      fileLockManager.clearAllLocks(testDir)

      expect(fs.existsSync(normalFile)).toBe(true)
      expect(fs.existsSync(lockFile)).toBe(false)
    })

    it('should handle non-existent directory', () => {
      const nonExistentDir = path.join(testDir, 'non-existent')
      expect(() => {
        fileLockManager.clearAllLocks(nonExistentDir)
      }).not.toThrow()
    })

    it('should remove lock files in subdirectories', () => {
      const subDir = path.join(testDir, 'subdir')
      fs.mkdirSync(subDir, { recursive: true })
      const lockFile = path.join(subDir, 'file.lock')
      fs.writeFileSync(lockFile, '')

      fileLockManager.clearAllLocks(testDir)

      expect(fs.existsSync(lockFile)).toBe(false)
    })
  })
})
