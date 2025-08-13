/**
 * Creates error response for API testing
 * @param retcode - Error code
 * @param message - Error message
 * @returns Mock error response
 */
export function createErrorResponse(
  retcode = -1,
  message = 'API Error',
): { retcode: number; message: string; data: null } {
  return {
    retcode,
    message,
    data: null,
  }
}
