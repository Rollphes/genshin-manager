import { buildErrorResult, buildOkResult } from '@genshin-manager/cli'
import type {
  AnchorChange,
  AnchorCLI,
  AnchorData,
  AnchorResult,
} from '@scripts/cli/AnchorCLI'
import type { AnalysisEntry } from '@scripts/processor/AnchorProcessor'
import type { AnchorMergeService } from '@scripts/service/AnchorMergeService'
import type { AnchorFileWriter } from '@scripts/writer/AnchorFileWriter'
import type { AnchorMapWriter } from '@scripts/writer/AnchorMapWriter'

import type { AnchorFile, AnchorName } from '@/types'

/**
 * Generate mode - generates anchor files with optional preservation
 */
export class GenerateMode {
  /**
   * Create a new GenerateMode
   * @param cli - Anchor CLI for UI control
   * @param anchorMergeService - Service for merging anchors
   * @param anchorFileWriter - Anchor file writer
   * @param anchorMapWriter - Anchor map writer
   * @param commitId - source commit ID
   * @param isOverwrite - true for full overwrite, false for preserve mode
   */
  constructor(
    private readonly cli: AnchorCLI,
    private readonly anchorMergeService: AnchorMergeService,
    private readonly anchorFileWriter: AnchorFileWriter,
    private readonly anchorMapWriter: AnchorMapWriter,
    private readonly commitId: string,
    private readonly isOverwrite: boolean,
  ) {}

  /**
   * Run generate mode
   * @param analysisMap - map of anchor name to analysis entry
   */
  public async run(analysisMap: Map<AnchorName, AnalysisEntry>): Promise<void> {
    const taskTitle = this.isOverwrite
      ? 'Generating Override'
      : 'Generating Preserve'
    const { anchorFiles, changes } = await this.generateAnchorFiles(
      analysisMap,
      taskTitle,
    )

    if (this.isOverwrite) {
      this.cli.showSummary(anchorFiles, 'full')
      this.cli.saveReport(anchorFiles, changes, 'full')
      if (!(await this.cli.confirmOverwrite())) {
        this.cli.outro('Cancelled')
        return
      }
    } else {
      this.cli.showChangesFromExisting(changes)
      this.cli.showSummary(anchorFiles, 'preserve')
      this.cli.saveReport(anchorFiles, changes, 'preserve')
    }

    await this.saveAllFiles(anchorFiles)
    this.cli.outro(
      this.isOverwrite
        ? 'Generation complete'
        : 'Generation complete with preservation',
    )
  }

  /**
   * Generate anchor files from analysis
   * @param analysisMap - map of anchor name to analysis entry
   * @param taskTitle - title for progress display
   * @returns generated anchor files and changes
   */
  private async generateAnchorFiles(
    analysisMap: Map<AnchorName, AnalysisEntry>,
    taskTitle: string,
  ): Promise<{
    anchorFiles: AnchorFile[]
    changes: AnchorChange[]
  }> {
    const generatedDate = new Date()

    const results = await this.cli.runTasks<
      [AnchorName, AnalysisEntry],
      AnchorResult
    >(
      taskTitle,
      [...analysisMap.entries()],
      ([name, entry]): AnchorResult => {
        try {
          const { data, anchorSet, crossFileAnchors } = entry

          const resolvedKeys = new Set(
            crossFileAnchors.map((a) => a.correctKey),
          )
          const excludedKeys = anchorSet.excludedKeys.filter(
            (key) => !resolvedKeys.has(key),
          )

          let anchors = anchorSet.anchors
          let finalCrossFileAnchors = crossFileAnchors
          let change: AnchorChange | null = null

          if (!this.isOverwrite) {
            const mergeResult = this.anchorMergeService.mergeWithExisting(
              name,
              anchorSet.anchors,
              crossFileAnchors,
            )
            if (mergeResult) {
              anchors = mergeResult.anchors
              finalCrossFileAnchors = mergeResult.crossFileAnchors
              change = {
                anchorName: name,
                preserved: [...mergeResult.preserved],
                lost: [...mergeResult.lost],
              }
            }
          }

          const anchorFile: AnchorFile = {
            metadata: {
              sourceFile: name,
              commitId: this.commitId,
              generatedAt: generatedDate.toISOString(),
              totalElements: data.length,
            },
            anchors,
            crossFileAnchors: finalCrossFileAnchors,
            derivedAncestorKeys: anchorSet.derivedAncestorKeys,
            excludedKeys,
          }

          return buildOkResult({
            anchorFile,
            change,
          })
        } catch (error) {
          return buildErrorResult(error)
        }
      },
      ([name]) => name,
    )

    interface OkResult {
      status: 'ok'
      data: AnchorData
    }

    const okResults = results.filter((r): r is OkResult => {
      return r.status === 'ok' && r.data !== undefined
    })

    const anchorFiles = okResults.map((r) => r.data.anchorFile)
    const changes = okResults
      .map((r) => r.data.change)
      .filter((c): c is AnchorChange => c !== null)

    return { anchorFiles, changes }
  }

  /**
   * Save all anchor files and generate anchor map
   * @param anchorFiles - files to save
   */
  private async saveAllFiles(anchorFiles: AnchorFile[]): Promise<void> {
    for (const anchorFile of anchorFiles) {
      await this.anchorFileWriter.save(
        anchorFile.metadata.sourceFile,
        anchorFile,
      )
    }

    await this.anchorMapWriter.write(
      anchorFiles.map((f) => f.metadata.sourceFile),
    )
  }
}
