import type { OperationResultOk } from '@/types'

/**
 * Build ok result
 * @param data - success data (optional)
 * @param warnings - warning messages (optional)
 * @returns operation ok result
 */
export function buildOkResult<TData>(
  data?: TData,
  warnings?: readonly string[],
): OperationResultOk<TData> {
  return {
    status: 'ok',
    data,
    warnings,
  }
}
