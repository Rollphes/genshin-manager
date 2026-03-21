import { anchorMap } from '@/generated/anchorMap'
import type { AnchorFile, AnchorName } from '@/types'

/**
 * Load anchor file from static map
 * @param name - anchor name to load
 * @returns loaded anchor file
 * @throws - Error if anchor file not found
 */
export function loadAnchor(name: AnchorName): AnchorFile {
  return anchorMap[name]
}
