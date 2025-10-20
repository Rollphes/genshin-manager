/**
 * File lock management utility functions
 * Prevents multiple processes from accessing the same file simultaneously using filesystem-based locks
 */
import fs from 'fs'
import * as path from 'path'
import { check, lock, type LockOptions } from 'proper-lockfile'

const lockOptions: LockOptions = {
  stale: 30000, // 30 seconds
  retries: {
    retries: 10,
    minTimeout: 100,
    maxTimeout: 1000,
  },
}

/**
 * Ensures the lock directory exists
 * @param filePath path to the file to lock
 * @returns lock directory path
 */
function ensureLockDirectory(filePath: string): string {
  const lockDir = path.dirname(filePath)
  if (!fs.existsSync(lockDir)) fs.mkdirSync(lockDir, { recursive: true })
  return lockDir
}

/**
 * Performs exclusive control on a file using filesystem-based locks
 * @param filePath path to the file to lock
 * @param operation async operation to execute
 * @returns result of the operation
 */
export async function withFileLock<T>(
  filePath: string,
  operation: () => Promise<T>,
): Promise<T> {
  ensureLockDirectory(filePath)

  const lockFilePath = `${filePath}.lock`
  if (!fs.existsSync(lockFilePath)) fs.writeFileSync(lockFilePath, '')

  const release = await lock(lockFilePath, lockOptions)

  try {
    const result = await operation()
    return result
  } finally {
    await release()
  }
}

/**
 * Checks if the specified file is locked
 * @param filePath path to the file to check
 * @returns true if the file is locked
 */
export async function isFileLocked(filePath: string): Promise<boolean> {
  ensureLockDirectory(filePath)

  const lockFilePath = `${filePath}.lock`
  if (!fs.existsSync(lockFilePath)) return false

  return await check(lockFilePath, lockOptions)
}

/**
 * Clears all locks (for testing)
 * @param directoryPath directory path to clear locks from
 */
export function clearAllFileLocks(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) return

  const files = fs.readdirSync(directoryPath, { recursive: true })
  for (const file of files) {
    const filePath = path.join(directoryPath, file as string)
    if (filePath.endsWith('.lock') && fs.existsSync(filePath))
      fs.unlinkSync(filePath)
  }
}
