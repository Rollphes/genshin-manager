import { type Location } from '@genshin-manager/data'
import fs from 'fs'
import path from 'path'
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
   * @param location - Location of the file to lock
   * @param operation - async operation to execute
   * @returns result of the operation
   */
  public async withLock<T>(
    location: Location,
    operation: () => Promise<T>,
  ): Promise<T> {
    const resolvedPath = location.resolve()
    this.ensureLockDirectory(resolvedPath)

    const release = await lock(resolvedPath, this.lockOptions)

    try {
      const result = await operation()
      return result
    } finally {
      await release()
    }
  }

  /**
   * Checks if the specified file is locked
   * @param location - Location of the file to check
   * @returns true if the file is locked
   */
  public async isLocked(location: Location): Promise<boolean> {
    const resolvedPath = location.resolve()
    this.ensureLockDirectory(resolvedPath)

    if (!fs.existsSync(resolvedPath)) return false

    return await check(resolvedPath, this.lockOptions)
  }

  /**
   * Clears all locks in a directory (for testing)
   * @param location - Location of directory to clear locks from
   */
  public clearAllLocks(location: Location): void {
    const resolvedPath = location.resolve()
    if (!fs.existsSync(resolvedPath)) return

    const files = fs.readdirSync(resolvedPath, { recursive: true })
    for (const file of files) {
      const lockFilePath = path.join(resolvedPath, String(file))
      if (lockFilePath.endsWith('.lock') && fs.existsSync(lockFilePath))
        fs.unlinkSync(lockFilePath)
    }
  }

  /**
   * Ensures the lock directory exists
   * @param resolvedPath - resolved path to the file to lock
   * @returns lock directory path
   */
  private ensureLockDirectory(resolvedPath: string): string {
    const lockDir = path.dirname(resolvedPath)
    if (!fs.existsSync(lockDir)) fs.mkdirSync(lockDir, { recursive: true })
    return lockDir
  }
}
