/**
 * File lock management utility functions
 * Prevents multiple processes from accessing the same file simultaneously
 */
const locks = new Map<string, Promise<void>>()

/**
 * Performs exclusive control on a file
 * @param filePath path to the file to lock
 * @param operation async operation to execute
 * @returns result of the operation
 */
export async function withFileLock<T>(
  filePath: string,
  operation: () => Promise<T>,
): Promise<T> {
  const existingLock = locks.get(filePath)
  if (existingLock) await existingLock

  let resolveLock: (() => void) | undefined
  const lockPromise = new Promise<void>((resolve) => {
    resolveLock = resolve
  })

  locks.set(filePath, lockPromise)

  try {
    const result = await operation()
    return result
  } finally {
    locks.delete(filePath)
    if (resolveLock) resolveLock()
  }
}

/**
 * Checks if the specified file is locked
 * @param filePath path to the file to check
 * @returns true if the file is locked
 */
export function isFileLocked(filePath: string): boolean {
  return locks.has(filePath)
}

/**
 * Clears all locks (for testing)
 */
export function clearAllFileLocks(): void {
  locks.clear()
}
