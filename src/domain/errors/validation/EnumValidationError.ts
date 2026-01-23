import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import { ErrorContextFactory } from '@/domain/errors/base/ErrorContext'
import { ValidationError } from '@/domain/errors/validation/ValidationError'
import type { EnumContext } from '@/domain/types/errorContext'

/**
 * Enum validation error
 */
export class EnumValidationError extends ValidationError {
  public readonly errorCode = GenshinManagerErrorCode.GmValidationEnum

  /**
   * Data source where the error occurred (e.g., 'MonsterExcelConfigData')
   */
  public readonly source?: string

  /**
   * Record ID within the data source
   */
  public readonly recordId?: string | number

  /**
   * JSON path to the property
   */
  public readonly path?: string

  /**
   * Constructor for EnumValidationError
   * @param value - The invalid value
   * @param allowedValues - Array of allowed values
   * @param enumName - Name of the enum being validated
   * @param enumContext - Structured context for locating the error
   * @param cause - Original error
   */
  constructor(
    value: unknown,
    allowedValues: unknown[],
    enumName = 'value',
    enumContext?: EnumContext,
    cause?: Error,
  ) {
    const allowedStr = allowedValues.map(String).join(', ')
    const locationPrefix =
      EnumValidationError.buildEnumLocationPrefix(enumContext)
    const message = `${locationPrefix}${enumName} must be one of: ${allowedStr}, got ${String(value)}`

    const baseContext = ErrorContextFactory.createValidationContext(
      enumContext?.path ?? enumName,
      `one of: ${allowedStr}`,
      value,
    )

    // Merge with source information if available
    const errorContext = enumContext?.source
      ? {
          ...baseContext,
          metadata: {
            source: enumContext.source,
            recordId: enumContext.recordId,
          },
        }
      : baseContext

    super(message, errorContext, undefined, cause)

    this.source = enumContext?.source
    this.recordId = enumContext?.recordId
    this.path = enumContext?.path
  }

  /**
   * Build location prefix from EnumContext
   * Format: [Source#RecordId.Path] or [Source.Path] or [Path] or ''
   * @param context - Enum context
   * @returns Location prefix string
   */
  private static buildEnumLocationPrefix(context?: EnumContext): string {
    if (!context) return ''

    const parts: string[] = []

    if (context.source) {
      let sourcePart = context.source
      if (context.recordId !== undefined)
        sourcePart += `#${String(context.recordId)}`

      parts.push(sourcePart)
    }

    if (context.path) parts.push(context.path)

    if (parts.length === 0) return ''

    return `[${parts.join('.')}] `
  }
}
