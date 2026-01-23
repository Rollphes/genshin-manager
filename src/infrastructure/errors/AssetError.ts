import { ErrorContextFactory } from '@/domain/errors/base/ErrorContext'
import { GenshinManagerError } from '@/domain/errors/base/GenshinManagerError'
import type { AssetContext } from '@/domain/types/errorContext'

/**
 * Base asset error class
 */
export abstract class AssetError extends GenshinManagerError {
  /**
   * Asset file path or identifier
   */
  public readonly assetPath: string

  /**
   * Asset type (image, audio, etc.)
   */
  public readonly assetType: string

  /**
   * Data source name (e.g., 'MonsterExcelConfigData')
   */
  public readonly source?: string

  /**
   * Record ID within the data source
   */
  public readonly recordId?: string | number

  /**
   * Operation being performed
   */
  public readonly operation?: string

  /**
   * Constructor for AssetError
   * @param message - Error message
   * @param assetPath - Asset file path or identifier
   * @param assetType - Type of asset
   * @param assetContext - Structured asset context
   * @param cause - Original error
   */
  constructor(
    message: string,
    assetPath: string,
    assetType: string,
    assetContext?: AssetContext,
    cause?: Error,
  ) {
    const errorContext = ErrorContextFactory.createAssetContext(
      assetPath,
      assetType === 'image' ? assetPath : undefined,
      assetType === 'audio' ? assetPath : undefined,
      assetContext?.operation ?? `load ${assetType}`,
    )

    // Add source info to metadata
    const mergedContext = assetContext?.source
      ? {
          ...errorContext,
          metadata: {
            source: assetContext.source,
            recordId: assetContext.recordId,
          },
        }
      : errorContext

    super(message, mergedContext, cause)

    this.assetPath = assetPath
    this.assetType = assetType
    this.source = assetContext?.source
    this.recordId = assetContext?.recordId
    this.operation = assetContext?.operation
  }

  /**
   * Build location prefix from AssetContext
   * @param context - Asset context
   * @returns Location prefix string
   */
  protected static buildAssetLocationPrefix(context?: AssetContext): string {
    if (!context?.source) return ''

    let prefix = context.source
    if (context.recordId !== undefined) prefix += `#${String(context.recordId)}`

    return `[${prefix}] `
  }
}
