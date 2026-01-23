import fs from 'fs'
import path from 'path'

import { Client } from '@/application/client/Client'
import { Language } from '@/domain/types/types'

/**
 * Global setup for vitest
 * This runs once before all tests and deploys the Client with full language support
 */

// Cache directory paths
const CACHE_DIR = path.resolve(process.cwd(), 'cache')
const TEST_CACHE_DIR = path.resolve(process.cwd(), 'test-cache')
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

  // Remove old test commits file if it exists
  if (
    !fs.existsSync(COMMIT_FILE_PATH) &&
    fs.existsSync(TEST_COMMIT_FILE_PATH)
  ) {
    // If test temp file exists, remove it to avoid conflicts
    fs.rmSync(TEST_COMMIT_FILE_PATH, { force: true })
    console.log('🗑️ Global setup: Removed old test commits file')
  }

  /**
   * Client instance with all supported languages for comprehensive test coverage.
   */
  const client = new Client({
    defaultLanguage: Language.En,
    downloadLanguages: [
      Language.En,
      Language.Ja,
      Language.ZhCn,
      Language.ZhTw,
      Language.De,
      Language.Es,
      Language.Fr,
      Language.Id,
      Language.Ko,
      Language.Pt,
      Language.Ru,
      Language.Th,
      Language.Vi,
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

/**
 * Global teardown for vitest
 * This runs once after all tests complete and cleans up test-cache directory
 */
export function teardown(): void {
  console.log('🧹 Global teardown: Cleaning up test cache...')

  if (fs.existsSync(TEST_CACHE_DIR)) {
    fs.rmSync(TEST_CACHE_DIR, { recursive: true, force: true })
    console.log('🗑️  Global teardown: Removed test-cache directory')
  }

  console.log('✅ Global teardown: Cleanup completed')
}

/**
 * Fallback cleanup on process exit (for VSCode Vitest extension)
 * This ensures test-cache is removed even when globalTeardown is not called
 */
process.on('exit', () => {
  if (fs.existsSync(TEST_CACHE_DIR)) {
    try {
      fs.rmSync(TEST_CACHE_DIR, { recursive: true, force: true })
      console.log('🗑️  Process exit: Removed test-cache directory')
    } catch {
      // Silently ignore errors (directory may already be removed by globalTeardown)
    }
  }
})
