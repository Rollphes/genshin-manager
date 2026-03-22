import { defineConfig } from 'tsup'
import packageJson from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  target: 'es2022',
  outDir: 'dist',
  define: {
    PACKAGE_NAME: JSON.stringify(packageJson.name),
    PACKAGE_VERSION: JSON.stringify(packageJson.version),
  },
})
