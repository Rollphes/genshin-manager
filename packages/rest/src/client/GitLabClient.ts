import type { ClientOptions } from 'openapi-fetch'

import { createRestClient } from '@/client/createRestClient'
import { HttpError } from '@/error/HttpError'
import type { components, paths } from '@/types/gitlab'

/**
 * GitLab project type.
 */
export type Project = components['schemas']['Project']

/**
 * GitLab commit type.
 */
export type Commit = components['schemas']['Commit']

/**
 * GitLab tree object type.
 */
export type TreeObject = components['schemas']['TreeObject']

/**
 * GitLab file metadata type.
 */
export type FileMetadata = components['schemas']['FileMetadata']

/**
 * GitLab branch type.
 */
export type Branch = components['schemas']['Branch']

/**
 * GitLab tag type.
 */
export type Tag = components['schemas']['Tag']

/**
 * GitLab compare result type.
 */
export type Compare = components['schemas']['Compare']

/**
 * GitLab diff type.
 */
export type Diff = components['schemas']['Diff']

const GITLAB_BASE_URL = 'https://gitlab.com/api/v4'

/**
 * Type-safe client for GitLab API.
 * Each instance is bound to a specific project.
 */
export class GitLabClient {
  private readonly client: ReturnType<typeof createRestClient<paths>>
  private readonly projectId: number | string

  /**
   * Creates a new GitLabClient instance bound to a specific project.
   * @param projectId - project ID or URL-encoded path
   * @param options - optional client options
   */
  constructor(projectId: number | string, options?: ClientOptions) {
    this.projectId = projectId
    this.client = createRestClient<paths>(GITLAB_BASE_URL, options)
  }

  /**
   * Fetch project information.
   * @returns project information
   * @throws - HttpError if the request fails
   */
  public async fetchProject(): Promise<Project> {
    const { data, response } = await this.client.GET('/projects/{id}', {
      params: {
        path: { id: this.projectId },
      },
    })

    if (!data)
      throw new HttpError(response.status, response.statusText, undefined)

    return data
  }

  /**
   * Fetch commits from the repository.
   * @param perPage - number of commits to return (default: 20)
   * @param refName - branch or tag name
   * @returns array of commits
   * @throws - HttpError if the request fails
   */
  public async fetchCommits(perPage = 20, refName?: string): Promise<Commit[]> {
    const { data, response } = await this.client.GET(
      '/projects/{id}/repository/commits',
      {
        params: {
          path: { id: this.projectId },
          query: {
            per_page: perPage,
            ...(refName ? { ref_name: refName } : {}),
          },
        },
      },
    )

    if (!data)
      throw new HttpError(response.status, response.statusText, undefined)

    return data
  }

  /**
   * Fetch the latest commit from the repository.
   * @param refName - branch or tag name
   * @returns the latest commit
   * @throws - HttpError if the request fails or no commits found
   */
  public async fetchLatestCommit(refName?: string): Promise<Commit> {
    const commits = await this.fetchCommits(1, refName)

    if (commits.length === 0)
      throw new HttpError(404, 'Not Found', { message: 'No commits found' })

    return commits[0]
  }

  /**
   * Fetch repository tree.
   * @param path - directory path (e.g., "ExcelBinOutput")
   * @param ref - branch, tag, or commit SHA
   * @param recursive - get recursive tree
   * @param perPage - number of items per page (default: 100)
   * @returns array of tree objects
   * @throws - HttpError if the request fails
   */
  public async fetchTree(
    path?: string,
    ref?: string,
    recursive?: boolean,
    perPage = 100,
  ): Promise<TreeObject[]> {
    const { data, response } = await this.client.GET(
      '/projects/{id}/repository/tree',
      {
        params: {
          path: { id: this.projectId },
          query: {
            ...(path ? { path } : {}),
            ...(ref ? { ref } : {}),
            ...(recursive ? { recursive } : {}),
            per_page: perPage,
          },
        },
      },
    )

    if (!data)
      throw new HttpError(response.status, response.statusText, undefined)

    return data
  }

  /**
   * Fetch file metadata from the repository.
   * @param filePath - URL-encoded file path
   * @param ref - branch, tag, or commit SHA
   * @returns file metadata
   * @throws - HttpError if the request fails
   */
  public async fetchFileMetadata(
    filePath: string,
    ref: string,
  ): Promise<FileMetadata> {
    const { data, response } = await this.client.GET(
      '/projects/{id}/repository/files/{file_path}',
      {
        params: {
          path: {
            id: this.projectId,
            file_path: filePath,
          },
          query: { ref },
        },
      },
    )

    if (!data)
      throw new HttpError(response.status, response.statusText, undefined)

    return data
  }

  /**
   * Fetch raw file contents from the repository.
   * @param filePath - URL-encoded file path
   * @param ref - branch, tag, or commit SHA
   * @returns raw file contents as string
   * @throws - HttpError if the request fails
   */
  public async fetchRawFile(filePath: string, ref?: string): Promise<string> {
    const { data, response } = await this.client.GET(
      '/projects/{id}/repository/files/{file_path}/raw',
      {
        params: {
          path: {
            id: this.projectId,
            file_path: filePath,
          },
          query: ref ? { ref } : {},
        },
        parseAs: 'text',
      },
    )

    if (!data)
      throw new HttpError(response.status, response.statusText, undefined)

    return data
  }

  /**
   * Fetch branches from the repository.
   * @param search - search string to filter branches
   * @param perPage - number of items per page (default: 20)
   * @returns array of branches
   * @throws - HttpError if the request fails
   */
  public async fetchBranches(search?: string, perPage = 20): Promise<Branch[]> {
    const { data, response } = await this.client.GET(
      '/projects/{id}/repository/branches',
      {
        params: {
          path: { id: this.projectId },
          query: {
            ...(search ? { search } : {}),
            per_page: perPage,
          },
        },
      },
    )

    if (!data)
      throw new HttpError(response.status, response.statusText, undefined)

    return data
  }

  /**
   * Fetch tags from the repository.
   * @param search - search string to filter tags
   * @param perPage - number of items per page (default: 20)
   * @returns array of tags
   * @throws - HttpError if the request fails
   */
  public async fetchTags(search?: string, perPage = 20): Promise<Tag[]> {
    const { data, response } = await this.client.GET(
      '/projects/{id}/repository/tags',
      {
        params: {
          path: { id: this.projectId },
          query: {
            ...(search ? { search } : {}),
            per_page: perPage,
          },
        },
      },
    )

    if (!data)
      throw new HttpError(response.status, response.statusText, undefined)

    return data
  }

  /**
   * Compare two branches, tags, or commits.
   * @param from - commit, branch, or tag to start comparison
   * @param to - commit, branch, or tag to stop comparison
   * @param straight - use direct comparison (from..to) instead of merge base (from...to)
   * @returns comparison result
   * @throws - HttpError if the request fails
   */
  public async fetchCompare(
    from: string,
    to: string,
    straight?: boolean,
  ): Promise<Compare> {
    const { data, response } = await this.client.GET(
      '/projects/{id}/repository/compare',
      {
        params: {
          path: { id: this.projectId },
          query: {
            from,
            to,
            ...(straight ? { straight } : {}),
          },
        },
      },
    )

    if (!data)
      throw new HttpError(response.status, response.statusText, undefined)

    return data
  }
}
