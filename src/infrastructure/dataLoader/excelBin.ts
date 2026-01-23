import fs from 'fs'

import { AssetCorruptedError } from '@/infrastructure/errors/AssetCorruptedError'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'
import { logger } from '@/infrastructure/logger/Logger'

/**
 * Result of ExcelBin file load operation
 */
export interface ExcelBinLoadFileResult<T> {
  /**
   * Whether the load was successful
   */
  readonly success: boolean
  /**
   * Loaded data (when success is true)
   */
  readonly data?: readonly T[]
  /**
   * Whether re-download is required (when success is false and autoFix is enabled)
   */
  readonly redownloadRequired?: boolean
}

/**
 * Options for loading ExcelBin file
 */
export interface ExcelBinLoadFileOptions {
  /**
   * Whether to auto-fix corrupted files by re-downloading
   */
  readonly autoFix: boolean
  /**
   * File name for logging purposes
   */
  readonly fileName: string
}

/**
 * Read file as string using stream
 * @param filePath - Path to file
 * @returns File content as string
 */
function readFileAsString(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let text = ''
    const stream = fs.createReadStream(filePath, {
      highWaterMark: 1 * 1024 * 1024,
    })
    stream.on('data', (chunk) => (text += chunk as string))
    stream.on('error', reject)
    stream.on('end', () => {
      resolve(text)
    })
  })
}

/**
 * Load a single ExcelBinOutput JSON file
 * @param filePath - Path to the JSON file
 * @param options - Load options
 * @returns Load result with data or redownload flag
 */
export async function loadExcelBinFile<T>(
  filePath: string,
  options: ExcelBinLoadFileOptions,
): Promise<ExcelBinLoadFileResult<T>> {
  const { autoFix, fileName } = options

  if (!fs.existsSync(filePath)) {
    if (autoFix) {
      logger.info(`ExcelBinLoader: ${fileName} not found. Re downloading...`)
      return { success: false, redownloadRequired: true }
    }
    throw new AssetNotFoundError(fileName, 'ExcelBinOutput', { source: 'ExcelBinOutput', operation: 'load' })
  }

  try {
    const text = await readFileAsString(filePath)
    const parsedData: unknown = JSON.parse(text)

    if (!Array.isArray(parsedData)) {
      throw new AssetCorruptedError(
        fileName,
        `expected array, got ${typeof parsedData}`,
        { source: 'ExcelBinOutput' },
      )
    }

    return { success: true, data: parsedData as T[] }
  } catch (error) {
    if (error instanceof SyntaxError) {
      if (autoFix) {
        logger.info(
          `ExcelBinLoader: ${fileName} format error. Re downloading...`,
        )
        return { success: false, redownloadRequired: true }
      }
    }
    throw error
  }
}
