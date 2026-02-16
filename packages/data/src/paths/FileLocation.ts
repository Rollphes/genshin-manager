import type { Language } from '@genshin-manager/core'
import { GeneralError } from '@genshin-manager/core'
import { TextMapBaseName } from '@genshin-manager/core'
import fs from 'fs'
import path from 'path'

import type { LocationSource } from '@/paths/types'
import type { MasterFileMap } from '@/types/generated/MasterFileMap'

/**
 * Unified file location class for all path management
 *
 * Note: __dirname is used here and works in both CJS and ESM contexts because:
 * - CJS: __dirname is natively available
 * - ESM: tsup injects a __dirname shim during build
 *
 * @example
 * ```typescript
 * FileLocation.deploy({ assetCacheFolderPath: 'C:/cache' })
 * FileLocation.excelBin('AvatarExcelConfigData').resolve()
 * ```
 */
export class FileLocation {
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

  private constructor(private readonly source: LocationSource) {}

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

  /**
   * Deploy FileLocation with asset cache path
   * @param option - Deploy options
   * @param option.assetCacheFolderPath - Asset cache folder path
   */
  public static deploy(option: { assetCacheFolderPath: string }): void {
    this._assetCacheFolderPath = option.assetCacheFolderPath
  }

  /**
   * Create a FileLocation from resolved path string
   * @param resolvedPath - Resolved path string
   */
  public static fromPath(resolvedPath: string): FileLocation {
    return new FileLocation({ type: 'resolved', resolvedPath })
  }

  /** Default cache folder */
  public static defaultCacheFolder(): FileLocation {
    return new FileLocation({ type: 'defaultCacheFolder' })
  }

  /** ExcelBin folder */
  public static excelBinFolder(): FileLocation {
    return new FileLocation({ type: 'excelBinFolder' })
  }

  /** TextMap folder */
  public static textMapFolder(): FileLocation {
    return new FileLocation({ type: 'textMapFolder' })
  }

  /** Master file folder */
  public static masterFileFolder(): FileLocation {
    return new FileLocation({ type: 'masterFileFolder' })
  }

  /** Generated types folder */
  public static generatedTypesFolder(): FileLocation {
    return new FileLocation({ type: 'generatedTypesFolder' })
  }

  /**
   * Create a FileLocation for ExcelBin
   * @param excelBinName - ExcelBin file name
   */
  public static excelBin(excelBinName: keyof MasterFileMap): FileLocation {
    return new FileLocation({ type: 'excelBin', excelBinName })
  }

  /**
   * Find all TextMap files for a language (supports split files)
   * @param language - Language code
   * @returns Array of FileLocation for matching files, sorted by name
   */
  public static textMapFiles(language: Language): FileLocation[] {
    const folderPath = FileLocation.textMapFolder().resolve()
    if (!fs.existsSync(folderPath)) return []

    const baseName = TextMapBaseName[language]
    const pattern = new RegExp(`^${baseName}(_\\d+)?\\.json$`)

    return fs
      .readdirSync(folderPath)
      .filter((name) => pattern.test(name))
      .sort()
      .map(
        (fileName) => new FileLocation({ type: 'textMap', language, fileName }),
      )
  }

  /**
   * Create a FileLocation for Image
   * @param fileName - Image file name
   */
  public static image(fileName: string): FileLocation {
    return new FileLocation({ type: 'image', fileName })
  }

  /**
   * Create a FileLocation for Audio
   * @param pathSegments - Path segments
   */
  public static audio(...pathSegments: string[]): FileLocation {
    return new FileLocation({ type: 'audio', pathSegments })
  }

  /** Create a FileLocation for commit file */
  public static commitFile(): FileLocation {
    return new FileLocation({ type: 'commitFile' })
  }

  /**
   * Create a FileLocation for master file
   * @param fileName - Master file name
   */
  public static masterFile(fileName: string): FileLocation {
    return new FileLocation({ type: 'masterFile', fileName })
  }

  /**
   * Create a FileLocation for init image
   * @param fileName - Init image file name
   */
  public static initImage(fileName: string): FileLocation {
    return new FileLocation({ type: 'initImage', fileName })
  }

  /**
   * Create a FileLocation for generated types
   * @param fileName - Generated types file name
   */
  public static generatedTypes(fileName: string): FileLocation {
    return new FileLocation({ type: 'generatedTypes', fileName })
  }

  private static getAssetCacheFolderPath(): string {
    if (this._assetCacheFolderPath === undefined) {
      throw new GeneralError(
        'FileLocation not deployed. Call FileLocation.deploy() first.',
      )
    }
    return this._assetCacheFolderPath
  }

  /** Resolve to full path string */
  public resolve(): string {
    switch (this.source.type) {
      case 'defaultCacheFolder':
        return path.resolve(FileLocation.PROJECT_ROOT, 'cache')
      case 'excelBinFolder':
        return path.resolve(
          FileLocation.getAssetCacheFolderPath(),
          'ExcelBinOutput',
        )
      case 'textMapFolder':
        return path.resolve(FileLocation.getAssetCacheFolderPath(), 'TextMap')
      case 'masterFileFolder':
        return path.resolve(FileLocation.DATA_PACKAGE_ROOT, 'masterFiles')
      case 'generatedTypesFolder':
        return path.resolve(
          FileLocation.DATA_PACKAGE_ROOT,
          'src',
          'types',
          'generated',
        )
      case 'excelBin':
        return path.resolve(
          FileLocation.getAssetCacheFolderPath(),
          'ExcelBinOutput',
          `${this.source.excelBinName}.json`,
        )
      case 'textMap':
        return path.resolve(
          FileLocation.getAssetCacheFolderPath(),
          'TextMap',
          this.source.fileName,
        )
      case 'image':
        return path.resolve(
          FileLocation.getAssetCacheFolderPath(),
          'Images',
          this.source.fileName,
        )
      case 'audio':
        return path.resolve(
          FileLocation.getAssetCacheFolderPath(),
          'Audios',
          ...this.source.pathSegments,
        )
      case 'commitFile':
        return path.resolve(
          FileLocation.getAssetCacheFolderPath(),
          'commits.json',
        )
      case 'masterFile':
        return path.resolve(
          FileLocation.DATA_PACKAGE_ROOT,
          'masterFiles',
          this.source.fileName,
        )
      case 'initImage':
        return path.resolve(
          FileLocation.DATA_PACKAGE_ROOT,
          'initImages',
          this.source.fileName,
        )
      case 'generatedTypes':
        return path.resolve(
          FileLocation.DATA_PACKAGE_ROOT,
          'src',
          'types',
          'generated',
          this.source.fileName,
        )
      case 'resolved':
        return this.source.resolvedPath
    }
  }

  /** Get file/folder name from path */
  public basename(): string {
    return path.basename(this.resolve())
  }

  /** Get parent directory as FileLocation */
  public parent(): FileLocation {
    return new FileLocation({
      type: 'resolved',
      resolvedPath: path.dirname(this.resolve()),
    })
  }

  /**
   * Get child path as FileLocation
   * @param relativePath - Relative path to child
   */
  public child(relativePath: string): FileLocation {
    return new FileLocation({
      type: 'resolved',
      resolvedPath: path.join(this.resolve(), relativePath),
    })
  }
}
