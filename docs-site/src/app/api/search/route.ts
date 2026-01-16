import { createFromSource } from 'fumadocs-core/search/server'

import { source } from '@/lib/source'

const searchApi = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
})

export const GET = searchApi.GET
