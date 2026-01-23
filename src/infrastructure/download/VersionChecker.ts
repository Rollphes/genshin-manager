import fs from 'fs'

import type { RestClient } from '@/client/RestClient'
import { AssetCorruptedError } from '@/errors/assets/AssetCorruptedError'
import { withFileLock } from '@/infrastructure/download/fileLockManager'
import { logger } from '@/infrastructure/logger/Logger'
import type { CommitsResponse } from '@/types/api/gitlab/responses'
import type { GitLabApiRoutes } from '@/types/api/gitlab/routes'

/**
 * Options for VersionChecker
 */
export interface VersionCheckerOptions {
  /**
   * Path to commits.json file
   */
  readonly commitFilePath: string
  /**
   * GitLab project ID
   */
  readonly projectId: number
  /**
   * REST client for GitLab API
   */
  readonly restClient: RestClient<GitLabApiRoutes>
}

/**
 * Manages version checking and commit tracking for GitLab repository
 */
export class VersionChecker {
  private readonly commitFilePath: string
  private readonly projectId: number
  private readonly restClient: RestClient<GitLabApiRoutes>
  private currentCommitId = ''

  /**
   * Creates an instance of VersionChecker
   * @param options - Version checker options
   */
  constructor(options: VersionCheckerOptions) {
    this.commitFilePath = options.commitFilePath
    this.projectId = options.projectId
    this.restClient = options.restClient
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
    if (!fs.existsSync(this.commitFilePath)) return undefined

    try {
      const fileContent = fs.readFileSync(this.commitFilePath, {
        encoding: 'utf8',
      })

      if (fileContent.trim() === '') return undefined

      const oldCommitsRaw: unknown = JSON.parse(fileContent)
      if (
        !Array.isArray(oldCommitsRaw) ||
        oldCommitsRaw.length === 0 ||
        !this.isCommitsResponse(oldCommitsRaw[0])
      )
        return undefined

      return this.extractVersionFromTitle(oldCommitsRaw[0].title)
    } catch (error) {
      logger.error('VersionChecker: Error reading commits.json:', error)
      return undefined
    }
  }

  /**
   * Check for new commits from GitLab
   * @returns New version string if update available, undefined otherwise
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
      throw new AssetCorruptedError(
        'commits.json',
        'Invalid data structure (expected non-empty array)',
      )
    }

    this.currentCommitId = newCommitsRaw[0].id

    if (oldCommits && newCommitsRaw[0].id === oldCommits[0].id) return undefined

    return this.extractVersionFromTitle(newCommitsRaw[0].title)
  }

  /**
   * Load cached commits from file
   */
  private loadCachedCommits(): CommitsResponse[] | null {
    if (!fs.existsSync(this.commitFilePath)) return null

    try {
      const fileContent = fs.readFileSync(this.commitFilePath, {
        encoding: 'utf8',
      })

      if (fileContent.trim() === '') return null

      const parsedData: unknown = JSON.parse(fileContent)
      if (
        Array.isArray(parsedData) &&
        parsedData.length > 0 &&
        this.isCommitsResponse(parsedData[0])
      )
        return parsedData as CommitsResponse[]

      return null
    } catch (error) {
      logger.error(
        'VersionChecker: Error reading existing commits.json:',
        error,
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
    await withFileLock(this.commitFilePath, async () => {
      fs.writeFileSync(this.commitFilePath, JSON.stringify(commits, null, 2), {
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
    if (!versionTexts || versionTexts.length < 2) return '?.?.?'
    return versionTexts[1]
  }

  /**
   * Type guard for CommitsResponse
   * @param value - Value to check
   */
  private isCommitsResponse(value: unknown): value is CommitsResponse {
    if (!value || typeof value !== 'object') return false
    const obj = value as Record<string, unknown>
    return (
      typeof obj.id === 'string' &&
      typeof obj.title === 'string' &&
      typeof obj.short_id === 'string'
    )
  }
}
