import type { AnchorCLI } from '@scripts/cli/AnchorCLI'

import { AnchorSet } from '@/anchor/AnchorSet'
import { CrossFileAnalysis } from '@/anchor/CrossFileAnalysis'
import type { Anchor, AnchorName, FileFeatures } from '@/types'
import type { JsonObject } from '@/types/json'

/**
 * Analysis entry for a single file
 */
export interface AnalysisEntry {
  /** Raw JSON data */
  data: JsonObject[]
  /** Anchor set for this file */
  anchorSet: AnchorSet
  /** Cross-file anchors that apply to this file */
  crossFileAnchors: Anchor[]
}

/**
 * Processes anchor analysis
 */
export class AnchorProcessor {
  /**
   * Create a new AnchorProcessor
   * @param cli - Anchor CLI for task execution
   */
  constructor(private readonly cli: AnchorCLI) {}

  /**
   * Build analysis map from data and features
   * @param dataMap - map of anchor name to JSON data
   * @param featuresMap - map of anchor name to file features
   * @returns map of anchor name to analysis entry
   */
  public async buildAnalysis(
    dataMap: Map<AnchorName, JsonObject[]>,
    featuresMap: Map<AnchorName, FileFeatures>,
  ): Promise<Map<AnchorName, AnalysisEntry>> {
    const crossFileAnalysis = new CrossFileAnalysis(featuresMap)

    const entries = await this.cli.runTasks(
      'Building anchorSet & cross-file analysis',
      [...dataMap.entries()],
      ([name, data]): Promise<[AnchorName, AnalysisEntry]> => {
        const anchorSet = new AnchorSet(featuresMap.get(name) ?? [])
        return Promise.resolve([
          name,
          {
            data,
            anchorSet,
            crossFileAnchors: crossFileAnalysis
              .getCrossFileAnchors(anchorSet.excludedKeys)
              .map((cfa) => CrossFileAnalysis.toAnchor(cfa)),
          },
        ])
      },
      ([name]) => name,
    )
    return new Map(entries)
  }
}
