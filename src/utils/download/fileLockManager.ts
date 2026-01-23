/**
 * File lock management utility functions
 * Prevents multiple processes from accessing the same file simultaneously using filesystem-based locks
 */
import fs from 'fs'
import * as path from 'path'
import { check, lock, type LockOptions } from 'proper-lockfile'

const lockOptions: LockOptions = {
  stale: 30000, // 30 seconds
  realpath: false, // Allow locking files that don't exist yet
  retries: {
    retries: 10,
    minTimeout: 100,
    maxTimeout: 1000,
  },
}

/**
 * Ensures the lock directory exists
 * @param storageFilePath - path to the file to lock
 * @returns lock directory path
 */
function ensureLockDirectory(storageFilePath: string): string {
  const lockDir = path.dirname(storageFilePath)
  if (!fs.existsSync(lockDir)) fs.mkdirSync(lockDir, { recursive: true })
  return lockDir
}

/**
 * Performs exclusive control on a file using filesystem-based locks
 * @param storageFilePath - path to the file to lock
 * @param operation - async operation to execute
 * @returns result of the operation
 */
export async function withFileLock<T>(
  storageFilePath: string,
  operation: () => Promise<T>,
): Promise<T> {
  ensureLockDirectory(storageFilePath)

  const release = await lock(storageFilePath, lockOptions)

  try {
    const result = await operation()
    return result
  } finally {
    await release()
  }
}

/**
 * Checks if the specified file is locked
 * @param storageFilePath - path to the file to check
 * @returns true if the file is locked
 */
export async function isFileLocked(storageFilePath: string): Promise<boolean> {
  ensureLockDirectory(storageFilePath)

  if (!fs.existsSync(storageFilePath)) return false

  return await check(storageFilePath, lockOptions)
}

/**
 * Clears all locks (for testing)
 * @param storageDirectoryPath - directory path to clear locks from
 */
export function clearAllFileLocks(storageDirectoryPath: string): void {
  if (!fs.existsSync(storageDirectoryPath)) return

  const files = fs.readdirSync(storageDirectoryPath, { recursive: true })
  for (const file of files) {
    const filePath = path.join(storageDirectoryPath, file as string)
    if (filePath.endsWith('.lock') && fs.existsSync(filePath))
      fs.unlinkSync(filePath)
  }
}
