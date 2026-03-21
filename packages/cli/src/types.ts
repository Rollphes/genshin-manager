/**
 * Format item for label-value alignment
 */
export interface FormatItem {
  /** Label text (left side) */
  label: string
  /** Value text (right side, optional) */
  value?: string
  /** Nested children items */
  children?: FormatItem[]
}
