import { anchorMap } from '@/generated/anchorMap'
import type { AnchorFile, AnchorName } from '@/types'

/**
 * Load anchor file from static map
 * @param name - anchor name to load
 * @returns loaded anchor file
 * @throws {Error} - If anchor file not found
 */
export function loadAnchor(name: AnchorName): AnchorFile {
  const anchor = anchorMap[name]

  if (anchor === undefined) throw new Error(`Anchor file not found: ${name}`)

  return anchor
}
