import type { Language } from '@genshin-manager/core'
import { GeneralError } from '@genshin-manager/core'
import { TextMapBaseName } from '@genshin-manager/core'
import path from 'path'

import type {
  FilterCondition,
  FilterSegment,
  LocationSource,
  PathSegment,
} from '@/paths/types'
import type { MasterFileMap } from '@/types/generated/MasterFileMap'

/**
 * Unified location class for all path management
 *
 * @example
 * ```typescript
 * Location.deploy({ assetCacheFolderPath: 'C:/cache' })
 * Location.excelBin('AvatarExcelConfigData').filter('id', 10000002).resolve()
 * ```
 */
export class Location<
  K extends keyof MasterFileMap | null = null,
  T = unknown,
> {
  // ========== Private Static Fields ==========

  /** Resolves to packages/data in both npm install and dev environments */
  private static readonly DATA_PACKAGE_ROOT = ((): string => {
    const normalized = __dirname.replace(/\\/g, '/')
    if (normalized.endsWith('/dist')) return path.resolve(__dirname, '..')
    return path.resolve(__dirname, '..', '..')
  })()

  /** Resolves to user project root (npm) or monorepo root (dev) */
  private static readonly PROJECT_ROOT = ((): string => {
    const normalized = __dirname.replace(/\\/g, '/')
    const nodeModulesIndex = normalized.lastIndexOf('/node_modules/')
    if (nodeModulesIndex !== -1) return normalized.slice(0, nodeModulesIndex)
    if (normalized.endsWith('/dist'))
      return path.resolve(__dirname, '..', '..', '..')
    return path.resolve(__dirname, '..', '..', '..', '..')
  })()

  private static _assetCacheFolderPath: string | undefined

  // ========== Private Constructor ==========

  private constructor(
    private readonly source: LocationSource,
    private readonly _segments: readonly PathSegment[] = [],
  ) {}

  // ========== Public Static Getters ==========

  /**
   * Asset cache folder path
   * @throws {@link GeneralError} - When not deployed
   */
  public static get assetCacheFolderPath(): string {
    if (this._assetCacheFolderPath === undefined) {
      throw new GeneralError(
        'Location not deployed. Call Location.deploy() first.',
      )
    }
    return this._assetCacheFolderPath
  }

  /** Default cache folder path */
  public static get defaultCacheFolderPath(): string {
    return path.resolve(this.PROJECT_ROOT, 'cache')
  }

  /** ExcelBin folder path */
  public static get excelBinFolderPath(): string {
    return path.resolve(this.assetCacheFolderPath, 'ExcelBinOutput')
  }

  /** TextMap folder path */
  public static get textMapFolderPath(): string {
    return path.resolve(this.assetCacheFolderPath, 'TextMap')
  }

  /** Image folder path */
  public static get imageFolderPath(): string {
    return path.resolve(this.assetCacheFolderPath, 'Images')
  }

  /** Audio folder path */
  public static get audioFolderPath(): string {
    return path.resolve(this.assetCacheFolderPath, 'Audios')
  }

  /** Master file folder path */
  public static get masterFileFolderPath(): string {
    return path.resolve(this.DATA_PACKAGE_ROOT, 'masterFiles')
  }

  /** Handbook folder path */
  public static get handbookFolderPath(): string {
    return path.resolve(this.DATA_PACKAGE_ROOT, 'handbook')
  }

  /** Generated types folder path */
  public static get generatedTypesFolderPath(): string {
    return path.resolve(this.DATA_PACKAGE_ROOT, 'src', 'types', 'generated')
  }

  // ========== Public Instance Getters ==========

  /** Source type */
  public get sourceType(): LocationSource['type'] {
    return this.source.type
  }

  /** ExcelBin name (only for ExcelBin locations) */
  public get excelBinName(): keyof MasterFileMap | undefined {
    return this.source.type === 'excelBin'
      ? this.source.excelBinName
      : undefined
  }

  /** Language (only for TextMap locations) */
  public get language(): Language | undefined {
    return this.source.type === 'textMap' ? this.source.language : undefined
  }

  /** Path segments */
  public get segments(): readonly PathSegment[] {
    return this._segments
  }

  /** Filter conditions for ExcelBinCache lookup */
  public get conditions(): readonly FilterCondition[] {
    return this._segments
      .filter((seg): seg is FilterSegment => seg.type === 'filter')
      .map((seg) => ({ propertyName: seg.propertyName, value: seg.value }))
  }

  // ========== Public Static Methods ==========

  /**
   * Deploy Location with asset cache path
   * @param option - Deploy options
   * @param option.assetCacheFolderPath - Asset cache folder path
   */
  public static deploy(option: { assetCacheFolderPath: string }): void {
    this._assetCacheFolderPath = option.assetCacheFolderPath
  }

  /**
   * Get ExcelBin file path by name
   * @param excelBinName - ExcelBin name
   * @param folderPath - Optional folder path override
   */
  public static excelBinFilePath(
    excelBinName: string,
    folderPath?: string,
  ): string {
    const folder = folderPath ?? this.excelBinFolderPath
    return path.resolve(folder, `${excelBinName}.json`)
  }

  /**
   * Get parent directory path for audio file
   * @param pathSegments - Path segments
   */
  public static audioParentPath(...pathSegments: string[]): string {
    const segments = pathSegments.slice(0, -1)
    return path.resolve(this.audioFolderPath, ...segments)
  }

  /**
   * Extract file name without extension from URL
   * @param url - URL string
   * @param extension - Extension to remove
   */
  public static getFileNameFromURL(url: string, extension = '.png'): string {
    const urlObj = new URL(url)
    const fileName = urlObj.pathname.split('/').pop() ?? ''
    return fileName.endsWith(extension)
      ? fileName.slice(0, -extension.length)
      : fileName
  }

  /**
   * Get relative path from asset cache folder
   * @param targetPath - Target path
   */
  public static getRelativePath(targetPath: string): string {
    return path.relative(this.assetCacheFolderPath, targetPath)
  }

  /**
   * Join path segments
   * @param segments - Path segments
   */
  public static joinPath(...segments: string[]): string {
    return path.join(...segments)
  }

  /**
   * Extract file name from path
   * @param filePath - File path
   */
  public static getFileName(filePath: string): string {
    return path.basename(filePath)
  }

  /**
   * Create a Location for ExcelBin
   * @param excelBinName - ExcelBin file name
   */
  public static excelBin<K extends keyof MasterFileMap>(
    excelBinName: K,
  ): Location<K, MasterFileMap[K]> {
    return new Location<K, MasterFileMap[K]>(
      { type: 'excelBin', excelBinName },
      [],
    )
  }

  /**
   * Create a Location for TextMap
   * @param language - Language code
   * @param fileName - Optional file name
   */
  public static textMap(language: Language, fileName?: string): Location {
    return new Location<null, unknown>(
      { type: 'textMap', language, fileName },
      [],
    )
  }

  /**
   * Create a Location for Image
   * @param fileName - Image file name
   */
  public static image(fileName: string): Location {
    return new Location<null, unknown>({ type: 'image', fileName }, [])
  }

  /**
   * Create a Location for Audio
   * @param pathSegments - Path segments
   */
  public static audio(...pathSegments: string[]): Location {
    return new Location<null, unknown>({ type: 'audio', pathSegments }, [])
  }

  /** Create a Location for commit file */
  public static commitFile(): Location {
    return new Location<null, unknown>({ type: 'commitFile' }, [])
  }

  /**
   * Create a Location for master file
   * @param fileName - Master file name
   */
  public static masterFile(fileName: string): Location {
    return new Location<null, unknown>({ type: 'masterFile', fileName }, [])
  }

  /**
   * Create a Location for init image
   * @param fileName - Init image file name
   */
  public static initImage(fileName: string): Location {
    return new Location<null, unknown>({ type: 'initImage', fileName }, [])
  }

  /**
   * Create a Location for handbook
   * @param fileName - Handbook file name
   */
  public static handbook(fileName: string): Location {
    return new Location<null, unknown>({ type: 'handbook', fileName }, [])
  }

  /**
   * Create a Location for generated types
   * @param fileName - Generated types file name
   */
  public static generatedTypes(fileName: string): Location {
    return new Location<null, unknown>({ type: 'generatedTypes', fileName }, [])
  }

  // ========== Public Instance Methods ==========

  /**
   * Add property access to the path
   * @param propertyName - Property name
   */
  public prop<P extends keyof T & string>(propertyName: P): Location<K, T[P]> {
    return new Location<K, T[P]>(this.source, [
      ...this._segments,
      { type: 'prop', propertyName },
    ])
  }

  /**
   * Add array index access to the path
   * @param idx - Array index
   */
  public index<U = T extends readonly (infer E)[] ? E : never>(
    idx: number,
  ): Location<K, U> {
    return new Location<K, U>(this.source, [
      ...this._segments,
      { type: 'index', idx },
    ])
  }

  /**
   * Add filter condition to the path
   * @param propertyName - Property name to filter by
   * @param value - Value to match
   */
  public filter<P extends keyof T & string>(
    propertyName: P,
    value: T[P] & (string | number | boolean),
  ): Location<K, T> {
    return new Location<K, T>(this.source, [
      ...this._segments,
      { type: 'filter', propertyName, value },
    ])
  }

  /** Resolve to full path string */
  public resolve(): string {
    const basePath = this.resolveBasePath()
    const jsonPath = this.formatJsonPath()
    return jsonPath ? `${basePath}#${jsonPath}` : basePath
  }

  /** Format JSON path portion only */
  public formatJsonPath(): string {
    if (this._segments.length === 0) return ''

    return this._segments
      .map((segment): string => {
        switch (segment.type) {
          case 'prop':
            return `.${segment.propertyName}`
          case 'index':
            return `[${String(segment.idx)}]`
          case 'filter':
            return `[${segment.propertyName}=${String(segment.value)}]`
        }
      })
      .join('')
      .replace(/^\./, '')
  }

  /** Convert to string representation */
  public toString(): string {
    const baseName = this.getBaseName()
    const jsonPath = this.formatJsonPath()
    return jsonPath ? `${baseName}#${jsonPath}` : baseName
  }

  // ========== Private Instance Methods ==========

  private resolveBasePath(): string {
    switch (this.source.type) {
      case 'excelBin':
        return path.resolve(
          Location.assetCacheFolderPath,
          'ExcelBinOutput',
          `${this.source.excelBinName}.json`,
        )
      case 'textMap': {
        const baseName = TextMapBaseName[this.source.language]
        const fileName = this.source.fileName ?? `${baseName}.json`
        return path.resolve(Location.assetCacheFolderPath, 'TextMap', fileName)
      }
      case 'image':
        return path.resolve(
          Location.assetCacheFolderPath,
          'Images',
          this.source.fileName,
        )
      case 'audio':
        return path.resolve(
          Location.assetCacheFolderPath,
          'Audios',
          ...this.source.pathSegments,
        )
      case 'commitFile':
        return path.resolve(Location.assetCacheFolderPath, 'commits.json')
      case 'masterFile':
        return path.resolve(
          Location.DATA_PACKAGE_ROOT,
          'masterFiles',
          this.source.fileName,
        )
      case 'initImage':
        return path.resolve(
          Location.DATA_PACKAGE_ROOT,
          'initImages',
          this.source.fileName,
        )
      case 'handbook':
        return path.resolve(
          Location.DATA_PACKAGE_ROOT,
          'handbook',
          this.source.fileName,
        )
      case 'generatedTypes':
        return path.resolve(
          Location.DATA_PACKAGE_ROOT,
          'src',
          'types',
          'generated',
          this.source.fileName,
        )
    }
  }

  private getBaseName(): string {
    switch (this.source.type) {
      case 'excelBin':
        return this.source.excelBinName
      case 'textMap':
        return `TextMap_${this.source.language}`
      case 'image':
        return `Image:${this.source.fileName}`
      case 'audio':
        return `Audio:${this.source.pathSegments.join('/')}`
      case 'commitFile':
        return 'commits.json'
      case 'masterFile':
        return `MasterFile:${this.source.fileName}`
      case 'initImage':
        return `InitImage:${this.source.fileName}`
      case 'handbook':
        return `Handbook:${this.source.fileName}`
      case 'generatedTypes':
        return `GeneratedTypes:${this.source.fileName}`
    }
  }
}
