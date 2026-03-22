import type { AnchorChange, AnchorCLI } from '@scripts/cli/AnchorCLI'
import type { AnalysisEntry } from '@scripts/processor/AnchorProcessor'
import type { AnchorMergeService } from '@scripts/service/AnchorMergeService'

import type { AnchorFile, AnchorName } from '@/types'

/**
 * Analyze mode - analyzes potential changes without saving
 */
export class AnalyzeMode {
  /**
   * Create a new AnalyzeMode
   * @param cli - Anchor CLI for UI control
   * @param anchorMergeService - Service for merging anchors
   * @param commitId - source commit ID
   */
  constructor(
    private readonly cli: AnchorCLI,
    private readonly anchorMergeService: AnchorMergeService,
    private readonly commitId: string,
  ) {}

  /**
   * Run analyze mode
   * @param analysisMap - map of anchor name to analysis entry
   */
  public async run(analysisMap: Map<AnchorName, AnalysisEntry>): Promise<void> {
    const { anchorFiles, changes } = await this.analyzeChanges(analysisMap)

    this.cli.showHighExclusionFiles(anchorFiles)
    this.cli.showChangesFromExisting(changes)
    this.cli.showSummary(anchorFiles, 'analyze')
    this.cli.saveReport(anchorFiles, changes, 'analyze')
    this.cli.outro('Analysis complete')
  }

  /**
   * Analyze changes from existing files
   * @param analysisMap - map of anchor name to analysis entry
   * @returns anchor files and changes
   */
  private async analyzeChanges(
    analysisMap: Map<AnchorName, AnalysisEntry>,
  ): Promise<{
    anchorFiles: AnchorFile[]
    changes: AnchorChange[]
  }> {
    const generatedDate = new Date()

    const results = await this.cli.runTasks(
      'Analyzing',
      [...analysisMap.entries()],
      ([name, entry]): [AnchorFile, AnchorChange | null] => {
        const { data, anchorSet, crossFileAnchors } = entry

        const resolvedKeys = new Set(crossFileAnchors.map((a) => a.correctKey))
        const excludedKeys = anchorSet.excludedKeys.filter(
          (key) => !resolvedKeys.has(key),
        )

        let anchors = anchorSet.anchors
        let finalCrossFileAnchors = crossFileAnchors
        let change: AnchorChange | null = null

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

        return [anchorFile, change]
      },
      ([name]) => name,
    )

    const anchorFiles = results.map(([file]) => file)
    const changes = results
      .map(([, change]) => change)
      .filter((c): c is AnchorChange => c !== null)

    return { anchorFiles, changes }
  }
}
