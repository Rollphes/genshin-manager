import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Key matching failure error for encrypted key decoding
 */
export class KeyMatchingError extends GenshinManagerError {
  public readonly errorCode =
    GenshinManagerErrorCode.GM_DECODE_KEY_MATCHING_FAILED

  /**
   * Encrypted keys that failed to match
   */
  public readonly failedKeys: string[]

  /**
   * Expected keys from master file
   */
  public readonly expectedKeys: string[]

  /**
   * Constructor for KeyMatchingError
   * @param sourceFile - Source file being decoded
   * @param failedKeys - Keys that failed to match
   * @param expectedKeys - Expected keys from master file
   * @param context - Additional error context
   */
  constructor(
    sourceFile: string,
    failedKeys: string[],
    expectedKeys: string[],
    context?: ErrorContext,
  ) {
    const message = `Key matching failed for ${sourceFile}. Failed to match ${String(failedKeys.length)} out of ${String(expectedKeys.length)} keys`

    const decodingContext = ErrorContextFactory.createDecodingContext(
      sourceFile,
      undefined,
      'key matching',
    )

    const mergedContext = ErrorContextFactory.merge(context, decodingContext, {
      metadata: {
        failedKeys: failedKeys.slice(0, 10), // Limit to first 10 for readability
        expectedKeys: expectedKeys.slice(0, 10),
        totalFailedKeys: failedKeys.length,
        totalExpectedKeys: expectedKeys.length,
      },
    })

    super(message, mergedContext)

    this.failedKeys = failedKeys
    this.expectedKeys = expectedKeys
  }

  /**
   * Get detailed key matching information
   */
  public getKeyMatchingDetails(): {
    failedKeys: string[]
    expectedKeys: string[]
    unmatchedExpected: string[]
    successRate: number
  } {
    const unmatchedExpected = this.expectedKeys.filter(
      (key) => !this.failedKeys.includes(key),
    )

    const totalKeys = this.expectedKeys.length
    const failedCount = this.failedKeys.length
    const successRate =
      totalKeys > 0 ? (totalKeys - failedCount) / totalKeys : 0

    return {
      failedKeys: this.failedKeys,
      expectedKeys: this.expectedKeys,
      unmatchedExpected,
      successRate,
    }
  }

  /**
   * Get suggestions for troubleshooting
   */
  public getTroubleshootingSuggestions(): string[] {
    const suggestions: string[] = []

    if (this.failedKeys.length === this.expectedKeys.length) {
      suggestions.push(
        'Complete key matching failure - check if master file matches data structure',
      )
      suggestions.push(
        'Consider regenerating the master file if data format has changed',
      )
    } else if (this.failedKeys.length > this.expectedKeys.length * 0.5) {
      suggestions.push('High failure rate - verify master file compatibility')
      suggestions.push('Check if data source has been updated')
    } else {
      suggestions.push(
        'Partial failure - some keys may have been renamed or removed',
      )
      suggestions.push(
        'Consider using enablePartialMatch: true for partial decoding',
      )
    }

    suggestions.push('Enable debug logging to see detailed matching process')

    return suggestions
  }
}
