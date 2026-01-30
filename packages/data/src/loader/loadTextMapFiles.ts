import type { Language } from '@genshin-manager/core'
import { AssetNotFoundError } from '@genshin-manager/core'
import { TextMapFormatError } from '@genshin-manager/core'
import { logger } from '@genshin-manager/core'
import { TextMapBaseName } from '@genshin-manager/core'
import fs from 'fs'
import { pipeline } from 'stream/promises'

import { Location } from '@/paths/Location'
import type { TextMapEntry } from '@/streams/TextMapEmptyWritable'
import { TextMapEmptyWritable } from '@/streams/TextMapEmptyWritable'
import { TextMapTransform } from '@/streams/TextMapTransform'

type TextMapLoadFileResult =
  | { readonly success: true; readonly data: ReadonlyMap<number, string> }
  | { readonly success: false; readonly redownloadLanguage: Language }

interface TextMapLoadFileOptions {
  readonly autoFix: boolean
  readonly language: Language
  readonly textHashes: ReadonlySet<number>
}

/**
 * Load TextMap files for specified language
 * @param folderPath - Path to TextMap folder
 * @param options - Load options
 * @returns Load result with data or redownload language
 * @throws {@link AssetNotFoundError} - When files not found and autoFix is false
 * @throws {@link TextMapFormatError} - When file format is invalid and autoFix is false
 */
export async function loadTextMapFiles(
  folderPath: string,
  options: TextMapLoadFileOptions,
): Promise<TextMapLoadFileResult> {
  const { autoFix, language } = options
  const fileNames = getTextMapFileNamesFromLocal(folderPath, language)

  if (fileNames.length === 0) {
    if (autoFix) {
      logger.info(
        `TextMapLoader: TextMap files for ${language} not found. Re downloading...`,
      )
      return { success: false, redownloadLanguage: language }
    }
    throw new AssetNotFoundError(
      Location.textMap(language, `${TextMapBaseName[language]}.json`).resolve(),
    )
  }

  const data = new Map<number, string>()

  for (const fileName of fileNames) {
    const filePath = Location.joinPath(folderPath, fileName)
    const result = await loadSingleTextMapFile(filePath, options)

    if (!result.success) return result

    for (const [textMapHash, textValue] of result.data)
      data.set(textMapHash, textValue)
  }

  return { success: true, data }
}

/**
 * Load a single TextMap file
 * @param filePath - Path to the TextMap file
 * @param options - Load options
 * @returns Load result with data or redownload language
 * @throws {@link TextMapFormatError} - When file format is invalid and autoFix is false
 */
async function loadSingleTextMapFile(
  filePath: string,
  options: TextMapLoadFileOptions,
): Promise<TextMapLoadFileResult> {
  const { autoFix, language, textHashes } = options
  const fileName = Location.getFileName(filePath)

  const data = new Map<number, string>()
  const eventEmitter = new TextMapEmptyWritable()
  eventEmitter.on('data', (entry: TextMapEntry) =>
    data.set(+entry.textMapHash, entry.textValue),
  )

  try {
    await pipeline(
      fs.createReadStream(filePath, { highWaterMark: 1 * 1024 * 1024 }),
      new TextMapTransform(language, textHashes, filePath),
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
 * Get TextMap file names from local directory
 * @param folderPath - Path to TextMap folder
 * @param language - Target language
 * @returns Array of matching file names
 */
function getTextMapFileNamesFromLocal(
  folderPath: string,
  language: Language,
): string[] {
  if (!fs.existsSync(folderPath)) return []

  const baseName = TextMapBaseName[language]
  const pattern = new RegExp(`^${baseName}(_\\d+)?\\.json$`)
  const files = fs.readdirSync(folderPath)

  return files.filter((file) => pattern.test(file)).sort()
}
