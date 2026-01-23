import type { RestClient } from '@/application/client/RestClient'
import { Language, TextMapBaseName } from '@/domain/types/types'
import type { GitLabApiRoutes } from '@/infrastructure/types/api/gitlab/routes'

/**
 * Options for fetching TextMap file names from GitLab
 */
export interface TextMapFileResolverOptions {
  /**
   * REST client for GitLab API
   */
  readonly restClient: RestClient<GitLabApiRoutes>
  /**
   * GitLab project ID
   */
  readonly projectId: number
  /**
   * Commit ID to fetch from
   */
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
