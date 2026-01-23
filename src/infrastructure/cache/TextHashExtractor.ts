import type { JsonObject } from '@/domain/types/json'

/**
 * Check if key is a TextMapHash key
 * @param key - Key to check
 */
function isTextMapHashKey(key: string): boolean {
  return key.includes('TextMapHash')
}

/**
 * Check if value is a plain object (not array)
 * @param value - Value to check
 */
function isPlainObject(value: unknown): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Add number values from array to hashes set
 * @param arr - Array to extract from
 * @param hashes - Set to add hashes to
 */
function addArrayHashes(arr: unknown[], hashes: Set<number>): void {
  for (const item of arr) if (typeof item === 'number') hashes.add(item)
}

/**
 * Extract hashes from nested object
 * @param nested - Nested JSON object
 * @param hashes - Set to add hashes to
 */
function extractFromNestedObject(
  nested: JsonObject,
  hashes: Set<number>,
): void {
  for (const [key, value] of Object.entries(nested)) {
    if (isTextMapHashKey(key) && typeof value === 'number') hashes.add(value)

    if (key === 'paramDescList' && Array.isArray(value))
      addArrayHashes(value, hashes)
  }
}

/**
 * Extract hashes from a single record
 * @param record - JSON record
 * @param hashes - Set to add hashes to
 */
function extractFromRecord(record: JsonObject, hashes: Set<number>): void {
  for (const [key, value] of Object.entries(record)) {
    if (isTextMapHashKey(key) && typeof value === 'number') hashes.add(value)

    if ((key === 'tips' || key === 'paramDescList') && Array.isArray(value))
      addArrayHashes(value, hashes)

    if (isPlainObject(value))
      extractFromNestedObject(value as JsonObject, hashes)
  }
}

/**
 * Extract all text hashes from ExcelBinOutput cache
 * @param cachedData - Cached ExcelBinOutput data map
 * @returns Set of text hashes
 */
export function extractTextHashes(
  cachedData: Record<string, unknown>,
): Set<number> {
  const hashes = new Set<number>()

  for (const excelBinDataMap of Object.values(cachedData)) {
    if (typeof excelBinDataMap !== 'object' || excelBinDataMap === null)
      continue

    for (const excelBinData of Object.values(
      excelBinDataMap as Record<string, unknown>,
    )) {
      if (typeof excelBinData !== 'object' || excelBinData === null) continue

      extractFromRecord(excelBinData as JsonObject, hashes)
    }
  }

  return hashes
}
