import type { ParsedItem, TypeLinkMap } from './types'
import { toKebabCase } from './utils'

/**
 * Primitive types (no links)
 */
const PRIMITIVE_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'void',
  'null',
  'undefined',
  'any',
  'unknown',
  'never',
  'object',
  'symbol',
  'bigint',
])

/**
 * Built-in types (external links)
 */
const BUILTIN_TYPES = new Set([
  'Array',
  'Map',
  'Set',
  'Promise',
  'Record',
  'Partial',
  'Required',
  'Readonly',
  'Pick',
  'Omit',
  'Exclude',
  'Extract',
  'NonNullable',
  'ReturnType',
  'InstanceType',
  'Parameters',
  'Date',
  'RegExp',
  'Error',
  'Buffer',
  'URL',
  'EventEmitter',
])

/**
 * Build type link map from parsed items
 */
export function buildTypeLinkMap(items: ParsedItem[]): TypeLinkMap {
  const map: TypeLinkMap = new Map()

  for (const item of items) {
    const path = buildPath(item)
    map.set(item.name, path)
  }

  return map
}

/**
 * Build path for item (flat structure - no category subdirectory)
 */
function buildPath(item: ParsedItem): string {
  const domain = item.domain
  const fileName = toKebabCase(item.name)

  return `/docs/api/${domain}/${fileName}`
}

/**
 * Check if type is primitive
 */
export function isPrimitive(typeName: string): boolean {
  return PRIMITIVE_TYPES.has(typeName)
}

/**
 * Check if type is built-in
 */
export function isBuiltin(typeName: string): boolean {
  return BUILTIN_TYPES.has(typeName)
}

/**
 * Check if type is internal
 */
export function isInternalType(
  typeName: string,
  linkMap: TypeLinkMap,
): boolean {
  return linkMap.has(typeName)
}

/**
 * Convert type link map to plain object for JSON export
 */
export function typeLinkMapToObject(
  linkMap: TypeLinkMap,
): Record<string, string> {
  return Object.fromEntries(linkMap)
}
