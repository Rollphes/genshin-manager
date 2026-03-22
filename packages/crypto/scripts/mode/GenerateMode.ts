import { buildErrorResult, buildOkResult } from '@genshin-manager/cli'
import type {
  AnchorChange,
  AnchorCLI,
  AnchorResult,
} from '@scripts/cli/AnchorCLI'
import type { AnalysisEntry } from '@scripts/processor/AnchorProcessor'
import type { AnchorFileWriter } from '@scripts/writer/AnchorFileWriter'
import type { AnchorMapWriter } from '@scripts/writer/AnchorMapWriter'

import { AnchorMerge } from '@/anchor/AnchorMerge'
import { loadAnchor } from '@/io/loadAnchor'
import type { Anchor, AnchorFile, AnchorName } from '@/types'

/**
 * Generate mode - generates anchor files with optional preservation
 */
export class GenerateMode {
  /**
   * Create a new GenerateMode
   * @param cli - Anchor CLI for UI control
   * @param anchorFileWriter - Anchor file writer
   * @param anchorMapWriter - Anchor map writer
   * @param commitId - source commit ID
   * @param isOverwrite - true for full overwrite, false for preserve mode
   */
  constructor(
    private readonly cli: AnchorCLI,
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
            const mergeResult = this.mergeWithExisting(
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
              generatedAt: new Date().toISOString(),
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

    const okResults = results.filter(
      (r): r is Extract<AnchorResult, { status: 'ok' }> => r.status === 'ok',
    )

    const anchorFiles = okResults.map((r) => r.data.anchorFile)
    const changes = okResults
      .map((r) => r.data.change)
      .filter((c): c is AnchorChange => c !== null)

    return { anchorFiles, changes }
  }

  /**
   * Merge new anchors with existing file
   * @param name - anchor name
   * @param newAnchors - newly generated anchors
   * @param newCrossFileAnchors - newly generated cross-file anchors
   * @returns merged result or null if no existing file
   */
  private mergeWithExisting(
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
      // File not found - will generate new
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
