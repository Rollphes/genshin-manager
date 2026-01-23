import * as cliProgress from 'cli-progress'
import fs from 'fs'
import * as path from 'path'
import { pipeline } from 'stream/promises'

import { RestClient } from '@/application/client/RestClient'
import { BodyNotFoundError } from '@/application/errors/BodyNotFoundError'
import { type Language, TextMapBaseName } from '@/domain/types/types'
import { FileLockManager } from '@/infrastructure/download/FileLockManager'
import { AssetCorruptedError } from '@/infrastructure/errors/AssetCorruptedError'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'
import { logger, LogLevel } from '@/infrastructure/logger/Logger'
import { ReadableStreamWrapper } from '@/infrastructure/streams/ReadableStreamWrapper'
import { TextMapTransform } from '@/infrastructure/streams/TextMapTransform'
import { GitLabApiRoutes } from '@/infrastructure/types/api/gitlab/routes'

/**
 * Options for AssetDownloader
 */
export interface AssetDownloaderOptions {
  /**
   * REST client for GitLab API
   */
  readonly restClient: RestClient<GitLabApiRoutes>
  /**
   * GitLab project ID
   */
  readonly projectId: number
}

/**
 * Asset downloader for downloading files from GitLab repository
 */
export class AssetDownloader {
  /**
   * Git commit ID for downloads
   */
  public commitId = ''

  /**
   * Text hashes for filtering TextMap files
   */
  public textHashes = new Set<number>()

  private readonly restClient: RestClient<GitLabApiRoutes>
  private readonly projectId: number
  private readonly fileLockManager: FileLockManager

  /**
   * Create an AssetDownloader instance
   * @param options - Downloader options
   */
  constructor(options: AssetDownloaderOptions) {
    this.restClient = options.restClient
    this.projectId = options.projectId
    this.fileLockManager = new FileLockManager()
  }

  /**
   * Download multiple files to a local folder
   * @param folderPath - Local folder path to download to
   * @param gitFolderName - Remote folder name in repository (e.g., 'ExcelBinOutput', 'TextMap')
   * @param files - Array of file names to download
   * @param isRetry - Whether this is a retry attempt (skips folder cleanup)
   */
  public async downloadFolder(
    folderPath: string,
    gitFolderName: string,
    files: string[],
    isRetry = false,
  ): Promise<void> {
    await this.prepareFolder(folderPath, isRetry)

    const progressBar = this.createProgressBar(gitFolderName, files.length)
    if (progressBar) progressBar.start(files.length, 0)

    const concurrentLimit = 3
    const chunks = this.chunkArray(files, concurrentLimit)

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (fileName) => {
          const localFilePath = path.join(folderPath, fileName)
          const remoteFilePath = `${gitFolderName}/${fileName}`

          await this.downloadFileWithRetry(localFilePath, remoteFilePath)

          if (progressBar) progressBar.increment()
        }),
      )

      if (chunks.indexOf(chunk) < chunks.length - 1)
        await new Promise((resolve) => setTimeout(resolve, 100))
    }

    if (progressBar) progressBar.stop()
  }

  /**
   * Prepare folder for download
   * @param folderPath - Folder path to prepare
   * @param isRetry - Whether this is a retry (skip cleanup)
   */
  private async prepareFolder(
    folderPath: string,
    isRetry: boolean,
  ): Promise<void> {
    if (!isRetry) {
      await this.fileLockManager.withLock(folderPath, async () => {
        if (fs.existsSync(folderPath))
          fs.rmdirSync(folderPath, { recursive: true })
        fs.mkdirSync(folderPath, { recursive: true })
        return Promise.resolve()
      })
    } else {
      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true })
    }
  }

  /**
   * Create progress bar if logging is enabled
   * @param folderName - Folder name for display
   * @param total - Total file count
   * @returns Progress bar or undefined
   */
  private createProgressBar(
    folderName: string,
    total: number,
  ): cliProgress.SingleBar | undefined {
    if (!logger.shouldLog(LogLevel.INFO)) return undefined

    const displayName = folderName.slice(0, 8)
    return new cliProgress.SingleBar({
      hideCursor: true,
      format: `GenshinManager: Downloading ${displayName}...\t [{bar}] {percentage}% |ETA: {eta}s| {value}/${String(total)} files`,
    })
  }

  /**
   * Split array into chunks
   * @param array - Array to split
   * @param size - Chunk size
   * @returns Array of chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size)
      chunks.push(array.slice(i, i + size))
    return chunks
  }

  /**
   * Download a single file with retry logic
   * @param localFilePath - Local file path to write to
   * @param remoteFilePath - Remote file path in repository
   */
  private async downloadFileWithRetry(
    localFilePath: string,
    remoteFilePath: string,
  ): Promise<void> {
    const maxRetries = 3
    const baseDelay = 100

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.downloadFile(localFilePath, remoteFilePath)
        return
      } catch (error) {
        if (attempt === maxRetries) throw error

        const delay = baseDelay * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))

        this.cleanupFailedDownload(localFilePath)
      }
    }
  }

  /**
   * Download a single file from GitLab
   * @param localFilePath - Local file path to write to
   * @param remoteFilePath - Remote file path in repository
   */
  private async downloadFile(
    localFilePath: string,
    remoteFilePath: string,
  ): Promise<void> {
    return this.fileLockManager.withLock(localFilePath, async () => {
      const response = await this.restClient.fetchRaw(
        '/api/v4//projects/:id/repository/files/:file_path/raw',
        {
          params: {
            id: this.projectId,
            file_path: remoteFilePath,
          },
          query: {
            ref: this.commitId,
          },
        },
      )

      await this.writeResponseToFile(response, localFilePath)
      this.validateDownloadedFile(localFilePath)
    })
  }

  /**
   * Write response body to file
   * @param response - Fetch Response object
   * @param filePath - Local file path to write to
   */
  private async writeResponseToFile(
    response: Response,
    filePath: string,
  ): Promise<void> {
    if (!response.body) throw new BodyNotFoundError(response.url)

    const writeStream = fs.createWriteStream(filePath, {
      highWaterMark: 1 * 1024 * 1024,
    })

    const fileName = path.basename(filePath)
    const language = this.getLanguageFromFileName(fileName)
    const isTextMapFile = 'TextMap' === path.basename(path.dirname(filePath))

    if (isTextMapFile && language) {
      await pipeline(
        new ReadableStreamWrapper(response.body.getReader()),
        new TextMapTransform(language, this.textHashes),
        writeStream,
      )
    } else {
      await pipeline(
        new ReadableStreamWrapper(response.body.getReader()),
        writeStream,
      )
    }

    await this.waitForStreamFinish(writeStream)
  }

  /**
   * Wait for write stream to finish and sync to disk
   * @param writeStream - The write stream to wait for
   */
  private async waitForStreamFinish(
    writeStream: fs.WriteStream,
  ): Promise<void> {
    if (writeStream.closed) return

    return new Promise<void>((resolve, reject) => {
      writeStream.once('finish', () => {
        try {
          const fd: unknown = (writeStream as { fd?: unknown }).fd
          if (fd !== null && fd !== undefined && typeof fd === 'number') {
            fs.fsync(fd, (err: NodeJS.ErrnoException | null) => {
              if (err)
                reject(err instanceof Error ? err : new Error(String(err)))
              else resolve()
            })
          } else {
            resolve()
          }
        } catch (err) {
          reject(
            err instanceof Error
              ? err
              : new Error('Failed to get file descriptor'),
          )
        }
      })

      writeStream.once('error', (err: Error) => {
        reject(err)
      })
    })
  }

  /**
   * Validate downloaded file exists and has valid content
   * @param filePath - Path to the downloaded file
   * @throws {@link AssetNotFoundError} When file does not exist or was removed
   * @throws {@link AssetCorruptedError} When file is empty or corrupted
   */
  private validateDownloadedFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new AssetNotFoundError(
        filePath,
        'File does not exist after download completion',
        { operation: 'download' },
      )
    }

    let fileStats: fs.Stats
    try {
      fileStats = fs.statSync(filePath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new AssetNotFoundError(
          filePath,
          'File was removed by another process during concurrent access',
          { operation: 'validate' },
        )
      }
      throw error
    }

    if (fileStats.size === 0) {
      throw new AssetCorruptedError(
        path.basename(filePath),
        'File is empty after download',
        { operation: 'validate' },
      )
    }

    if (filePath.endsWith('.json') || filePath.includes('commits'))
      this.validateJsonContent(filePath)
  }

  /**
   * Validate JSON file content
   * @param filePath - Path to the JSON file
   * @throws {@link AssetCorruptedError} When file content is empty, too short, or invalid JSON
   */
  private validateJsonContent(filePath: string): void {
    const testContent = fs.readFileSync(filePath, { encoding: 'utf8' })

    if (testContent.trim() === '') {
      throw new AssetCorruptedError(
        path.basename(filePath),
        'File content is empty after download',
        { operation: 'validate' },
      )
    }

    if (testContent.length < 10) {
      throw new AssetCorruptedError(
        path.basename(filePath),
        'File content is suspiciously short, likely truncated',
        { operation: 'validate' },
      )
    }

    try {
      JSON.parse(testContent)
    } catch (error) {
      throw new AssetCorruptedError(
        path.basename(filePath),
        'Invalid JSON format',
        { source: 'JSON' },
        error instanceof Error ? error : undefined,
      )
    }
  }

  /**
   * Cleanup failed download file
   * @param filePath - Path to the file to cleanup
   */
  private cleanupFailedDownload(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch {
      // Silent cleanup failure
    }
  }

  /**
   * Get language code from TextMap file name
   * @param fileName - TextMap file name (e.g. "TextMapEN.json", "TextMapEN_0.json")
   * @returns language code or undefined if not found
   */
  private getLanguageFromFileName(fileName: string): Language | undefined {
    const baseName = fileName.split('.')[0]?.replace(/_\d+$/, '')
    if (!baseName) return undefined

    const entry = Object.entries(TextMapBaseName).find(
      ([, value]) => value === baseName,
    )
    return entry?.[0] as Language | undefined
  }
}
