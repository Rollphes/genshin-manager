import type { Language } from '@genshin-manager/core'

import type { MasterFileMap } from '@/types/generated/MasterFileMap'

/**
 * Property access segment for JSON path
 */
export interface PropSegment {
  /** Segment type identifier */
  readonly type: 'prop'
  /** Property name */
  readonly propertyName: string
}

/**
 * Array index access segment for JSON path
 */
export interface IndexSegment {
  /** Segment type identifier */
  readonly type: 'index'
  /** Array index */
  readonly idx: number
}

/**
 * Filter condition segment for JSON path
 */
export interface FilterSegment {
  /** Segment type identifier */
  readonly type: 'filter'
  /** Property name to filter by */
  readonly propertyName: string
  /** Value to match */
  readonly value: string | number | boolean
}

/**
 * Union type of all path segment types
 */
export type PathSegment = PropSegment | IndexSegment | FilterSegment

/**
 * Filter condition for ExcelBinCache lookups
 */
export interface FilterCondition {
  /** Property name to filter by */
  readonly propertyName: string
  /** Property value to match */
  readonly value: string | number | boolean
}

/**
 * Index key type for ExcelBinCache
 */
export type IndexKey = string | number | boolean

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
  /** Optional specific file name */
  readonly fileName?: string
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
 * Source type for handbook locations
 */
export interface HandbookSource {
  /** Source type identifier */
  readonly type: 'handbook'
  /** Handbook file name */
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
 * Union type of all location source types
 */
export type LocationSource =
  | ExcelBinSource
  | TextMapSource
  | ImageSource
  | AudioSource
  | MasterFileSource
  | InitImageSource
  | HandbookSource
  | GeneratedTypesSource
  | CommitFileSource
