import type { AnimeGameDataClient } from '@genshin-manager/rest'
import type { AnchorCLI } from '@scripts/cli/AnchorCLI'

import type { AnchorName } from '@/types'
import type { JsonObject } from '@/types/json'

/**
 * Loads encrypted data from GitLab
 */
export class DataLoader {
  /**
   * Create a new DataLoader
   * @param client - AnimeGameData API client
   * @param cli - Anchor CLI for task execution
   */
  constructor(
    private readonly client: AnimeGameDataClient,
    private readonly cli: AnchorCLI,
  ) {}

  /**
   * Load all files from GitLab
   * @param anchorNames - list of anchor names to load
   * @param ref - commit SHA or branch name (optional)
   * @returns map of anchor name to data
   */
  public async loadAll(
    anchorNames: AnchorName[],
    ref?: string,
  ): Promise<Map<AnchorName, JsonObject[]>> {
    const entries = await this.cli.runTasks(
      'Loading files',
      anchorNames,
      async (name): Promise<[AnchorName, JsonObject[]]> => {
        const raw = await this.client.fetchExcelBinOutput(name, ref)
        return [name, JSON.parse(raw) as JsonObject[]]
      },
      (name) => name,
    )
    return new Map(entries)
  }
}
