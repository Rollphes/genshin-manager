import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config'
import { transformerTwoslash } from 'fumadocs-twoslash'
import { createFileSystemTypesCache } from 'fumadocs-twoslash/cache-fs'
import {
  createFileSystemGeneratorCache,
  createGenerator,
  remarkAutoTypeTable,
} from 'fumadocs-typescript'
import { z } from 'zod'

// TypeScript documentation generator with caching
const generator = createGenerator({
  cache: createFileSystemGeneratorCache('.next/fumadocs-typescript'),
})

// Extended frontmatter schema with badge field
const extendedFrontmatterSchema = frontmatterSchema.extend({
  badge: z.enum(['class', 'interface', 'type', 'function', 'enum']).optional(),
})

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: extendedFrontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [[remarkAutoTypeTable, { generator }]],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({
          typesCache: createFileSystemTypesCache(),
        }),
      ],
      // Shiki doesn't support lazy loading languages for codeblocks in Twoslash popups
      // Pre-define common languages to avoid "Language not found" warnings
      langs: [
        'js',
        'jsx',
        'ts',
        'tsx',
        'json',
        'bash',
        'shell',
        'markdown',
        'md',
      ],
    },
  },
})
