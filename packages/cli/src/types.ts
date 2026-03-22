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

/**
 * Successful operation result
 */
export interface OperationResultOk<TData = void> {
  /** Result status */
  readonly status: 'ok'
  /** Optional success data */
  readonly data?: TData
  /** Optional warning messages */
  readonly warnings?: readonly string[]
}

/**
 * Skipped operation result
 */
export interface OperationResultSkip {
  /** Result status */
  readonly status: 'skip'
  /** Reason for skipping */
  readonly reason: string
}

/**
 * Failed operation result
 */
export interface OperationResultError {
  /** Result status */
  readonly status: 'error'
  /** Error instance */
  readonly error: Error
}

/**
 * Standard result type for all script operations
 * @template TData - Success data type
 */
export type OperationResult<TData = void> =
  | OperationResultOk<TData>
  | OperationResultSkip
  | OperationResultError
