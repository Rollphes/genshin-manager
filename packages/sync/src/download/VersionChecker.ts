import type { RestClient } from '@genshin-manager/core'
import { logger } from '@genshin-manager/core'
import { AssetFormatError, Location } from '@genshin-manager/data'
import fs from 'fs'

import { FileLockManager } from '@/download/FileLockManager'
import type { CommitsResponse } from '@/types/api/gitlab/responses'
import type { GitLabApiRoutes } from '@/types/api/gitlab/routes'

interface VersionCheckerOptions {
  readonly projectId: number
  readonly restClient: RestClient<GitLabApiRoutes>
}

/**
 * Manages version checking and commit tracking for GitLab repository
 */
export class VersionChecker {
  private readonly projectId: number
  private readonly restClient: RestClient<GitLabApiRoutes>
  private readonly fileLockManager: FileLockManager
  private currentCommitId = ''

  /**
   * Creates an instance of VersionChecker
   * @param options - Version checker options
   */
  constructor(options: VersionCheckerOptions) {
    this.projectId = options.projectId
    this.restClient = options.restClient
    this.fileLockManager = new FileLockManager()
  }

  /**
   * Get current commit ID
   */
  public get commitId(): string {
    return this.currentCommitId
  }

  /**
   * Get cached game version from commits.json
   * @returns Game version string or undefined if not available
   */
  public getGameVersion(): string | undefined {
    const commitFilePath = Location.commitFile().resolve()
    if (!fs.existsSync(commitFilePath)) return undefined

    try {
      const fileContent = fs.readFileSync(commitFilePath, {
        encoding: 'utf8',
      })

      if (fileContent.trim() === '') return undefined

      const oldCommitsRaw = JSON.parse(fileContent) as CommitsResponse[]
      if (
        !Array.isArray(oldCommitsRaw) ||
        oldCommitsRaw.length === 0 ||
        !this.isCommitsResponse(oldCommitsRaw[0])
      )
        return undefined

      return this.extractVersionFromTitle(oldCommitsRaw[0].title)
    } catch (error) {
      logger.error(
        'VersionChecker: Error reading commits.json:',
        error instanceof Error ? error : String(error),
      )
      return undefined
    }
  }

  /**
   * Check for new commits from GitLab
   * @returns New version string if update available, undefined otherwise
   * @throws {@link AssetFormatError} - When commits data structure is invalid
   */
  public async checkForUpdate(): Promise<string | undefined> {
    const oldCommits = this.loadCachedCommits()

    const newCommitsRaw = await this.restClient.fetch(
      '/api/v4/projects/:id/repository/commits',
      {
        params: { id: this.projectId },
        query: { per_page: 1 },
      },
    )

    await this.saveCommits(newCommitsRaw)

    if (
      newCommitsRaw.length === 0 ||
      !this.isCommitsResponse(newCommitsRaw[0])
    ) {
      logger.error(
        'VersionChecker: Downloaded commits.json contains invalid data structure!',
      )
      throw new AssetFormatError(
        Location.commitFile(),
        'Invalid data structure (expected non-empty array)',
      )
    }

    this.currentCommitId = newCommitsRaw[0].id

    if (newCommitsRaw[0].id === oldCommits?.[0].id) return undefined

    return this.extractVersionFromTitle(newCommitsRaw[0].title)
  }

  /**
   * Load cached commits from file
   */
  private loadCachedCommits(): CommitsResponse[] | null {
    const commitFilePath = Location.commitFile().resolve()
    if (!fs.existsSync(commitFilePath)) return null

    try {
      const fileContent = fs.readFileSync(commitFilePath, {
        encoding: 'utf8',
      })

      if (fileContent.trim() === '') return null

      const parsedData = JSON.parse(fileContent) as CommitsResponse[]
      if (
        Array.isArray(parsedData) &&
        parsedData.length > 0 &&
        this.isCommitsResponse(parsedData[0])
      )
        return parsedData

      return null
    } catch (error) {
      logger.error(
        'VersionChecker: Error reading existing commits.json:',
        error instanceof Error ? error : String(error),
      )
      return null
    }
  }

  /**
   * Save commits to file
   * @param commits - Commits to save
   */
  private async saveCommits(
    commits: readonly CommitsResponse[],
  ): Promise<void> {
    const commitFileLocation = Location.commitFile()
    const commitFilePath = commitFileLocation.resolve()
    await this.fileLockManager.withLock(commitFileLocation, () => {
      fs.writeFileSync(commitFilePath, JSON.stringify(commits, null, 2), {
        encoding: 'utf8',
      })
      return Promise.resolve()
    })
  }

  /**
   * Extract version from commit title
   * @param title - Commit title
   */
  private extractVersionFromTitle(title: string): string {
    const versionTexts = /OSRELWin(\d+\.\d+\.\d+)_/.exec(title)
    const version = versionTexts?.[1]
    return version ?? '?.?.?'
  }

  /**
   * Type guard for CommitsResponse
   * @param value - Value to check
   */
  private isCommitsResponse(
    value: CommitsResponse | null | undefined,
  ): value is CommitsResponse {
    if (!value || typeof value !== 'object') return false
    return (
      typeof value.id === 'string' &&
      typeof value.title === 'string' &&
      typeof value.short_id === 'string'
    )
  }
}
