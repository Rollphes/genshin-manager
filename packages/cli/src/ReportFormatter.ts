import type { FormatItem } from '@/types'

/**
 * Formatter for CLI report output.
 * Handles label-value alignment and nested structures.
 */
export class ReportFormatter {
  private static readonly TAB_WIDTH = 4
  private static readonly MIN_GAP = 2

  /**
   * Format a FormatItem tree
   * @param item - root format item
   * @returns formatted lines
   */
  public format(item: FormatItem): string[] {
    const maxDepth = this.calculateMaxDepth([item])

    // Pre-calculate pad widths for all depths
    const padWidths = new Map<number, number>()
    for (let depth = 0; depth <= maxDepth; depth++)
      padWidths.set(depth, this.calculatePadWidth([item], depth))

    return this.formatItemsWithPadWidths([item], 0, padWidths)
  }

  /**
   * Format an array of FormatItems (for note display)
   * @param items - items to format
   * @returns formatted lines
   */
  public formatItems(items: FormatItem[]): string[] {
    const maxDepth = this.calculateMaxDepth(items)

    // Pre-calculate pad widths for all depths
    const padWidths = new Map<number, number>()
    for (let depth = 0; depth <= maxDepth; depth++)
      padWidths.set(depth, this.calculatePadWidth(items, depth))

    return this.formatItemsWithPadWidths(items, 0, padWidths)
  }

  /**
   * Collect items from nested structure at target depth
   * @param items - items to traverse
   * @param currentDepth - current depth level
   * @param targetDepth - target depth level
   * @returns items at target depth
   */
  private collectFromItems(
    items: FormatItem[],
    currentDepth: number,
    targetDepth: number,
  ): FormatItem[] {
    if (currentDepth === targetDepth) return items

    return items.flatMap((item) =>
      item.children
        ? this.collectFromItems(item.children, currentDepth + 1, targetDepth)
        : [],
    )
  }

  /**
   * Calculate pad width for a specific depth
   * @param items - root items
   * @param depth - depth level
   * @returns pad width in characters
   */
  private calculatePadWidth(items: FormatItem[], depth: number): number {
    const collected = this.collectFromItems(items, 0, depth)
    if (collected.length === 0) return 0

    const indent = depth * ReportFormatter.TAB_WIDTH
    const prefix = depth > 0 ? '- ' : ''
    const maxLabelLen = Math.max(...collected.map((i) => i.label.length))

    return (
      (Math.floor(
        (indent + prefix.length + maxLabelLen + ReportFormatter.MIN_GAP) /
          ReportFormatter.TAB_WIDTH,
      ) +
        1) *
      ReportFormatter.TAB_WIDTH
    )
  }

  /**
   * Calculate max depth of items recursively
   * @param items - items to check
   * @param current - current depth
   * @returns max depth
   */
  private calculateMaxDepth(items: FormatItem[], current = 0): number {
    const itemsWithChildren = items.filter(
      (i): i is FormatItem & { children: FormatItem[] } =>
        i.children !== undefined && i.children.length > 0,
    )

    if (itemsWithChildren.length === 0) return current

    return Math.max(
      ...itemsWithChildren.map((i) =>
        this.calculateMaxDepth(i.children, current + 1),
      ),
    )
  }

  /**
   * Format items with pre-calculated pad widths
   * @param items - items to format
   * @param depth - current depth
   * @param padWidths - pre-calculated pad widths by depth
   * @returns formatted lines
   */
  private formatItemsWithPadWidths(
    items: FormatItem[],
    depth: number,
    padWidths: Map<number, number>,
  ): string[] {
    const indent = depth * ReportFormatter.TAB_WIDTH
    const indentStr = ' '.repeat(indent)
    const prefix = depth > 0 ? '- ' : ''
    const padTo = padWidths.get(depth) ?? indent + prefix.length

    const lines: string[] = []
    for (const item of items) {
      const value = item.value ?? ''
      lines.push(
        `${indentStr}${prefix}${item.label.padEnd(padTo - indent - prefix.length)}${value}`,
      )
      if (item.children && item.children.length > 0) {
        lines.push(
          ...this.formatItemsWithPadWidths(item.children, depth + 1, padWidths),
        )
      }
    }
    return lines
  }
}
