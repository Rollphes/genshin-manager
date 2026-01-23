import { JsonObject } from '@/domain/types/json'

/**
 * Enhanced master file structure with recursive support
 */
export interface EncryptedKeyMasterFile {
  /**
   * Metadata
   */
  metadata: {
    sourceFile: string
    generatedAt: string
  }
  /**
   * Primary key mapping template (decoded reference object with highest data density)
   */
  keyMappingTemplate: JsonObject
  /**
   * Alternative patterns for structural variations (optional, ordered by data density)
   */
  alternativePatterns?: JsonObject[]
}
