import { AssetFormatError } from '@genshin-manager/core'
import { AssetNotFoundError } from '@genshin-manager/core'
import { logger } from '@genshin-manager/core'
import fs from 'fs'

type ExcelBinLoadFileResult<T> =
  | { readonly success: true; readonly data: readonly T[] }
  | { readonly success: false; readonly redownloadRequired: true }

interface ExcelBinLoadFileOptions {
  readonly autoFix: boolean
  readonly fileName: string
}

/**
 * Load a single ExcelBinOutput JSON file
 * @param filePath - Path to the JSON file
 * @param options - Load options
 * @returns Load result with data or redownload flag
 * @throws {@link AssetNotFoundError} - When file not found and autoFix is false
 * @throws {@link AssetFormatError} - When file format is invalid and autoFix is false
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
    throw new AssetNotFoundError(filePath)
  }

  try {
    const text = await readFileAsString(filePath)
    const parsedData = JSON.parse(text) as T[]

    if (!Array.isArray(parsedData)) {
      throw new AssetFormatError(
        filePath,
        `expected array, got ${typeof parsedData}`,
      )
    }

    return { success: true, data: parsedData }
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof AssetFormatError) {
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

function readFileAsString(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let text = ''
    const stream = fs.createReadStream(filePath, {
      encoding: 'utf-8',
      highWaterMark: 1 * 1024 * 1024,
    })
    stream.on('data', (chunk) => (text += String(chunk)))
    stream.on('error', reject)
    stream.on('end', () => {
      resolve(text)
    })
  })
}
