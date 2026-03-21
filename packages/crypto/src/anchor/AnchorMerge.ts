import { AnchorSet } from '@/anchor/AnchorSet'
import type { Anchor, FeatureKey, PathSegment } from '@/types'

/**
 * Represents the result of merging new anchors with existing corrections.
 *
 * Uses feature (pattern + value) matching to identify anchors
 * and preserve user-corrected correctKey/ancestorKeys values.
 * Handles anchor movement between anchors and crossFileAnchors.
 */
export class AnchorMerge {
  /** Merged anchors with preserved corrections */
  public readonly anchors: Anchor[]

  /** Merged cross-file anchors with preserved corrections */
  public readonly crossFileAnchors: Anchor[]

  /** Keys that were preserved from existing */
  public readonly preserved = new Set<PathSegment>()

  /** Keys that were lost (not present in merged result) */
  public readonly lost = new Set<PathSegment>()

  /**
   * Create a new AnchorMerge instance
   * @param newAnchors - newly generated anchors
   * @param newAnchors.anchors - single-file anchors
   * @param newAnchors.crossFileAnchors - cross-file anchors
   * @param existingAnchors - existing anchors with potential corrections
   * @param existingAnchors.anchors - existing single-file anchors
   * @param existingAnchors.crossFileAnchors - existing cross-file anchors
   */
  constructor(
    newAnchors: { anchors: Anchor[]; crossFileAnchors: Anchor[] },
    existingAnchors: { anchors: Anchor[]; crossFileAnchors: Anchor[] },
  ) {
    // Build map of ALL existing anchors by feature key
    const existingMap = new Map(
      [...existingAnchors.anchors, ...existingAnchors.crossFileAnchors].map(
        (anchor) =>
          [
            AnchorSet.createFeatureKey(
              anchor.feature.values[0],
              anchor.feature.pattern,
            ),
            anchor,
          ] as const,
      ),
    )

    // Merge both anchor types
    this.anchors = this.mergeAnchors(newAnchors.anchors, existingMap)
    this.crossFileAnchors = this.mergeAnchors(
      newAnchors.crossFileAnchors,
      existingMap,
    )

    // Find lost corrections (existing keys not in merged result)
    const allMergedKeys = new Set([
      ...this.anchors.map((a) => a.correctKey),
      ...this.crossFileAnchors.map((a) => a.correctKey),
    ])
    ;[...existingAnchors.anchors, ...existingAnchors.crossFileAnchors]
      .filter((anchor) => !allMergedKeys.has(anchor.correctKey))
      .forEach((anchor) => this.lost.add(anchor.correctKey))
  }

  /**
   * Merge anchors with existing corrections
   * @param newAnchors - new anchors to merge
   * @param existingMap - map of existing anchors by feature key
   * @returns merged anchors with preserved corrections
   */
  private mergeAnchors(
    newAnchors: Anchor[],
    existingMap: Map<FeatureKey, Anchor>,
  ): Anchor[] {
    return newAnchors.map((newAnchor) => {
      const key = AnchorSet.createFeatureKey(
        newAnchor.feature.values[0],
        newAnchor.feature.pattern,
      )
      const existing = existingMap.get(key)

      if (existing) {
        const hasCorrection =
          existing.correctKey !== newAnchor.correctKey ||
          JSON.stringify(existing.ancestorKeys) !==
            JSON.stringify(newAnchor.ancestorKeys)

        if (hasCorrection) {
          this.preserved.add(existing.correctKey)
          return {
            ...newAnchor,
            correctKey: existing.correctKey,
            ancestorKeys: existing.ancestorKeys,
          }
        }
      }

      return newAnchor
    })
  }
}
