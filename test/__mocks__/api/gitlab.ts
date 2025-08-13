import fs from 'fs'
import path from 'path'
import { vi } from 'vitest'

// Cache directory paths
const CACHE_DIR = path.resolve(process.cwd(), 'cache')
const TEST_COMMIT_FILE_PATH = path.resolve(CACHE_DIR, 'commits_test_temp.json')

// Store original functions for real operations when needed
const originalFetch = global.fetch
const originalCreateWriteStream = fs.createWriteStream
const originalReadFileSync = fs.readFileSync
const originalExistsSync = fs.existsSync

interface ReadFileSyncOption {
  encoding?: null | undefined
  flag?: string | undefined
}

/**
 * Setup GitLab API mock server using cached commit data
 */
export function setupGitLabMock(): void {
  // Mock fs.createWriteStream to redirect commits.json writes to test temp file
  vi.mocked(fs).createWriteStream = vi
    .fn()
    .mockImplementation((filePath: string, options: BufferEncoding) => {
      // If writing to commits.json, redirect to test temp file to avoid conflicts
      if (filePath.endsWith('commits.json'))
        return originalCreateWriteStream(TEST_COMMIT_FILE_PATH, options)

      // For all other files, use original behavior
      return originalCreateWriteStream(filePath, options)
    })

  // Mock fs.readFileSync to redirect commits.json reads to test temp file
  vi.mocked(fs).readFileSync = vi
    .fn()
    .mockImplementation(
      (
        filePath: fs.PathOrFileDescriptor,
        options?: ReadFileSyncOption | null,
      ) => {
        // If reading commits.json, redirect to test temp file to avoid conflicts
        if (typeof filePath === 'string' && filePath.endsWith('commits.json')) {
          // Ensure the test temp file exists before reading
          if (!originalExistsSync(TEST_COMMIT_FILE_PATH)) {
            console.warn('⚠️ Test commits file not found, creating empty array')
            return JSON.stringify([])
          }
          return originalReadFileSync(TEST_COMMIT_FILE_PATH, options)
        }

        // For all other files, use original behavior
        return originalReadFileSync(filePath, options)
      },
    )

  // Mock fs.existsSync to redirect commits.json checks to test temp file
  vi.mocked(fs).existsSync = vi
    .fn()
    .mockImplementation((filePath: fs.PathLike) => {
      // If checking commits.json, redirect to test temp file to avoid conflicts
      if (typeof filePath === 'string' && filePath.endsWith('commits.json'))
        return originalExistsSync(TEST_COMMIT_FILE_PATH)

      // For all other files, use original behavior
      return originalExistsSync(filePath)
    })
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
