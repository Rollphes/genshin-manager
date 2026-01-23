import type { KeyPath } from '@/domain/crypto/types'

/**
 * Convert key path to string for comparison
 * @param path - Key path
 * @returns string representation
 */
export function pathToString(path: KeyPath): string {
  return path.map((segment) => String(segment)).join('.')
}
