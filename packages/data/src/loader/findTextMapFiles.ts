import type { Language } from '@genshin-manager/core'
import { logger, TextMapBaseName } from '@genshin-manager/core'
import fs from 'fs'

import { AssetNotFoundError } from '@/errors/AssetNotFoundError'
import { Location } from '@/paths/Location'

/**
 * Result type for findTextMapFiles
 */
export type FindTextMapFilesResult =
  | { readonly success: true; readonly locations: readonly Location[] }
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
 * Find TextMap file Locations for specified language
 *
 * Responsibilities:
 * - Detect TextMap files in folder (supports split files like TextMapEN_0.json)
 * - Return Location array on success
 * - Return redownload flag when autoFix=true and files not found
 * - Throw AssetNotFoundError when autoFix=false and files not found
 *
 * @param options - Find options
 * @returns Find result with Locations or redownload flag
 * @throws {@link AssetNotFoundError} - When files not found and autoFix is false
 */
export function findTextMapFiles(
  options: FindTextMapFilesOptions,
): FindTextMapFilesResult {
  const { language, autoFix } = options
  const locations = getMatchingLocations(language)

  if (locations.length === 0) {
    if (autoFix) {
      logger.info(
        `findTextMapFiles: TextMap files for ${language} not found. Re downloading...`,
      )
      return { success: false, redownloadLanguage: language }
    }
    throw new AssetNotFoundError(
      Location.textMap(language, `${TextMapBaseName[language]}.json`),
    )
  }

  return { success: true, locations }
}

/**
 * Get matching TextMap Locations for a language
 * @param language - Target language
 * @returns Array of Locations, sorted by file name
 */
function getMatchingLocations(language: Language): Location[] {
  const folderPath = Location.textMapFolderPath
  if (!fs.existsSync(folderPath)) return []

  const baseName = TextMapBaseName[language]
  const pattern = new RegExp(`^${baseName}(_\\d+)?\\.json$`)

  const entries = fs.readdirSync(folderPath)
  const matchingFiles = entries.filter((name) => pattern.test(name)).sort()

  return matchingFiles.map((fileName) => Location.textMap(language, fileName))
}
