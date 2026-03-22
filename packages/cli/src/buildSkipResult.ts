import type { OperationResultSkip } from '@/types'

/**
 * Build skip result
 * @param reason - reason for skipping
 * @returns operation skip result
 */
export function buildSkipResult(reason: string): OperationResultSkip {
  return {
    status: 'skip',
    reason,
  }
}
