import * as path from 'node:path'

import type { FormatItem } from '@genshin-manager/cli'
import { BaseCLI } from '@genshin-manager/cli'
import type { Commit } from '@genshin-manager/rest'

import type { AnchorFile, AnchorName } from '@/types'
import { AnchorNames } from '@/types'

/**
 * Generation mode
 */
export type Mode = 'full' | 'preserve' | 'analyze'

/**
 * Changes from existing anchor file
 */
export interface AnchorChange {
  /** Anchor name */
  anchorName: AnchorName
  /** Preserved keys from existing file */
  preserved: string[]
  /** Lost keys (corrections that could not be preserved) */
  lost: string[]
}

/**
 * Selected options from anchor CLI
 */
export interface AnchorOptions {
  /** Selected commit SHA */
  commit: string
  /** Generation mode */
  mode: Mode
  /** Selected anchor names */
  anchorNames: AnchorName[]
}

/**
 * CLI for anchor generation.
 * Handles all user interaction and display via @clack/prompts.
 */
export class AnchorCLI extends BaseCLI {
  protected readonly logsDir = path.resolve(__dirname, '../logs')
  protected readonly operationName = 'Anchor Operation'

  /**
   * Show intro message
   */
  public override intro(): void {
    super.intro(this.operationName)
  }

  /**
   * Select generation options (commit, mode, and files)
   * @param commits - array of commits (latest first)
   * @returns selected options or null if cancelled
   */
  public async selectOptions(commits: Commit[]): Promise<AnchorOptions | null> {
    const allAnchorNames = Object.values(AnchorNames)

    const result = await this.group(
      {
        mode: () =>
          this.select({
            message: 'Select mode',
            options: [
              {
                value: 'full',
                label: 'Full regeneration',
                hint: 'Regenerate all anchors (overwrites corrections)',
              },
              {
                value: 'preserve',
                label: 'Preserve corrections',
                hint: 'Keep existing correctKey/ancestorKeys where possible',
              },
              {
                value: 'analyze',
                label: 'Analyze only',
                hint: 'Show detailed stats without writing',
              },
            ],
          }),
        commit: () => this.selectCommit(commits),
        anchorScope: () => this.selectScope('anchors', allAnchorNames.length),
        anchorNames: ({ results }) => {
          if (results.anchorScope === 'all')
            return Promise.resolve(allAnchorNames)

          return this.multiselect({
            message: 'Select anchor(s)',
            options: allAnchorNames.map((name) => ({
              value: name as string,
              label: name,
            })),
            required: true,
          })
        },
      },
      {
        onCancel: () => {
          this.cancel('Cancelled')
          process.exit(0)
        },
      },
    )

    return {
      commit: result.commit,
      mode: result.mode as Mode,
      anchorNames: result.anchorNames as AnchorName[],
    }
  }

  /**
   * Show high exclusion files warning
   * @param anchorFiles - anchor files
   */
  public showHighExclusionFiles(anchorFiles: AnchorFile[]): void {
    const children = this.createExcludedItems(anchorFiles)

    if (children.length === 0) return

    this.note({ label: 'Excluded keys', children })
  }

  /**
   * Show files with changes from existing
   * @param changes - array of preserved/lost changes per file
   */
  public showChangesFromExisting(changes: AnchorChange[]): void {
    const children = this.createChangeItems(changes)

    if (children.length === 0) return

    this.note({ label: 'Changes from existing anchor files', children })
  }

  /**
   * Show summary
   * @param anchorFiles - anchor files
   * @param mode - generation mode
   */
  public showSummary(anchorFiles: AnchorFile[], mode: Mode): void {
    this.note({
      label: 'Summary',
      children: this.createSummaryItems(anchorFiles, mode),
    })
  }

  /**
   * Save detailed report to log file
   * @param anchorFiles - anchor files
   * @param changes - array of preserved/lost changes per file
   * @param mode - generation mode
   * @returns log file path
   */
  public saveReport(
    anchorFiles: AnchorFile[],
    changes: AnchorChange[],
    mode: Mode,
  ): string {
    return this.saveReportToFile({
      label: `=== ${this.operationName} Report ===`,
      children: [
        {
          label: 'Summary',
          children: this.createSummaryItems(anchorFiles, mode),
        },
        {
          label: 'Excluded Keys',
          children: this.createExcludedItems(anchorFiles),
        },
        {
          label: 'Changes from Existing',
          children: this.createChangeItems(changes),
        },
      ],
    })
  }

  /**
   * Confirm overwrite operation
   * @returns true if user confirms
   */
  public async confirmOverwrite(): Promise<boolean> {
    return this.confirm('Full mode will overwrite all corrections. Continue?')
  }

  /**
   * Create summary items
   * @param anchorFiles - anchor files
   * @param mode - generation mode
   * @returns format items
   */
  private createSummaryItems(
    anchorFiles: AnchorFile[],
    mode: Mode,
  ): FormatItem[] {
    return [
      { label: 'Date:', value: new Date().toISOString() },
      { label: 'Mode:', value: mode },
      { label: 'Source Commit:', value: anchorFiles[0]?.metadata.commitId },
      { label: 'Total:', value: String(anchorFiles.length) },
      {
        label: 'Elements:',
        value: String(
          anchorFiles.reduce((sum, f) => sum + f.metadata.totalElements, 0),
        ),
      },
      {
        label: 'Anchors:',
        value: String(
          anchorFiles.reduce((sum, f) => sum + f.anchors.length, 0),
        ),
      },
      {
        label: 'Cross File Anchors:',
        value: String(
          anchorFiles.reduce((sum, f) => sum + f.crossFileAnchors.length, 0),
        ),
      },
      {
        label: 'Excluded Keys:',
        value: String(
          anchorFiles.reduce((sum, f) => sum + f.excludedKeys.length, 0),
        ),
      },
    ]
  }

  /**
   * Create format items for excluded keys
   * @param anchorFiles - anchor files
   * @returns format items
   */
  private createExcludedItems(anchorFiles: AnchorFile[]): FormatItem[] {
    return anchorFiles
      .filter((f) => f.excludedKeys.length > 0)
      .map((f) => ({
        label: `${f.metadata.sourceFile}:`,
        value: `Excluded ${String(f.excludedKeys.length)} keys`,
        children: f.excludedKeys.map((key) => ({ label: key })),
      }))
  }

  /**
   * Create format items for anchor changes
   * @param changes - anchor changes
   * @returns format items
   */
  private createChangeItems(changes: AnchorChange[]): FormatItem[] {
    return changes
      .filter((c) => c.preserved.length > 0 || c.lost.length > 0)
      .map((c) => {
        const children: FormatItem[] = []
        if (c.preserved.length > 0) {
          children.push({
            label: '✓ Preserve:',
            value: `${String(c.preserved.length)} keys`,
            children: c.preserved.map((key) => ({ label: key })),
          })
        }
        if (c.lost.length > 0) {
          children.push({
            label: '✗ Lost:',
            value: `${String(c.lost.length)} keys`,
            children: c.lost.map((key) => ({ label: key })),
          })
        }
        return { label: `${c.anchorName}:`, children }
      })
  }
}
