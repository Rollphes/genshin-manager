import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: ['./test/setup.ts'],
    setupFiles: ['./test/setupFiles.ts'],
    testTimeout: 30000, // Extended timeout for GitLab API calls
    cache: false, // Disable test cache to prevent race conditions
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
      include: ['src/**/*.{js,ts}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/tests/**',
        'src/test/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
})
