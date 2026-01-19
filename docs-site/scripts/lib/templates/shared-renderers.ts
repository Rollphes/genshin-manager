import type {
  ParsedAccessor,
  ParsedMethod,
  ParsedProperty,
  TypeLinkMap,
} from '../types'
import { escapeMdx } from '../utils'
import { renderTypeSignature } from './type-renderer'

/**
 * Property with static flag for rendering
 */
export type PropertyWithFlags = ParsedProperty & {
  isStatic: boolean
}

/**
 * Method with static flag for rendering
 */
export type MethodWithFlags = ParsedMethod & {
  isStatic: boolean
}

/**
 * Render properties table with all badge support
 */
export function renderPropertiesTable(
  properties: PropertyWithFlags[],
  linkMap: TypeLinkMap,
): string {
  // Generate TOC headings for each property
  const tocHeadings = properties.map((prop) => `### ${prop.name}`).join('\n\n')

  const entries = properties.map((prop) => {
    const typeStr = renderTypeSignature(prop.type, linkMap)
    const badges: string[] = []
    if (prop.isReadonly) badges.push('[readonly]')
    if (prop.isStatic) badges.push('[static]')
    if (prop.isAbstract) badges.push('[abstract]')
    if (prop.isProtected) badges.push('[protected]')
    const badgePrefix = badges.join('')

    // Build description with warnings, additionalDescription, and mapDescription inline
    const descParts: string[] = []

    // Main description
    if (prop.description)
      descParts.push(`<Md>{\`${escapeMdx(prop.description)}\`}</Md>`)

    // Warnings as Callout
    if (prop.warnings && prop.warnings.length > 0) {
      for (const warning of prop.warnings) {
        descParts.push(
          `<Callout type="warn"><Md>{\`${escapeMdx(warning)}\`}</Md></Callout>`,
        )
      }
    }

    // Additional description as Callout
    if (prop.additionalDescription) {
      descParts.push(
        `<Callout type="info"><Md>{\`${escapeMdx(prop.additionalDescription)}\`}</Md></Callout>`,
      )
    }

    // Map/Record structure with @key/@value as nested TypeTable
    if (prop.mapDescription) {
      const { key, keyType, value, valueType } = prop.mapDescription
      const keyTypeStr = renderTypeSignature(keyType, linkMap)
      const valueTypeStr = renderTypeSignature(valueType, linkMap)
      descParts.push(
        `<div className="mt-2"><p className="text-sm font-medium mb-1">Object Structure</p><TypeTableByBadge type={{ "Key": { type: ${keyTypeStr}, description: <Md>{\`${escapeMdx(key)}\`}</Md> }, "Value": { type: ${valueTypeStr}, description: <Md>{\`${escapeMdx(value)}\`}</Md> } }} /></div>`,
      )
    }

    const description =
      descParts.length > 0 ? `<>${descParts.join('')}</>` : `<Md>{\`\`}</Md>`

    return `    "${badgePrefix}${prop.name}": {
      type: ${typeStr},
      description: ${description},${prop.defaultValue ? `\n      default: <Md>{\`\\\`${escapeMdx(prop.defaultValue)}\\\`\`}</Md>,` : ''}${prop.isOptional ? '' : '\n      required: true,'}
    }`
  })

  return `
${tocHeadings}

<TypeTableByBadge
  type={{
${entries.join(',\n')}
  }}
/>
`
}

/**
 * Render method accordion with all options
 */
export function renderMethod(
  method: MethodWithFlags,
  linkMap: TypeLinkMap,
): string {
  const returnTypeStr = renderTypeSignature(method.returnType, linkMap)

  // Build parameters as JS array literal with JSX for types
  const parametersStr = `[${method.parameters
    .map((p) => {
      const typeJsx = renderTypeSignature(p.type, linkMap)
      const desc = escapeMdx(p.description ?? '')
      const defVal = p.defaultValue
        ? `"${escapeMdx(p.defaultValue)}"`
        : 'undefined'
      return `{ name: "${p.name}", typeJsx: ${typeJsx}, description: <Md>{\`${desc}\`}</Md>, optional: ${String(p.isOptional)}, rest: ${String(p.isRest)}, defaultValue: ${defVal} }`
    })
    .join(', ')}]`

  // Clean up example code
  let exampleStr = ''
  if (method.example) {
    const cleanExample = method.example
      .trim()
      .replace(/^```\w*\n?/, '')
      .replace(/\n?```$/, '')
      .trim()
    exampleStr = `example={\`${cleanExample.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}`
  }

  // Build description with warnings and additionalDescription inline
  const descParts: string[] = []
  if (method.description)
    descParts.push(`<Md>{\`${escapeMdx(method.description)}\`}</Md>`)

  if (method.warnings && method.warnings.length > 0) {
    for (const warning of method.warnings) {
      descParts.push(
        `<Callout type="warn"><Md>{\`${escapeMdx(warning)}\`}</Md></Callout>`,
      )
    }
  }
  if (method.additionalDescription) {
    descParts.push(
      `<Callout type="info"><Md>{\`${escapeMdx(method.additionalDescription)}\`}</Md></Callout>`,
    )
  }
  const description =
    descParts.length > 0 ? `<>${descParts.join('')}</>` : `<Md>{\`\`}</Md>`

  // Generate anchor ID from method name (FumaDocs auto-generates from ### heading)
  const anchorId = method.name.replace(/\s+/g, '-').toLowerCase()

  return `
### ${method.name}

<MethodAccordion
  name="${method.name}"
  returnType={${returnTypeStr}}
  description={${description}}
  parameters={${parametersStr}}
  ${method.returns ? `returns={<Md>{\`${escapeMdx(method.returns)}\`}</Md>}` : ''}
  ${exampleStr}
  isAsync={${String(method.isAsync)}}
  isStatic={${String(method.isStatic)}}
  isAbstract={${String(method.isAbstract)}}
  isProtected={${String(method.isProtected)}}
  id="${anchorId}"
/>
`
}

/**
 * Render accessor accordion
 */
export function renderAccessor(
  accessor: ParsedAccessor,
  linkMap: TypeLinkMap,
): string {
  const typeStr = renderTypeSignature(accessor.type, linkMap)
  const description = accessor.description
    ? `<Md>{\`${escapeMdx(accessor.description)}\`}</Md>`
    : `<Md>{\`\`}</Md>`

  // Generate anchor ID from accessor name (FumaDocs auto-generates from ### heading)
  const anchorId = `accessor-${accessor.name.toLowerCase()}`

  return `
### ${accessor.name}

<AccessorAccordion
  name="${accessor.name}"
  typeJsx={${typeStr}}
  description={${description}}
  hasGetter={${String(accessor.hasGetter)}}
  hasSetter={${String(accessor.hasSetter)}}
  isStatic={${String(accessor.isStatic)}}
  isAbstract={${String(accessor.isAbstract)}}
  isProtected={${String(accessor.isProtected)}}
  id="${anchorId}"
/>
`
}
