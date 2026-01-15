import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globalSetup: ['./src/__test__/setup.ts'],
    setupFiles: ['./src/__test__/setupFiles.ts'],
    testTimeout: 30000, // Extended timeout for GitLab API calls
    cache: false, // Disable test cache to prevent race conditions
    fileParallelism: false, // Disable parallel file execution for stability
    reporters: ['default', './src/__test__/reporters/JsonErrorReporter.ts'],
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
        'src/__test__/**',
        'src/**/*.test.ts',
        'src/utils/buildtime/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
