import {
  type InferPageType,
  loader,
  type LoaderPlugin,
} from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { docs } from 'fumadocs-mdx:collections/server'

type BadgeVariant = 'class' | 'interface' | 'type' | 'function' | 'enum'

// Plugin to add badge field from frontmatter to page tree nodes
const badgePlugin: LoaderPlugin = {
  name: 'badge-plugin',
  transformPageTree: {
    file(node, filePath) {
      if (filePath) {
        const page = this.storage.read(filePath)
        if (page?.format === 'page') {
          const badge = (page.data as { badge?: BadgeVariant }).badge
          if (badge) {
            ;(node as typeof node & { badge?: BadgeVariant }).badge = badge
          }
        }
      }
      return node
    },
  },
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), badgePlugin],
})

export function getPageImage(page: InferPageType<typeof source>): {
  segments: string[]
  url: string
} {
  const segments: string[] = [...page.slugs, 'image.png']

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  }
}

export async function getLLMText(
  page: InferPageType<typeof source>,
): Promise<string> {
  const processed = await page.data.getText('processed')

  return `# ${page.data.title}

${processed}`
}
