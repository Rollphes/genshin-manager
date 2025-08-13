import fs from 'fs'
import path from 'path'

import { Client } from '@/client/Client'

/**
 * Global setup for vitest
 * This runs once before all tests and deploys the Client with full language support
 */

// Cache directory paths
const CACHE_DIR = path.resolve(process.cwd(), 'cache')

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
  console.log('✅ Global setup: Client deployment completed')
}
