import fs from 'fs'
import path from 'path'
import { vi } from 'vitest'

import { Client } from '@/client/Client'

/**
 * Global test setup for vitest
 * This file sets up the initial Client deployment and GitLab mock server
 */

// Store original fetch for real API calls when needed
const originalFetch = global.fetch

// Cache directory paths
const CACHE_DIR = path.resolve(process.cwd(), 'cache')
const COMMIT_FILE_PATH = path.resolve(CACHE_DIR, 'commits.json')

interface GitLabCommit {
  id: string
  title: string
  web_url: string
  created_at: string
}

// Global setup: Deploy client once to get real GitLab data
async function setupGlobalClient(): Promise<void> {
  console.log('🚀 Setting up global Client deployment...')

  // Use original fetch for initial deployment
  global.fetch = originalFetch

  const client = new Client({
    defaultLanguage: 'EN',
    downloadLanguages: ['EN'],
  })

  await client.deploy()
  console.log('✅ Global Client deployment completed')
}

// Create GitLab mock server based on cached data
function createGitLabMockServer(): void {
  // Read the commits.json file that was created by Client.deploy()
  let cachedCommits: GitLabCommit[] = []
  if (fs.existsSync(COMMIT_FILE_PATH)) {
    try {
      cachedCommits = JSON.parse(
        fs.readFileSync(COMMIT_FILE_PATH, 'utf8'),
      ) as GitLabCommit[]
    } catch {
      console.warn('⚠️ Could not read cached commits, using empty array')
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

        // For all other URLs (EnkaManager APIs), pass through to test mocks
        return originalFetch(url, options)
      },
    )

  console.log('🔧 GitLab mock server created using cached data')
}

// Initialize setup in async IIFE to avoid top-level await
;(async (): Promise<void> => {
  await setupGlobalClient()
  createGitLabMockServer()
})().catch(console.error)

// Optionally restore original fetch for specific tests
export { originalFetch }
