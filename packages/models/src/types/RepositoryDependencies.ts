import type { ExcelBinCache, TextMapIndex } from '@genshin-manager/data'

/**
 * Dependencies injected into Repository classes
 */
export interface RepositoryDependencies {
  /** ExcelBin cache with query builder support */
  readonly excelBinCache: ExcelBinCache
  /** TextMap index with TypedArray binary search and LRU text cache */
  readonly textMap: TextMapIndex
}
