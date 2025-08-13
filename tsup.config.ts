import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  target: 'es2018',
  outDir: 'dist',
  external: ['cheerio', 'cli-progress', 'node-cron', 'ts-deepmerge'],
})
