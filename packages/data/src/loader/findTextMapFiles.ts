import type { Language } from '@genshin-manager/core'
import { logger } from '@genshin-manager/core'

import { AssetNotFoundError } from '@/errors/AssetNotFoundError'
import { FileLocation } from '@/paths/FileLocation'

/**
 * Result type for findTextMapFiles
 */
export type FindTextMapFilesResult =
  | { readonly success: true; readonly locations: readonly FileLocation[] }
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
 * Find TextMap file locations for specified language
 *
 * Responsibilities:
 * - Detect TextMap files in folder (supports split files like TextMapEN_0.json)
 * - Return FileLocation array on success
 * - Return redownload flag when autoFix=true and files not found
 * - Throw AssetNotFoundError when autoFix=false and files not found
 *
 * @param options - Find options
 * @returns Find result with locations or redownload flag
 * @throws {@link AssetNotFoundError} - When files not found and autoFix is false
 */
export function findTextMapFiles(
  options: FindTextMapFilesOptions,
): FindTextMapFilesResult {
  const { language, autoFix } = options
  const locations = FileLocation.textMapFiles(language)

  if (locations.length === 0) {
    if (autoFix) {
      logger.info(
        `findTextMapFiles: TextMap files for ${language} not found. Re downloading...`,
      )
      return { success: false, redownloadLanguage: language }
    }
    throw new AssetNotFoundError(FileLocation.textMapFolder())
  }

  return { success: true, locations }
}
