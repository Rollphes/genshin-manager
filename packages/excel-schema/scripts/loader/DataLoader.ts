import type { AnchorName } from '@genshin-manager/crypto'
import type { AnimeGameDataClient } from '@genshin-manager/rest'
import type { SchemaCLI } from '@scripts/cli/SchemaCLI'

/**
 * Loads data files from GitLab repository
 */
export class DataLoader {
  /**
   * Create a new DataLoader
   * @param client - AnimeGameData API client
   * @param cli - Schema CLI for progress display
   */
  constructor(
    private readonly client: AnimeGameDataClient,
    private readonly cli: SchemaCLI,
  ) {}

  /**
   * Load all files from GitLab
   * @param anchorNames - list of anchor names to load
   * @param ref - commit SHA or branch name (optional)
   * @returns map of anchor name to raw data
   */
  public async loadAll(
    anchorNames: AnchorName[],
    ref?: string,
  ): Promise<Map<AnchorName, string>> {
    function toTitle(name: AnchorName): string {
      return name
    }
    const entries = await this.cli.runTasks<AnchorName, [AnchorName, string]>(
      'Loading files',
      anchorNames,
      async (name): Promise<[AnchorName, string]> => {
        const raw = await this.client.fetchExcelBinOutput(name, ref)
        return [name, raw]
      },
      toTitle,
    )
    return new Map(entries)
  }
}
