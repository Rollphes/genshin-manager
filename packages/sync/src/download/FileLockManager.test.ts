import { type Location, Location as LocationClass } from '@genshin-manager/data'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { FileLockManager } from '@/download/FileLockManager'

describe('FileLockManager', () => {
  let testDir: string
  let testDirLocation: Location
  let testFileLocation: Location
  let fileLockManager: FileLockManager

  beforeEach(() => {
    testDir = path.join(
      os.tmpdir(),
      `fileLockManagerTest-${String(Date.now())}`,
    )
    fs.mkdirSync(testDir, { recursive: true })
    testDirLocation = LocationClass.raw(testDir)
    testFileLocation = LocationClass.raw(path.join(testDir, 'test-file.txt'))
    fileLockManager = new FileLockManager()
  })

  afterEach(() => {
    fileLockManager.clearAllLocks(testDirLocation)
    if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true })
  })

  describe('withLock', () => {
    it('should execute operation and return result', async () => {
      const result = await fileLockManager.withLock(testFileLocation, () => {
        return Promise.resolve('success')
      })
      expect(result).toBe('success')
    })

    it('should create lock file', async () => {
      await fileLockManager.withLock(testFileLocation, () => {
        const lockFilePath = `${testFileLocation.resolve()}.lock`
        expect(fs.existsSync(lockFilePath)).toBe(true)
        return Promise.resolve()
      })
    })

    it('should release lock after operation completes', async () => {
      await fileLockManager.withLock(testFileLocation, () => {
        return Promise.resolve('done')
      })
      const locked = await fileLockManager.isLocked(testFileLocation)
      expect(locked).toBe(false)
    })

    it('should release lock even if operation throws', async () => {
      try {
        await fileLockManager.withLock(testFileLocation, () => {
          return Promise.reject(new Error('Operation failed'))
        })
      } catch {
        // Expected error
      }
      const locked = await fileLockManager.isLocked(testFileLocation)
      expect(locked).toBe(false)
    })
  })

  describe('isLocked', () => {
    it('should return false when lock file does not exist', async () => {
      const result = await fileLockManager.isLocked(testFileLocation)
      expect(result).toBe(false)
    })

    it('should return false when file is not locked', async () => {
      // Create empty lock file without actually locking
      const lockFilePath = `${testFileLocation.resolve()}.lock`
      fs.writeFileSync(lockFilePath, '')
      const result = await fileLockManager.isLocked(testFileLocation)
      expect(result).toBe(false)
    })
  })

  describe('clearAllLocks', () => {
    it('should remove all lock files in directory', () => {
      const lockFile1 = path.join(testDir, 'file1.lock')
      const lockFile2 = path.join(testDir, 'file2.lock')
      fs.writeFileSync(lockFile1, '')
      fs.writeFileSync(lockFile2, '')

      fileLockManager.clearAllLocks(testDirLocation)

      expect(fs.existsSync(lockFile1)).toBe(false)
      expect(fs.existsSync(lockFile2)).toBe(false)
    })

    it('should not remove non-lock files', () => {
      const normalFile = path.join(testDir, 'normal.txt')
      const lockFile = path.join(testDir, 'test.lock')
      fs.writeFileSync(normalFile, 'content')
      fs.writeFileSync(lockFile, '')

      fileLockManager.clearAllLocks(testDirLocation)

      expect(fs.existsSync(normalFile)).toBe(true)
      expect(fs.existsSync(lockFile)).toBe(false)
    })

    it('should handle non-existent directory', () => {
      const nonExistentLocation = LocationClass.raw(
        path.join(testDir, 'non-existent'),
      )
      expect(() => {
        fileLockManager.clearAllLocks(nonExistentLocation)
      }).not.toThrow()
    })

    it('should remove lock files in subdirectories', () => {
      const subDir = path.join(testDir, 'subdir')
      fs.mkdirSync(subDir, { recursive: true })
      const lockFile = path.join(subDir, 'file.lock')
      fs.writeFileSync(lockFile, '')

      fileLockManager.clearAllLocks(testDirLocation)

      expect(fs.existsSync(lockFile)).toBe(false)
    })
  })
})
