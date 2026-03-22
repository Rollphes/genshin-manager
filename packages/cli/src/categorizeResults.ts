import type {
  OperationResult,
  OperationResultError,
  OperationResultOk,
  OperationResultSkip,
} from '@/types'

/**
 * Categorize results by status
 * @param results - array of operation results
 * @returns categorized results
 */
export function categorizeResults<TData>(
  results: readonly OperationResult<TData>[],
): {
  okResults: readonly OperationResultOk<TData>[]
  skipResults: readonly OperationResultSkip[]
  errorResults: readonly OperationResultError[]
} {
  return {
    okResults: results.filter(
      (r): r is OperationResultOk<TData> => r.status === 'ok',
    ),
    skipResults: results.filter(
      (r): r is OperationResultSkip => r.status === 'skip',
    ),
    errorResults: results.filter(
      (r): r is OperationResultError => r.status === 'error',
    ),
  }
}
