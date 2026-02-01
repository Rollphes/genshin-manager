import type { Language } from '@genshin-manager/core'
import { logger, TextMapBaseName } from '@genshin-manager/core'
import fs from 'fs'

import { AssetNotFoundError } from '@/errors/AssetNotFoundError'
import { FileLocation } from '@/paths/FileLocation'

/**
 * Result type for findTextMapFiles
 */
export type FindTextMapFilesResult =
  | { readonly success: true; readonly paths: readonly string[] }
  | { readonly success: false; readonly redownloadLanguage: Language }

/**
 * Options for findTextMapFiles
 */
export interface FindTextMapFilesOptions {
  /** Target language */
  readonly language: Language
  /** Whether to return redownload flag instead of throwing when files not found */
  readonly autoFix: boolean
}

/**
 * Find TextMap file paths for specified language
 *
 * Responsibilities:
 * - Detect TextMap files in folder (supports split files like TextMapEN_0.json)
 * - Return path array on success
 * - Return redownload flag when autoFix=true and files not found
 * - Throw AssetNotFoundError when autoFix=false and files not found
 *
 * @param options - Find options
 * @returns Find result with paths or redownload flag
 * @throws {@link AssetNotFoundError} - When files not found and autoFix is false
 */
export function findTextMapFiles(
  options: FindTextMapFilesOptions,
): FindTextMapFilesResult {
  const { language, autoFix } = options
  const paths = getMatchingPaths(language)

  if (paths.length === 0) {
    if (autoFix) {
      logger.info(
        `findTextMapFiles: TextMap files for ${language} not found. Re downloading...`,
      )
      return { success: false, redownloadLanguage: language }
    }
    throw new AssetNotFoundError(
      FileLocation.textMap(language, `${TextMapBaseName[language]}.json`),
    )
  }

  return { success: true, paths }
}

/**
 * Get matching TextMap file paths for a language
 * @param language - Target language
 * @returns Array of file paths, sorted by file name
 */
function getMatchingPaths(language: Language): string[] {
  const folderPath = FileLocation.textMapFolder().resolve()
  if (!fs.existsSync(folderPath)) return []

  const baseName = TextMapBaseName[language]
  const pattern = new RegExp(`^${baseName}(_\\d+)?\\.json$`)

  const entries = fs.readdirSync(folderPath)
  const matchingFiles = entries.filter((name) => pattern.test(name)).sort()

  return matchingFiles.map((fileName) =>
    FileLocation.textMap(language, fileName).resolve(),
  )
}
