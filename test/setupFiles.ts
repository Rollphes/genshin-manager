import fs from 'fs'
import path from 'path'

/**
 * Setup file that runs before each test file
 * Cleans up test-cache directory to ensure fresh state
 */

const TEST_CACHE_DIR = path.resolve(process.cwd(), 'test-cache')

// Clean up test-cache directory before tests run
if (fs.existsSync(TEST_CACHE_DIR)) {
  fs.rmSync(TEST_CACHE_DIR, { recursive: true, force: true })
  console.log('🗑️  Setup: Cleaned up existing test-cache directory')
}
