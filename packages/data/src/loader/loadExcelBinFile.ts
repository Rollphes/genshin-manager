import { logger } from '@genshin-manager/core'
import type { JsonObject } from '@genshin-manager/crypto'
import fs from 'fs'

import { AssetFormatError } from '@/errors/AssetFormatError'
import { AssetNotFoundError } from '@/errors/AssetNotFoundError'
import { FileLocation } from '@/paths/FileLocation'
import type { MasterFileMap } from '@/types/generated/MasterFileMap'

/**
 * Result of loading an ExcelBin file
 * Returns raw JSON objects (encrypted) on success, or redownload flag on failure
 */
type ExcelBinLoadFileResult =
  | { readonly success: true; readonly data: readonly JsonObject[] }
  | { readonly success: false; readonly redownloadRequired: true }

interface ExcelBinLoadFileOptions<K extends keyof MasterFileMap> {
  readonly autoFix: boolean
  readonly excelBinName: K
}

/**
 * Load a single ExcelBinOutput JSON file
 * Returns raw encrypted JSON objects that need to be decoded by EncryptedKeyDecoder
 * @param options - Load options
 * @returns Load result with raw data or redownload flag
 * @throws {@link AssetNotFoundError} - When file not found and autoFix is false
 * @throws {@link AssetFormatError} - When file format is invalid and autoFix is false
 */
export async function loadExcelBinFile<K extends keyof MasterFileMap>(
  options: ExcelBinLoadFileOptions<K>,
): Promise<ExcelBinLoadFileResult> {
  const { autoFix, excelBinName } = options
  const location = FileLocation.excelBin(excelBinName)
  const resolvedPath = location.resolve()

  if (!fs.existsSync(resolvedPath)) {
    if (autoFix) {
      logger.info(
        `ExcelBinLoader: ${excelBinName} not found. Re downloading...`,
      )
      return { success: false, redownloadRequired: true }
    }
    throw new AssetNotFoundError(location)
  }

  try {
    const text = await readFileAsString(location)
    const parsedData: unknown = JSON.parse(text)

    if (!Array.isArray(parsedData)) {
      throw new AssetFormatError(
        location,
        `expected array, got ${typeof parsedData}`,
      )
    }

    // Validate each element is an object
    for (const item of parsedData) {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        throw new AssetFormatError(
          location,
          'expected array of objects, found non-object element',
        )
      }
    }

    return { success: true, data: parsedData as JsonObject[] }
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof AssetFormatError) {
      if (autoFix) {
        logger.info(
          `ExcelBinLoader: ${excelBinName} format error. Re downloading...`,
        )
        return { success: false, redownloadRequired: true }
      }
    }
    throw error
  }
}

function readFileAsString(location: FileLocation): Promise<string> {
  const resolvedPath = location.resolve()
  return new Promise((resolve, reject) => {
    let text = ''
    const stream = fs.createReadStream(resolvedPath, {
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
