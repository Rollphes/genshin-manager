import fs from 'fs'
import path from 'path'
import { vi } from 'vitest'

// Cache directory paths
const CACHE_DIR = path.resolve(process.cwd(), 'cache')
const TEST_COMMIT_FILE_PATH = path.resolve(CACHE_DIR, 'commits_test_temp.json')

// Store original functions for real operations when needed
const originalFetch = global.fetch

/**
 * Setup GitLab API mock server using cached commit data
 */
export function setupGitLabMock(): void {
  // Setup GitLab API mock using cached data
  global.fetch = vi
    .fn()
    .mockImplementation(
      async (url: RequestInfo | URL, options?: RequestInit) => {
        let urlString: string
        if (typeof url === 'string') urlString = url
        else if (url instanceof URL) urlString = url.href
        else if ('url' in url) urlString = url.url
        else urlString = ''

        // Mock GitLab API responses using cached data
        if (
          urlString.includes('gitlab.com/api/v4') ||
          urlString.includes('gitlab')
        ) {
          // Return the cached commits data directly as stream-compatible response
          const responseText = fs.readFileSync(TEST_COMMIT_FILE_PATH, 'utf8')

          // Create a proper ReadableStream for pipeline compatibility
          const stream = new ReadableStream({
            start(controller: ReadableStreamDefaultController): void {
              controller.enqueue(new TextEncoder().encode(responseText))
              controller.close()
            },
          })

          return new Response(stream, {
            status: 200,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json',
            },
          })
        }

        // For all other URLs (EnkaManager APIs), pass through to original fetch
        return originalFetch(url, options)
      },
    )

  console.log('🔧 GitLab mock server created using cached data')
}

export { originalFetch }
