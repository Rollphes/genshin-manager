import type { Language } from '@genshin-manager/core'

import type { MasterFileMap } from '@/types/generated/MasterFileMap'

/**
 * Source type for default cache folder
 */
export interface DefaultCacheFolderSource {
  /** Source type identifier */
  readonly type: 'defaultCacheFolder'
}

/**
 * Source type for ExcelBin folder
 */
export interface ExcelBinFolderSource {
  /** Source type identifier */
  readonly type: 'excelBinFolder'
}

/**
 * Source type for TextMap folder
 */
export interface TextMapFolderSource {
  /** Source type identifier */
  readonly type: 'textMapFolder'
}

/**
 * Source type for master file folder
 */
export interface MasterFileFolderSource {
  /** Source type identifier */
  readonly type: 'masterFileFolder'
}

/**
 * Source type for generated types folder
 */
export interface GeneratedTypesFolderSource {
  /** Source type identifier */
  readonly type: 'generatedTypesFolder'
}

/**
 * Source type for ExcelBin locations
 */
export interface ExcelBinSource {
  /** Source type identifier */
  readonly type: 'excelBin'
  /** ExcelBin file name */
  readonly excelBinName: keyof MasterFileMap
}

/**
 * Source type for TextMap locations
 */
export interface TextMapSource {
  /** Source type identifier */
  readonly type: 'textMap'
  /** Language code */
  readonly language: Language
  /** TextMap file name */
  readonly fileName: string
}

/**
 * Source type for Image locations
 */
export interface ImageSource {
  /** Source type identifier */
  readonly type: 'image'
  /** Image file name */
  readonly fileName: string
}

/**
 * Source type for Audio locations
 */
export interface AudioSource {
  /** Source type identifier */
  readonly type: 'audio'
  /** Path segments for audio file */
  readonly pathSegments: readonly string[]
}

/**
 * Source type for master file locations
 */
export interface MasterFileSource {
  /** Source type identifier */
  readonly type: 'masterFile'
  /** Master file name */
  readonly fileName: string
}

/**
 * Source type for init image locations
 */
export interface InitImageSource {
  /** Source type identifier */
  readonly type: 'initImage'
  /** Init image file name */
  readonly fileName: string
}

/**
 * Source type for generated types locations
 */
export interface GeneratedTypesSource {
  /** Source type identifier */
  readonly type: 'generatedTypes'
  /** Generated types file name */
  readonly fileName: string
}

/**
 * Source type for commit file location
 */
export interface CommitFileSource {
  /** Source type identifier */
  readonly type: 'commitFile'
}

/**
 * Source type for resolved path locations (used by parent/child)
 */
export interface ResolvedSource {
  /** Source type identifier */
  readonly type: 'resolved'
  /** Resolved path string */
  readonly resolvedPath: string
}

/**
 * Union type of all location source types
 */
export type LocationSource =
  | DefaultCacheFolderSource
  | ExcelBinFolderSource
  | TextMapFolderSource
  | MasterFileFolderSource
  | GeneratedTypesFolderSource
  | ExcelBinSource
  | TextMapSource
  | ImageSource
  | AudioSource
  | MasterFileSource
  | InitImageSource
  | GeneratedTypesSource
  | CommitFileSource
  | ResolvedSource
