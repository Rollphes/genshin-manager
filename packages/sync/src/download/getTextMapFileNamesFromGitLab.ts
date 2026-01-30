import type { RestClient } from '@genshin-manager/core'
import type { Language } from '@genshin-manager/core'
import { TextMapBaseName } from '@genshin-manager/core'

import type { GitLabApiRoutes } from '@/types/api/gitlab/routes'

interface TextMapFileResolverOptions {
  readonly restClient: RestClient<GitLabApiRoutes>
  readonly projectId: number
  readonly commitId: string
}

/**
 * Get TextMap file names from GitLab Tree API
 * @param languages - Languages to get files for
 * @param options - GitLab options
 * @returns Map of language to file names
 */
export async function getTextMapFileNamesFromGitLab(
  languages: readonly Language[],
  options: TextMapFileResolverOptions,
): Promise<Map<Language, string[]>> {
  const treeItems = await options.restClient.fetch(
    '/api/v4/projects/:id/repository/tree',
    {
      params: { id: options.projectId },
      query: { path: 'TextMap', ref: options.commitId, per_page: 100 },
    },
  )

  const result = new Map<Language, string[]>()

  for (const lang of languages) {
    const baseName = TextMapBaseName[lang]
    const pattern = new RegExp(`^${baseName}(_\\d+)?\\.json$`)
    const matchedFiles = treeItems
      .filter((item) => item.type === 'blob' && pattern.test(item.name))
      .map((item) => item.name)
      .sort()

    result.set(lang, matchedFiles)
  }

  return result
}
