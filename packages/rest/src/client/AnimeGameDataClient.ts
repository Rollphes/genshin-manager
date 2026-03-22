import { GitLabClient } from '@/client/GitLabClient'

/**
 * Client for AnimeGameData GitLab repository.
 * Provides convenient methods for fetching ExcelBinOutput files.
 */
export class AnimeGameDataClient extends GitLabClient {
  private static readonly PROJECT_ID = 53216109
  private static readonly EXCEL_BIN_OUTPUT_DIR = 'ExcelBinOutput'

  /**
   * Creates a new AnimeGameDataClient instance.
   */
  constructor() {
    super(AnimeGameDataClient.PROJECT_ID)
  }

  /**
   * Fetch a file from ExcelBinOutput directory.
   * @param fileName - file name without extension (e.g., "AvatarExcelConfigData")
   * @param ref - branch, tag, or commit SHA
   * @returns raw file contents as string
   * @throws - HttpError if the request fails
   */
  public async fetchExcelBinOutput(
    fileName: string,
    ref?: string,
  ): Promise<string> {
    return this.fetchRawFile(
      `${AnimeGameDataClient.EXCEL_BIN_OUTPUT_DIR}/${fileName}.json`,
      ref,
    )
  }

  // TODO: fetch TextMap
  // tip: TextMap is split into multiple files (e.g., TextMapRU_0.json, TextMapRU_1.json, TextMapEN.json etc.) and needs to be merged together
}
