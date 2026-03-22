import type { Middleware } from 'openapi-fetch'

declare const PACKAGE_NAME: string
declare const PACKAGE_VERSION: string

/**
 * Middleware that sets the User-Agent header on all requests.
 */
export const userAgentMiddleware: Middleware = {
  /**
   * Adds User-Agent header to outgoing requests.
   * @param context - the request context containing the request object
   * @param context.request - the Request object to modify
   * @returns the modified request
   */
  onRequest({ request }): Request {
    request.headers.set('User-Agent', `${PACKAGE_NAME}/${PACKAGE_VERSION}`)
    return request
  },
}
