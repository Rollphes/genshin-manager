import type { RestClient } from '@genshin-manager/core'
import { BodyNotFoundError, GeneralError } from '@genshin-manager/core'
import { logger } from '@genshin-manager/core'
import { LogLevel } from '@genshin-manager/core'
import { type Language, TextMapBaseName } from '@genshin-manager/core'
import {
  AssetFormatError,
  AssetNotFoundError,
  FileLocation,
  ReadableStreamWrapper,
  TextMapTransform,
} from '@genshin-manager/data'
import * as cliProgress from 'cli-progress'
import fs from 'fs'
import { pipeline } from 'stream/promises'

import { FileLockManager } from '@/download/FileLockManager'
import type { GitLabApiRoutes } from '@/types/api/gitlab/routes'

interface AssetDownloaderOptions {
  readonly restClient: RestClient<GitLabApiRoutes>
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
   * @param gitFolderName - Remote folder name in repository ('ExcelBinOutput' or 'TextMap')
   * @param files - Array of file names to download
   * @param isRetry - Whether this is a retry attempt (skips folder cleanup)
   */
  public async downloadFolder(
    gitFolderName: 'ExcelBinOutput' | 'TextMap',
    files: string[],
    isRetry = false,
  ): Promise<void> {
    await this.prepareFolder(gitFolderName, isRetry)

    const progressBar = this.createProgressBar(gitFolderName, files.length)
    if (progressBar) progressBar.start(files.length, 0)

    const concurrentLimit = 3
    const chunks = this.chunkArray(files, concurrentLimit)

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (fileName) => {
          const localLocation = this.createLocationForFile(
            gitFolderName,
            fileName,
          )
          const remoteFilePath = `${gitFolderName}/${fileName}`

          await this.downloadFileWithRetry(localLocation, remoteFilePath)

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
   * @param gitFolderName - Folder type to prepare
   * @param isRetry - Whether this is a retry (skip cleanup)
   */
  private async prepareFolder(
    gitFolderName: 'ExcelBinOutput' | 'TextMap',
    isRetry: boolean,
  ): Promise<void> {
    const folderLocation =
      gitFolderName === 'ExcelBinOutput'
        ? FileLocation.excelBinFolder()
        : FileLocation.textMapFolder()
    const folderPath = folderLocation.resolve()

    if (!isRetry) {
      await this.fileLockManager.withLock(folderLocation, () => {
        if (fs.existsSync(folderPath))
          fs.rmSync(folderPath, { recursive: true })
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
   * @param localLocation - Location of local file to write to
   * @param remoteFilePath - Remote file path in repository (HTTP path)
   */
  private async downloadFileWithRetry(
    localLocation: FileLocation,
    remoteFilePath: string,
  ): Promise<void> {
    const maxRetries = 3
    const baseDelay = 100

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.downloadFile(localLocation, remoteFilePath)
        return
      } catch (error) {
        if (attempt === maxRetries) throw error

        const delay = baseDelay * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))

        this.cleanupFailedDownload(localLocation)
      }
    }
  }

  /**
   * Download a single file from GitLab
   * @param localLocation - Location of local file to write to
   * @param remoteFilePath - Remote file path in repository (HTTP path)
   */
  private async downloadFile(
    localLocation: FileLocation,
    remoteFilePath: string,
  ): Promise<void> {
    return this.fileLockManager.withLock(localLocation, async () => {
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

      await this.writeResponseToFile(response, localLocation)
      this.validateDownloadedFile(localLocation)
    })
  }

  /**
   * Write response body to file
   * @param response - Fetch Response object
   * @param location - Location of local file to write to
   */
  private async writeResponseToFile(
    response: Response,
    location: FileLocation,
  ): Promise<void> {
    if (!response.body)
      throw new BodyNotFoundError(new Request(response.url), response)

    const resolvedPath = location.resolve()
    const writeStream = fs.createWriteStream(resolvedPath, {
      highWaterMark: 1 * 1024 * 1024,
    })

    const fileName = location.basename()
    const language = this.getLanguageFromFileName(fileName)
    const isTextMapFile = location.sourceType === 'textMap'

    if (isTextMapFile && language) {
      await pipeline(
        new ReadableStreamWrapper(response.body.getReader()),
        new TextMapTransform(language, this.textHashes, resolvedPath),
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
          const fd = (writeStream as { fd?: number | null }).fd
          if (fd !== null && fd !== undefined) {
            fs.fsync(fd, (err: NodeJS.ErrnoException | null) => {
              if (err) {
                reject(
                  err instanceof Error ? err : new GeneralError(String(err)),
                )
              } else {
                resolve()
              }
            })
          } else {
            resolve()
          }
        } catch (err) {
          reject(
            err instanceof Error
              ? err
              : new GeneralError('Failed to get file descriptor'),
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
   * @param location - Location of the downloaded file
   * @throws {@link AssetNotFoundError} - When file does not exist or was removed
   * @throws {@link AssetFormatError} - When file is empty or corrupted
   */
  private validateDownloadedFile(location: FileLocation): void {
    const resolvedPath = location.resolve()

    if (!fs.existsSync(resolvedPath)) throw new AssetNotFoundError(location)

    let fileStats: fs.Stats
    try {
      fileStats = fs.statSync(resolvedPath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT')
        throw new AssetNotFoundError(location)

      throw error
    }

    if (fileStats.size === 0)
      throw new AssetFormatError(location, 'File is empty after download')

    if (resolvedPath.endsWith('.json') || resolvedPath.includes('commits'))
      this.validateJsonContent(location)
  }

  /**
   * Validate JSON file content
   * @param location - Location of the JSON file
   * @throws {@link AssetFormatError} - When file content is empty, too short, or invalid JSON
   */
  private validateJsonContent(location: FileLocation): void {
    const resolvedPath = location.resolve()
    const testContent = fs.readFileSync(resolvedPath, { encoding: 'utf8' })

    if (testContent.trim() === '')
      throw new AssetFormatError(location, 'File content is empty')

    if (testContent.length < 10)
      throw new AssetFormatError(location, 'File content is suspiciously short')

    try {
      JSON.parse(testContent)
    } catch (error) {
      throw new AssetFormatError(
        location,
        'Invalid JSON format',
        error instanceof Error ? { cause: error } : undefined,
      )
    }
  }

  /**
   * Cleanup failed download file
   * @param location - Location of the file to cleanup
   */
  private cleanupFailedDownload(location: FileLocation): void {
    try {
      const resolvedPath = location.resolve()
      if (fs.existsSync(resolvedPath)) fs.unlinkSync(resolvedPath)
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

  /**
   * Create a Location for a file based on folder type and file name
   * @param gitFolderName - Folder type ('ExcelBinOutput' or 'TextMap')
   * @param fileName - File name
   * @returns Appropriate Location
   */
  private createLocationForFile(
    gitFolderName: 'ExcelBinOutput' | 'TextMap',
    fileName: string,
  ): FileLocation {
    if (gitFolderName === 'TextMap') {
      const language = this.getLanguageFromFileName(fileName)
      if (language) return FileLocation.textMap(language, fileName)
    }

    // For ExcelBinOutput and other files, use image as a generic location
    // since it accepts arbitrary file names
    return FileLocation.image(fileName)
  }
}
