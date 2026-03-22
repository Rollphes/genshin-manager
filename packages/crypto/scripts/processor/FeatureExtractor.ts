import type { AnchorCLI } from '@scripts/cli/AnchorCLI'

import { PathFeatures } from '@/feature/PathFeatures'
import { FlatEntries } from '@/flatten/FlatEntries'
import type { AnchorName, FileFeatures } from '@/types'
import type { JsonObject } from '@/types/json'

/**
 * Extracts features from JSON data
 */
export class FeatureExtractor {
  /**
   * Create a new FeatureExtractor
   * @param cli - Anchor CLI for task execution
   */
  constructor(private readonly cli: AnchorCLI) {}

  /**
   * Extract features from all data
   * @param dataMap - map of anchor name to JSON data
   * @returns map of anchor name to file features
   */
  public async extractAll(
    dataMap: Map<AnchorName, JsonObject[]>,
  ): Promise<Map<AnchorName, FileFeatures>> {
    const entries = await this.cli.runTasks(
      'Extracting features',
      [...dataMap.entries()],
      ([name, data]): Promise<[AnchorName, FileFeatures]> => {
        const features = data.map((element) => {
          const { entries } = new FlatEntries(element)
          return new PathFeatures(entries).features
        })
        return Promise.resolve([name, features])
      },
      ([name]) => name,
    )
    return new Map(entries)
  }
}
