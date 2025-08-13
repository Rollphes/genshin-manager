import fs from 'fs'
import path from 'path'
import { vi } from 'vitest'

interface GitLabCommit {
  id: string
  title: string
  web_url: string
  created_at: string
}

// Cache directory paths
const CACHE_DIR = path.resolve(process.cwd(), 'cache')
const COMMIT_FILE_PATH = path.resolve(CACHE_DIR, 'commits.json')

// Store original fetch for real API calls when needed
const originalFetch = global.fetch

/**
 * Setup GitLab API mock server using cached commit data
 */
export function setupGitLabMock(): void {
  // Read the commits.json file that was created by Client.deploy()
  let cachedCommits: GitLabCommit[] = []
  if (fs.existsSync(COMMIT_FILE_PATH)) {
    try {
      const fileContent = fs.readFileSync(COMMIT_FILE_PATH, 'utf8')
      if (fileContent.trim())
        cachedCommits = JSON.parse(fileContent) as GitLabCommit[]
    } catch (error) {
      console.warn(
        '⚠️ Could not read cached commits, using empty array:',
        error,
      )
    }
  }

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
          // Return cached commits data
          return new Response(JSON.stringify(cachedCommits), {
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
