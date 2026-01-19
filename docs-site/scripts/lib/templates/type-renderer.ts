import { isBuiltin, isInternalType, isPrimitive } from '../type-link-map'
import type { TypeLinkMap, TypeParameter, TypeReference } from '../types'

/**
 * Render type reference as JSX string for MDX
 */
export function renderTypeSignature(
  typeRef: TypeReference,
  linkMap: TypeLinkMap,
): string {
  const { name, isArray, isUnion, unionTypes, typeArguments } = typeRef

  // Union type
  if (isUnion && unionTypes) {
    const parts = unionTypes.map((t, i) => {
      const typeJsx = renderTypeSignature(t, linkMap)
      return `${i > 0 ? ' | ' : ''}${typeJsx}`
    })
    return `<span>${parts.join('')}</span>`
  }

  // Generic type with type arguments
  if (typeArguments && typeArguments.length > 0) {
    const base = renderSingleType(name, linkMap, false)
    const args = typeArguments.map((t, i) => {
      const typeJsx = renderTypeSignature(t, linkMap)
      return `${i > 0 ? ', ' : ''}${typeJsx}`
    })
    const suffix = isArray ? '[]' : ''
    return `<span>${base}&lt;${args.join('')}&gt;${suffix}</span>`
  }

  // Single type (with or without array)
  return renderSingleType(name, linkMap, isArray)
}

/**
 * Escape JSX special characters in type names
 * Escapes {}, <>, and other JSX-sensitive characters
 */
function escapeJsx(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[{}]/g, (match) => (match === '{' ? "{'{'}" : "{'}'}"))
}

/**
 * Render single type name
 * Array suffix [] is placed outside the code block for consistency
 * Colors follow GitHub Dark Default theme:
 * - Primitives/Types: #79c0ff (dark) / #0550ae (light)
 */
function renderSingleType(
  typeName: string,
  linkMap: TypeLinkMap,
  isArray = false,
): string {
  // Remove quotes from literal types
  const cleanName = typeName.replace(/^"|"$/g, '')

  // Primitives - GitHub blue
  if (isPrimitive(cleanName)) {
    const code = `<span className="text-[#0550ae] dark:text-[#79c0ff]">${cleanName}</span>`
    return isArray ? `<span>${code}[]</span>` : code
  }

  // Builtins (Record, Promise, etc.) - GitHub blue
  if (isBuiltin(cleanName)) {
    const code = `<span className="text-[#0550ae] dark:text-[#79c0ff]">${cleanName}</span>`
    return isArray ? `<span>${code}[]</span>` : code
  }

  if (isInternalType(cleanName, linkMap))
    return `<TypeLink type="${cleanName}" ${isArray ? 'isArray ' : ''}/>`

  // Unknown type - GitHub blue (treat as type/interface)
  const escapedTypeName = escapeJsx(typeName)
  const code = `<span className="text-[#0550ae] dark:text-[#79c0ff]">${escapedTypeName}</span>`
  return isArray ? `<span>${code}[]</span>` : code
}

/**
 * Render type as plain text (for signatures in accordion header)
 */
export function renderTypeAsText(typeRef: TypeReference): string {
  const { name, isArray, isUnion, unionTypes, typeArguments } = typeRef

  if (isUnion && unionTypes) return unionTypes.map(renderTypeAsText).join(' | ')

  if (isArray) return `${renderTypeAsText({ ...typeRef, isArray: false })}[]`

  if (typeArguments && typeArguments.length > 0) {
    const args = typeArguments.map(renderTypeAsText).join(', ')
    return `${name}<${args}>`
  }

  return name
}

/**
 * Serializable type info for JSON (used in ParameterTable)
 */
export interface SerializedType {
  displayText: string
  linkPath?: string
  isArray?: boolean
}

/**
 * Serialize TypeReference to JSON-safe format for ParameterTable
 */
export function serializeTypeForJson(
  typeRef: TypeReference,
  linkMap: TypeLinkMap,
): SerializedType {
  const displayText = renderTypeAsText(typeRef)
  const { name, isArray } = typeRef

  // Check if the base type has a link
  const linkPath = linkMap.get(name)

  return {
    displayText,
    linkPath,
    isArray,
  }
}

/**
 * Render type parameters (generics) as JSX string
 * Example: <T extends BaseClient, U = string>
 */
export function renderTypeParameters(
  typeParams: TypeParameter[] | undefined,
  linkMap: TypeLinkMap,
): string {
  if (!typeParams || typeParams.length === 0) return ''

  const params = typeParams.map((tp) => {
    let result = `<span className="text-[#0550ae] dark:text-[#79c0ff]">${tp.name}</span>`

    if (tp.constraint) {
      const constraintJsx = renderTypeSignature(tp.constraint, linkMap)
      result += ` <span className="text-[#cf222e] dark:text-[#ff7b72]">extends</span> ${constraintJsx}`
    }

    if (tp.default) {
      const defaultJsx = renderTypeSignature(tp.default, linkMap)
      result += ` = ${defaultJsx}`
    }

    return result
  })

  return `<span>&lt;${params.join(', ')}&gt;</span>`
}
