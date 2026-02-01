import type { FileLocation } from '@genshin-manager/data'
import fs from 'fs'
import { check, lock, type LockOptions } from 'proper-lockfile'

/**
 * File lock manager for controlling concurrent file access
 */
export class FileLockManager {
  private readonly lockOptions: LockOptions

  /**
   * Creates a new FileLockManager instance
   * @param options - Lock options configuration
   */
  constructor(options?: Partial<LockOptions>) {
    this.lockOptions = {
      stale: 30000, // 30 seconds
      realpath: false, // Allow locking files that don't exist yet
      retries: {
        retries: 10,
        minTimeout: 100,
        maxTimeout: 1000,
      },
      ...options,
    }
  }

  /**
   * Performs exclusive control on a file using filesystem-based locks
   * @param location - FileLocation of the file to lock
   * @param operation - async operation to execute
   * @returns result of the operation
   */
  public async withLock<T>(
    location: FileLocation,
    operation: () => Promise<T>,
  ): Promise<T> {
    const filePath = location.resolve()
    this.ensureLockDirectory(location)

    const release = await lock(filePath, this.lockOptions)

    try {
      const result = await operation()
      return result
    } finally {
      await release()
    }
  }

  /**
   * Checks if the specified file is locked
   * @param location - FileLocation of the file to check
   * @returns true if the file is locked
   */
  public async isLocked(location: FileLocation): Promise<boolean> {
    const filePath = location.resolve()
    this.ensureLockDirectory(location)

    if (!fs.existsSync(filePath)) return false

    return await check(filePath, this.lockOptions)
  }

  /**
   * Clears all locks in a directory (for testing)
   * @param location - FileLocation of directory to clear locks from
   */
  public clearAllLocks(location: FileLocation): void {
    const dirPath = location.resolve()
    if (!fs.existsSync(dirPath)) return

    const files = fs.readdirSync(dirPath, { recursive: true })
    for (const file of files) {
      const lockFileLocation = location.child(String(file))
      const lockFilePath = lockFileLocation.resolve()
      if (lockFilePath.endsWith('.lock') && fs.existsSync(lockFilePath))
        fs.unlinkSync(lockFilePath)
    }
  }

  /**
   * Ensures the lock directory exists
   * @param location - FileLocation of the file to lock
   */
  private ensureLockDirectory(location: FileLocation): void {
    const lockDir = location.parent().resolve()
    if (!fs.existsSync(lockDir)) fs.mkdirSync(lockDir, { recursive: true })
  }
}
