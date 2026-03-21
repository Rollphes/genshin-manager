import * as fs from 'node:fs'
import * as path from 'node:path'

import * as p from '@clack/prompts'

import { ReportFormatter } from '@/ReportFormatter'
import type { FormatItem } from '@/types'

/**
 * Base CLI class with common utilities.
 * Provides @clack/prompts wrapper and report formatting.
 */
export abstract class BaseCLI {
  private static readonly formatter = new ReportFormatter()

  /** Log methods (info, error, step, etc.) */
  public readonly log = p.log

  /** Show cancellation message */
  public readonly cancel = p.cancel

  /** Show select prompt */
  public readonly select = p.select

  /** Show multiselect prompt */
  public readonly multiselect = p.multiselect

  /** Show grouped prompts */
  public readonly group = p.group

  /** Directory for log files */
  protected abstract readonly logsDir: string

  /** Operation name for display (e.g., 'Schema Generation', 'Anchor Generation') */
  protected abstract readonly operationName: string

  /**
   * Show intro message
   * @param message - intro message
   */
  public intro(message: string): void {
    p.intro(message)
  }

  /**
   * Show outro message
   * @param message - outro message
   */
  public outro(message: string): void {
    p.outro(message)
  }

  /**
   * Show a note with formatted item
   * @param item - format item to display (uses item.label as note title)
   */
  public note(item: FormatItem): void {
    if (!item.children || item.children.length === 0) return

    const lines = BaseCLI.formatter.formatItems(item.children)
    p.note(lines.join('\n'), item.label)
  }

  /**
   * Show confirmation prompt
   * @param message - confirmation message
   * @returns true if user confirms
   */
  public async confirm(message: string): Promise<boolean> {
    const result = await p.confirm({ message })
    return result === true
  }

  /**
   * Select a commit from list
   * @param commits - array of commits (latest first)
   * @returns selected commit value
   */
  public selectCommit(
    commits: {
      id?: string | null
      short_id?: string | null
      title?: string | null
    }[],
  ): Promise<string | symbol> {
    return this.select({
      message: 'Select commit',
      options: commits.map((commit, index) => ({
        value: commit.id ?? '',
        label:
          index === 0
            ? `${commit.short_id ?? ''} (latest)`
            : (commit.short_id ?? ''),
        hint: commit.title ?? '',
      })),
    })
  }

  /**
   * Select scope (all or specific)
   * @param label - label for the scope (e.g., "anchors", "schemas")
   * @param count - total count of items
   * @returns selected scope value
   */
  public selectScope(label: string, count: number): Promise<string | symbol> {
    return this.select({
      message: `Select ${label} scope`,
      options: [
        {
          value: 'all',
          label: `All ${label}`,
          hint: `All ${String(count)} ${label}`,
        },
        { value: 'select', label: `Select specific ${label}` },
      ],
    })
  }

  /**
   * Run tasks with spinner progress display
   * @param label - label for the spinner (e.g., "Loading files")
   * @param items - items to process
   * @param taskFn - function to run for each item (sync or async)
   * @param titleFn - function to generate task title from item
   * @returns array of results
   */
  public async runTasks<T, R>(
    label: string,
    items: T[],
    taskFn: (item: T) => R | Promise<R>,
    titleFn: (item: T) => string,
  ): Promise<R[]> {
    const results: R[] = []
    const s = p.spinner({
      indicator: 'timer',
      cancelMessage: `${label} cancelled`,
      errorMessage: `${label} failed`,
    })
    s.start(`${label}...`)

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      s.message(
        `${label}: ${titleFn(item)} (${String(i + 1)}/${String(items.length)})`,
      )
      const result = await taskFn(item)
      results.push(result)
    }

    s.stop(`${label}: ${String(items.length)} completed`)
    return results
  }

  /**
   * Save formatted item to log file
   * @param item - format item to save
   * @returns log file path
   */
  protected saveReportToFile(item: FormatItem): string {
    fs.mkdirSync(this.logsDir, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const logPath = path.resolve(this.logsDir, `report-${timestamp}.log`)

    fs.writeFileSync(logPath, BaseCLI.formatter.format(item).join('\n'))
    this.log.info(`Report saved: ${logPath}`)

    return logPath
  }
}
