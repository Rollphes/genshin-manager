import { AnchorMerge } from '@/anchor/AnchorMerge'
import { loadAnchor } from '@/io/loadAnchor'
import type { Anchor, AnchorFile, AnchorName } from '@/types'

/**
 * Service for merging new anchors with existing anchor files
 */
export class AnchorMergeService {
  /**
   * Merge new anchors with existing anchor file
   * @param name - anchor name
   * @param newAnchors - new anchors to merge
   * @param newCrossFileAnchors - new cross-file anchors to merge
   * @returns merge result or null if no existing file
   */
  public mergeWithExisting(
    name: AnchorName,
    newAnchors: Anchor[],
    newCrossFileAnchors: Anchor[],
  ): {
    anchors: Anchor[]
    crossFileAnchors: Anchor[]
    preserved: Set<string>
    lost: Set<string>
  } | null {
    let existingFile: AnchorFile
    try {
      existingFile = loadAnchor(name)
    } catch {
      return null
    }

    const merge = new AnchorMerge(
      { anchors: newAnchors, crossFileAnchors: newCrossFileAnchors },
      {
        anchors: existingFile.anchors,
        crossFileAnchors: existingFile.crossFileAnchors,
      },
    )

    return {
      anchors: merge.anchors,
      crossFileAnchors: merge.crossFileAnchors,
      preserved: merge.preserved,
      lost: merge.lost,
    }
  }
}
