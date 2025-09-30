export { buildCacheStructure } from '@/utils/cache/buildCacheStructure'
export {
  clearAllFileLocks,
  isFileLocked,
  withFileLock,
} from '@/utils/cache/fileLockManager'
export type {
  DataDensityAnalysis,
  MasterCandidate,
} from '@/utils/cache/generateMasterFromJson'
export {
  analyzeValue,
  calculateDataDensity,
  createMasterStructure,
  findFirstNonEmptyDifferencePath,
  findOptimalMasterPatterns,
  generateMasterFromJson,
  isEmptyJsonValue,
} from '@/utils/cache/generateMasterFromJson'
