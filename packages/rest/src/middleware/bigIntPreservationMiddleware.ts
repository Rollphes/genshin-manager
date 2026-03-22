import type { Middleware } from 'openapi-fetch'

/**
 * Regex pattern for large integers in JSON (16+ digits)
 * Uses lookbehind/lookahead to match integers in JSON context
 */
const largeIntPattern = /(?<=[:,[])\s*(\d{16,})(?=\s*[,\]}])/g

/**
 * Middleware that preserves large integers in JSON responses.
 *
 * JavaScript's Number type loses precision for integers exceeding
 * Number.MAX_SAFE_INTEGER (2^53 - 1). This middleware converts such
 * integers to strings before JSON parsing to preserve their exact values.
 *
 * Detects JSON content by checking if response body starts with '[' or '{'.
 */
export const bigIntPreservationMiddleware: Middleware = {
  /**
   * Transforms large integers in JSON response body to strings
   * @param context - the response context
   * @param context.response - the Response object to process
   * @returns new Response with preserved large integers
   */
  async onResponse({ response }): Promise<Response> {
    const text = await response.text()
    const trimmed = text.trimStart()

    // Only process JSON content
    if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
      return new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    }

    const preserved = text.replace(largeIntPattern, (match, num: string) => {
      if (BigInt(num) > BigInt(Number.MAX_SAFE_INTEGER))
        return match.replace(num, `"${num}"`)
      return match
    })

    return new Response(preserved, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  },
}
