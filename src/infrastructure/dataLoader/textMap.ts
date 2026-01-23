import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'

import { TextMapFormatError } from '@/application/errors/TextMapFormatError'
import { Language, TextMapBaseName } from '@/domain/types/types'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'
import { logger } from '@/infrastructure/logger/Logger'
import { TextMapEmptyWritable } from '@/infrastructure/streams/TextMapEmptyWritable'
import { TextMapTransform } from '@/infrastructure/streams/TextMapTransform'

/**
 * Result of TextMap file load operation
 */
export interface TextMapLoadFileResult {
  /**
   * Whether the load was successful
   */
  readonly success: boolean
  /**
   * Loaded data (when success is true)
   */
  readonly data?: ReadonlyMap<number, string>
  /**
   * Language that needs re-download (when success is false and autoFix is enabled)
   */
  readonly redownloadLanguage?: Language
}

/**
 * Options for loading TextMap file
 */
export interface TextMapLoadFileOptions {
  /**
   * Whether to auto-fix corrupted files by re-downloading
   */
  readonly autoFix: boolean
  /**
   * Target language
   */
  readonly language: Language
  /**
   * Set of text hashes to filter
   */
  readonly textHashes: ReadonlySet<number>
}

/**
 * Get TextMap file names from local directory
 * @param folderPath - Path to TextMap folder
 * @param language - Target language
 * @returns Array of matching file names
 */
export function getTextMapFileNamesFromLocal(
  folderPath: string,
  language: Language,
): string[] {
  if (!fs.existsSync(folderPath)) return []

  const baseName = TextMapBaseName[language]
  const pattern = new RegExp(`^${baseName}(_\\d+)?\\.json$`)
  const files = fs.readdirSync(folderPath)

  return files.filter((file) => pattern.test(file)).sort()
}

/**
 * Load a single TextMap file
 * @param filePath - Path to the TextMap file
 * @param options - Load options
 * @returns Load result with data or redownload language
 */
async function loadSingleTextMapFile(
  filePath: string,
  options: TextMapLoadFileOptions,
): Promise<TextMapLoadFileResult> {
  const { autoFix, language, textHashes } = options
  const fileName = path.basename(filePath)

  const data = new Map<number, string>()
  const eventEmitter = new TextMapEmptyWritable()
  eventEmitter.on('data', ({ key, value }) =>
    data.set(+(key as string), value as string),
  )

  try {
    await pipeline(
      fs.createReadStream(filePath, { highWaterMark: 1 * 1024 * 1024 }),
      new TextMapTransform(language, textHashes),
      eventEmitter,
    )
    return { success: true, data }
  } catch (error) {
    if (error instanceof TextMapFormatError) {
      if (autoFix) {
        logger.info(
          `TextMapLoader: ${fileName} format error. Re downloading...`,
        )
        return { success: false, redownloadLanguage: language }
      }
    }
    throw error
  }
}

/**
 * Load TextMap files for specified language
 * @param folderPath - Path to TextMap folder
 * @param options - Load options
 * @returns Load result with data or redownload language
 */
export async function loadTextMapFiles(
  folderPath: string,
  options: TextMapLoadFileOptions,
): Promise<TextMapLoadFileResult> {
  const { autoFix, language, textHashes } = options
  const fileNames = getTextMapFileNamesFromLocal(folderPath, language)

  if (fileNames.length === 0) {
    if (autoFix) {
      logger.info(
        `TextMapLoader: TextMap files for ${language} not found. Re downloading...`,
      )
      return { success: false, redownloadLanguage: language }
    }
    throw new AssetNotFoundError(language, 'TextMap', {
      source: 'TextMap',
      operation: 'load',
    })
  }

  const data = new Map<number, string>()

  for (const fileName of fileNames) {
    const filePath = path.join(folderPath, fileName)
    const result = await loadSingleTextMapFile(filePath, {
      autoFix,
      language,
      textHashes,
    })

    if (result.redownloadLanguage) return result

    if (result.data)
      for (const [key, value] of result.data) data.set(key, value)
  }

  return { success: true, data }
}
