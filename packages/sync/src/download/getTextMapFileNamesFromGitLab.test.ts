import type { RestClient } from '@genshin-manager/core'
import { Language } from '@genshin-manager/core'
import { describe, expect, it, vi } from 'vitest'

import { getTextMapFileNamesFromGitLab } from '@/download/getTextMapFileNamesFromGitLab'
import type { GitLabApiRoutes } from '@/types/api/gitlab/routes'

describe('getTextMapFileNamesFromGitLab', () => {
  function createMockRestClient(
    treeItems: { name: string; type: string }[],
  ): RestClient<GitLabApiRoutes> {
    return {
      fetch: vi.fn().mockResolvedValue(treeItems),
    } as unknown as RestClient<GitLabApiRoutes>
  }

  const defaultOptions = {
    projectId: 12345,
    commitId: 'abc123',
  }

  it('should return empty map for empty languages', async () => {
    const restClient = createMockRestClient([])
    const result = await getTextMapFileNamesFromGitLab([], {
      restClient,
      ...defaultOptions,
    })
    expect(result.size).toBe(0)
  })

  it('should fetch TextMap files for single language', async () => {
    const treeItems = [
      { name: 'TextMapEN.json', type: 'blob' },
      { name: 'TextMapEN_1.json', type: 'blob' },
    ]
    const restClient = createMockRestClient(treeItems)

    const result = await getTextMapFileNamesFromGitLab([Language.En], {
      restClient,
      ...defaultOptions,
    })

    expect(result.get(Language.En)).toEqual([
      'TextMapEN.json',
      'TextMapEN_1.json',
    ])
  })

  it('should handle multiple languages', async () => {
    const treeItems = [
      { name: 'TextMapEN.json', type: 'blob' },
      { name: 'TextMapJP.json', type: 'blob' },
      { name: 'TextMapCHS.json', type: 'blob' },
    ]
    const restClient = createMockRestClient(treeItems)

    const result = await getTextMapFileNamesFromGitLab(
      [Language.En, Language.Ja],
      {
        restClient,
        ...defaultOptions,
      },
    )

    expect(result.get(Language.En)).toEqual(['TextMapEN.json'])
    expect(result.get(Language.Ja)).toEqual(['TextMapJP.json'])
    expect(result.has(Language.ZhCn)).toBe(false)
  })

  it('should filter out non-blob items', async () => {
    const treeItems = [
      { name: 'TextMapEN.json', type: 'blob' },
      { name: 'TextMapEN', type: 'tree' },
    ]
    const restClient = createMockRestClient(treeItems)

    const result = await getTextMapFileNamesFromGitLab([Language.En], {
      restClient,
      ...defaultOptions,
    })

    expect(result.get(Language.En)).toEqual(['TextMapEN.json'])
  })

  it('should filter out files not matching pattern', async () => {
    const treeItems = [
      { name: 'TextMapEN.json', type: 'blob' },
      { name: 'TextMapEN_backup.json', type: 'blob' },
      { name: 'TextMapENOther.json', type: 'blob' },
    ]
    const restClient = createMockRestClient(treeItems)

    const result = await getTextMapFileNamesFromGitLab([Language.En], {
      restClient,
      ...defaultOptions,
    })

    expect(result.get(Language.En)).toEqual(['TextMapEN.json'])
  })

  it('should sort file names', async () => {
    const treeItems = [
      { name: 'TextMapEN_2.json', type: 'blob' },
      { name: 'TextMapEN.json', type: 'blob' },
      { name: 'TextMapEN_1.json', type: 'blob' },
    ]
    const restClient = createMockRestClient(treeItems)

    const result = await getTextMapFileNamesFromGitLab([Language.En], {
      restClient,
      ...defaultOptions,
    })

    expect(result.get(Language.En)).toEqual([
      'TextMapEN.json',
      'TextMapEN_1.json',
      'TextMapEN_2.json',
    ])
  })

  it('should return empty array for language with no files', async () => {
    const treeItems = [{ name: 'TextMapEN.json', type: 'blob' }]
    const restClient = createMockRestClient(treeItems)

    const result = await getTextMapFileNamesFromGitLab([Language.Ja], {
      restClient,
      ...defaultOptions,
    })

    expect(result.get(Language.Ja)).toEqual([])
  })

  it('should call restClient with correct parameters', async () => {
    const mockFetch = vi.fn().mockResolvedValue([])
    const restClient = {
      fetch: mockFetch,
    } as unknown as RestClient<GitLabApiRoutes>

    await getTextMapFileNamesFromGitLab([Language.En], {
      restClient,
      projectId: 99999,
      commitId: 'def456',
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v4/projects/:id/repository/tree',
      {
        params: { id: 99999 },
        query: { path: 'TextMap', ref: 'def456', per_page: 100 },
      },
    )
  })
})
