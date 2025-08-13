import fs from 'fs'
import path from 'path'

import { Client } from '@/client/Client'

/**
 * Global setup for vitest
 * This runs once before all tests and deploys the Client with full language support
 */

// Cache directory paths
const CACHE_DIR = path.resolve(process.cwd(), 'cache')
const COMMIT_FILE_PATH = path.resolve(CACHE_DIR, 'commits.json')
const TEST_COMMIT_FILE_PATH = path.resolve(CACHE_DIR, 'commits_test_temp.json')

/**
 * Deploys the Client with comprehensive language support for testing.
 */
export async function setup(): Promise<void> {
  console.log('🚀 Global setup: Starting Client deployment...')

  // Clear existing cache to ensure fresh deployment
  if (fs.existsSync(CACHE_DIR))
    fs.rmSync(CACHE_DIR, { recursive: true, force: true })

  /**
   * Client instance with all supported languages for comprehensive test coverage.
   */
  const client = new Client({
    defaultLanguage: 'EN',
    downloadLanguages: [
      'EN',
      'JP',
      'CHS',
      'CHT',
      'DE',
      'ES',
      'FR',
      'ID',
      'KR',
      'PT',
      'RU',
      'TH',
      'VI',
    ],
  })

  await client.deploy()

  // Create a temporary copy of commits.json for GitLab mock to avoid file access conflicts
  if (fs.existsSync(COMMIT_FILE_PATH)) {
    fs.copyFileSync(COMMIT_FILE_PATH, TEST_COMMIT_FILE_PATH)
    console.log('📄 Global setup: Created test commits file copy')
  }

  console.log('✅ Global setup: Client deployment completed')
}
