import type { OperationResultError } from '@/types'

/**
 * Build error result from unknown error
 * @param error - error of any type
 * @returns operation error result
 */
export function buildErrorResult(error: unknown): OperationResultError {
  return {
    status: 'error',
    error: error instanceof Error ? error : new Error(String(error)),
  }
}
