import fs from 'fs'

import {
  type EventMapParameter,
  type ParsedAccessor,
  type ParsedConstructor,
  type ParsedEnumMember,
  type ParsedEventParameter,
  type ParsedItem,
  type ParsedMethod,
  type ParsedParameter,
  type ParsedProperty,
  ReflectionKind,
  type TypeParameter,
  type TypeReference,
} from './types'

/**
 * Simplified TypeDoc JSON types
 */
interface TypeDocProject {
  id: number
  name: string
  children?: TypeDocReflection[]
}

interface TypeDocReflection {
  id: number
  name: string
  kind: number
  flags?: TypeDocFlags
  comment?: TypeDocComment
  children?: TypeDocReflection[]
  signatures?: TypeDocSignature[]
  getSignature?: TypeDocSignature
  setSignature?: TypeDocSignature
  type?: TypeDocType
  extendedTypes?: TypeDocType[]
  implementedTypes?: TypeDocType[]
  typeParameters?: TypeDocTypeParameter[]
  defaultValue?: string
  /** For inherited members, references the original declaration */
  inheritedFrom?: { name: string }
}

interface TypeDocFlags {
  isPrivate?: boolean
  isProtected?: boolean
  isPublic?: boolean
  isStatic?: boolean
  isReadonly?: boolean
  isOptional?: boolean
  isRest?: boolean
  isAbstract?: boolean
}

interface TypeDocComment {
  summary?: TypeDocCommentPart[]
  blockTags?: TypeDocBlockTag[]
  modifierTags?: string[]
}

interface TypeDocCommentPart {
  kind: string
  text: string
  tag?: string
  target?: number
}

interface TypeDocBlockTag {
  tag: string
  name?: string
  content: TypeDocCommentPart[]
}

interface TypeDocSignature {
  id: number
  name: string
  kind: number
  comment?: TypeDocComment
  parameters?: TypeDocParameter[]
  type?: TypeDocType
  typeParameters?: TypeDocTypeParameter[]
}

interface TypeDocParameter {
  id: number
  name: string
  kind: number
  flags?: TypeDocFlags
  comment?: TypeDocComment
  type?: TypeDocType
  defaultValue?: string
}

interface TypeDocTypeParameter {
  id: number
  name: string
  type?: TypeDocType
  default?: TypeDocType
}

interface TypeDocType {
  type: string
  name?: string
  value?: string | number | boolean
  types?: TypeDocType[]
  typeArguments?: TypeDocType[]
  elementType?: TypeDocType
  declaration?: TypeDocReflection
  elements?: TypeDocType[]
  target?: number
  /** For namedTupleMember */
  element?: TypeDocType
  isOptional?: boolean
}

export class TypeDocParser {
  private project: TypeDocProject
  /**
   * Map of EventMap interface name -> event name -> parameters
   * e.g., { "ClientEventMap": { "BEGIN_UPDATE_CACHE": [{ name: "version", type: { name: "string" } }] } }
   */
  private eventMaps = new Map<string, Map<string, EventMapParameter[]>>()
  /**
   * Set of class/interface names that have @internal tag
   */
  private internalClasses = new Set<string>()

  constructor(jsonPath: string) {
    const content = fs.readFileSync(jsonPath, 'utf-8')
    this.project = JSON.parse(content) as TypeDocProject
    this.buildInternalClasses()
    this.buildEventMaps()
  }

  /**
   * Get event parameters from EventMap by class name and event name
   */
  public getEventParameters(
    eventEnumName: string,
    eventName: string,
  ): EventMapParameter[] | undefined {
    // Convert enum name to map name: ClientEvents -> ClientEventMap
    const mapName = eventEnumName.replace(/Events$/, 'EventMap')
    const eventMap = this.eventMaps.get(mapName)
    return eventMap?.get(eventName)
  }

  /**
   * Parse all exported items
   */
  public parseAll(): ParsedItem[] {
    const results: ParsedItem[] = []
    const children = this.project.children ?? []

    for (const child of children) {
      const parsed = this.parseReflection(child)
      if (parsed) results.push(parsed)
    }

    return results
  }

  /**
   * Build set of @internal class/interface names
   */
  private buildInternalClasses(): void {
    const children = this.project.children ?? []
    for (const child of children)
      if (this.hasInternalTag(child)) this.internalClasses.add(child.name)
  }

  /**
   * Build event parameter maps from EventMap interfaces
   */
  private buildEventMaps(): void {
    const children = this.project.children ?? []

    for (const child of children) {
      // Only process interfaces ending with "EventMap"
      if (
        child.kind === ReflectionKind.Interface &&
        child.name.endsWith('EventMap')
      ) {
        const eventMap = new Map<string, EventMapParameter[]>()

        for (const prop of child.children ?? []) {
          if (prop.kind === ReflectionKind.Property && prop.type) {
            // Extract @param descriptions from property's JSDoc
            const paramDescriptions = this.extractParamDescriptions(prop)
            const params = this.extractEventMapParameters(
              prop.type,
              paramDescriptions,
            )
            if (params.length > 0) eventMap.set(prop.name, params)
          }
        }

        if (eventMap.size > 0) this.eventMaps.set(child.name, eventMap)
      }
    }
  }

  /**
   * Extract @param descriptions from a reflection's blockTags
   */
  private extractParamDescriptions(
    reflection: TypeDocReflection,
  ): Map<string, string> {
    const descriptions = new Map<string, string>()
    const blockTags = reflection.comment?.blockTags
    if (!blockTags) return descriptions

    for (const tag of blockTags) {
      if (tag.tag === '@param' && tag.name) {
        const desc = tag.content
          .filter((part) => part.kind === 'text')
          .map((part) => part.text.replace(/^\s*-\s*/, ''))
          .join('')
          .trim()
        if (desc) descriptions.set(tag.name, desc)
      }
    }

    return descriptions
  }

  /**
   * Extract parameters from EventMap tuple type
   * e.g., [version: string] -> [{ name: "version", type: { name: "string" }, description: "..." }]
   */
  private extractEventMapParameters(
    type: TypeDocType,
    descriptions: Map<string, string>,
  ): EventMapParameter[] {
    if (type.type !== 'tuple' || !type.elements) return []

    return type.elements
      .filter(
        (el): el is TypeDocType & { name: string; element: TypeDocType } =>
          el.type === 'namedTupleMember' &&
          el.name !== undefined &&
          el.element !== undefined,
      )
      .map((el) => ({
        name: el.name,
        type: this.parseType(el.element),
        description: descriptions.get(el.name),
      }))
  }

  /**
   * Parse individual reflection
   */
  private parseReflection(reflection: TypeDocReflection): ParsedItem | null {
    const kind = reflection.kind

    if (kind === ReflectionKind.Class) return this.parseClass(reflection)

    if (kind === ReflectionKind.Interface)
      return this.parseInterface(reflection)

    if (kind === ReflectionKind.TypeAlias)
      return this.parseTypeAlias(reflection)

    if (kind === ReflectionKind.Enum) return this.parseEnum(reflection)

    if (kind === ReflectionKind.Function) return this.parseFunction(reflection)

    if (kind === ReflectionKind.Variable) return this.parseVariable(reflection)

    return null
  }

  /**
   * Parse class
   */
  private parseClass(reflection: TypeDocReflection): ParsedItem {
    const children = reflection.children ?? []

    const properties = children
      .filter(
        (c) =>
          c.kind === ReflectionKind.Property &&
          !c.flags?.isStatic &&
          !this.shouldHideMember(c),
      )
      .map((c) => this.parseProperty(c))

    const methods = children
      .filter(
        (c) =>
          c.kind === ReflectionKind.Method &&
          !c.flags?.isStatic &&
          !this.shouldHideMember(c),
      )
      .map((c) => this.parseMethod(c))

    const staticProperties = children
      .filter(
        (c) =>
          c.kind === ReflectionKind.Property &&
          c.flags?.isStatic &&
          !this.shouldHideMember(c),
      )
      .map((c) => this.parseProperty(c))

    const staticMethods = children
      .filter(
        (c) =>
          c.kind === ReflectionKind.Method &&
          c.flags?.isStatic &&
          !this.shouldHideMember(c),
      )
      .map((c) => this.parseMethod(c))

    const accessors = children
      .filter(
        (c) =>
          c.kind === ReflectionKind.Accessor &&
          !c.flags?.isStatic &&
          !this.shouldHideMember(c),
      )
      .map((c) => this.parseAccessor(c))

    const staticAccessors = children
      .filter(
        (c) =>
          c.kind === ReflectionKind.Accessor &&
          c.flags?.isStatic &&
          !this.shouldHideMember(c),
      )
      .map((c) => this.parseAccessor(c))

    const constructorReflection = children.find(
      (c) => c.kind === ReflectionKind.Constructor,
    )

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'class',
      description: this.extractDescription(reflection),
      isAbstract: reflection.flags?.isAbstract ?? false,
      isStatic: reflection.flags?.isStatic ?? false,
      isInternal: this.hasInternalTag(reflection),
      extends: this.parseExtends(reflection),
      implements: this.parseImplements(reflection),
      typeParameters: this.parseTypeParameters(reflection),
      constructor: constructorReflection
        ? this.parseConstructor(constructorReflection)
        : undefined,
      properties: properties.sort((a, b) => a.name.localeCompare(b.name)),
      methods: methods.sort((a, b) => a.name.localeCompare(b.name)),
      staticProperties: staticProperties.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
      staticMethods: staticMethods.sort((a, b) => a.name.localeCompare(b.name)),
      accessors: accessors.sort((a, b) => a.name.localeCompare(b.name)),
      staticAccessors: staticAccessors.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }
  }

  /**
   * Parse interface
   */
  private parseInterface(reflection: TypeDocReflection): ParsedItem {
    const children = reflection.children ?? []

    const properties = children
      .filter(
        (c) => c.kind === ReflectionKind.Property && !this.shouldHideMember(c),
      )
      .map((c) => this.parseProperty(c))

    const methods = children
      .filter(
        (c) => c.kind === ReflectionKind.Method && !this.shouldHideMember(c),
      )
      .map((c) => this.parseMethod(c))

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'interface',
      description: this.extractDescription(reflection),
      isInternal: this.hasInternalTag(reflection),
      extends: this.parseExtends(reflection),
      typeParameters: this.parseTypeParameters(reflection),
      constructor: undefined,
      properties: properties.sort((a, b) => a.name.localeCompare(b.name)),
      methods: methods.sort((a, b) => a.name.localeCompare(b.name)),
      staticProperties: [],
      staticMethods: [],
      accessors: [],
      staticAccessors: [],
    }
  }

  /**
   * Parse type alias
   */
  private parseTypeAlias(reflection: TypeDocReflection): ParsedItem {
    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'type',
      description: this.extractDescription(reflection),
      isInternal: this.hasInternalTag(reflection),
      typeParameters: this.parseTypeParameters(reflection),
      typeDefinition: this.stringifyType(reflection.type),
      typeRef: this.parseType(reflection.type),
      constructor: undefined,
      properties: [],
      methods: [],
      staticProperties: [],
      staticMethods: [],
      accessors: [],
      staticAccessors: [],
    }
  }

  /**
   * Parse enum
   */
  private parseEnum(reflection: TypeDocReflection): ParsedItem {
    const children = reflection.children ?? []
    const enumName = reflection.name

    const enumMembers: ParsedEnumMember[] = children
      .filter((c) => c.kind === ReflectionKind.EnumMember)
      .map((c) => {
        // Try to get parameters from EventMap first, fall back to JSDoc
        const eventMapParams = this.getEventParameters(enumName, c.name)
        const parameters: ParsedEventParameter[] | undefined = eventMapParams
          ? eventMapParams.map((p) => ({
              name: p.name,
              type: p.type,
              description: p.description,
            }))
          : this.extractEventParameters(c)

        return {
          name: c.name,
          value: this.extractEnumValue(c),
          description: this.extractDescription(c),
          parameters,
        }
      })

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'enum',
      description: this.extractDescription(reflection),
      isInternal: this.hasInternalTag(reflection),
      enumMembers,
      constructor: undefined,
      properties: [],
      methods: [],
      staticProperties: [],
      staticMethods: [],
      accessors: [],
      staticAccessors: [],
    }
  }

  /**
   * Extract description for a specific @param from JSDoc
   */
  private extractEventParamDescription(
    reflection: TypeDocReflection,
    paramName: string,
  ): string | undefined {
    const blockTags = reflection.comment?.blockTags
    if (!blockTags) return undefined

    const paramTag = blockTags.find(
      (tag) => tag.tag === '@param' && tag.name === paramName,
    )
    if (!paramTag) return undefined

    // Extract text parts only (skip type references)
    const description = paramTag.content
      .filter((part) => part.kind === 'text')
      .map((part) => part.text.replace(/^\s*-\s*/, ''))
      .join('')
      .trim()

    return description || undefined
  }

  /**
   * Extract event parameters from @param JSDoc tags on enum members
   * Supports both {@link Type} and `type` (backtick) formats
   * Used as fallback when EventMap is not available
   */
  private extractEventParameters(
    reflection: TypeDocReflection,
  ): ParsedEventParameter[] | undefined {
    const blockTags = reflection.comment?.blockTags
    if (!blockTags) return undefined

    const paramTags = blockTags.filter((tag) => tag.tag === '@param')
    if (paramTags.length === 0) return undefined

    return paramTags.map((tag) => {
      // Extract type from @link inline tag or backtick code in content
      let typeName = 'unknown'
      let description = ''

      for (const part of tag.content) {
        if (part.kind === 'inline-tag' && part.tag === '@link') {
          // {@link Type} format - for exported types
          typeName = part.text
        } else if (part.kind === 'code') {
          // `type` backtick format - for primitives
          typeName = part.text.replace(/^`|`$/g, '')
        } else if (part.kind === 'text') {
          // Remove leading " - " from description
          description += part.text.replace(/^\s*-\s*/, '')
        }
      }

      return {
        name: tag.name ?? 'unknown',
        type: { name: typeName },
        description: description.trim() || undefined,
      }
    })
  }

  /**
   * Parse function
   */
  private parseFunction(reflection: TypeDocReflection): ParsedItem {
    const signature = reflection.signatures?.[0]

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'function',
      description: signature
        ? this.extractDescriptionFromSignature(signature)
        : '',
      isInternal: this.hasInternalTag(reflection),
      constructor: undefined,
      methods: signature
        ? [this.parseMethodFromSignature(reflection.name, signature)]
        : [],
      properties: [],
      staticProperties: [],
      staticMethods: [],
      accessors: [],
      staticAccessors: [],
    }
  }

  /**
   * Parse variable (for constants/schemas)
   */
  private parseVariable(reflection: TypeDocReflection): ParsedItem | null {
    // Only include exported variables that look like schemas, constants, or type-like objects
    // - Schema$ : validation schemas
    // - ^[A-Z_]+$ : SCREAMING_SNAKE_CASE constants
    // - ^[A-Z][a-z] : PascalCase objects (e.g., NoticeLanguage, TimeZonesPerRegion)
    // - ^[a-z]+[A-Z] : camelCase objects (e.g., errorCategories, retryClassifications)
    if (!/Schema$|^[A-Z_]+$|^[A-Z][a-z]|^[a-z]+[A-Z]/.exec(reflection.name))
      return null

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'type',
      description: this.extractDescription(reflection),
      isInternal: this.hasInternalTag(reflection),
      typeDefinition: this.stringifyType(reflection.type),
      typeRef: this.parseType(reflection.type),
      constructor: undefined,
      properties: [],
      methods: [],
      staticProperties: [],
      staticMethods: [],
      accessors: [],
      staticAccessors: [],
    }
  }

  /**
   * Parse constructor
   */
  private parseConstructor(reflection: TypeDocReflection): ParsedConstructor {
    const signature = reflection.signatures?.[0]
    if (!signature) return { parameters: [] }

    return {
      parameters: (signature.parameters ?? []).map((p) =>
        this.parseParameter(p),
      ),
      description: this.extractDescriptionFromSignature(signature),
    }
  }

  /**
   * Parse property
   */
  private parseProperty(reflection: TypeDocReflection): ParsedProperty {
    return {
      name: reflection.name,
      type: this.parseType(reflection.type),
      description: this.extractDescription(reflection),
      isReadonly: reflection.flags?.isReadonly ?? false,
      isOptional: reflection.flags?.isOptional ?? false,
      isStatic: reflection.flags?.isStatic ?? false,
      isAbstract: reflection.flags?.isAbstract ?? false,
      isProtected: reflection.flags?.isProtected ?? false,
      defaultValue: reflection.defaultValue,
      warnings: this.extractWarnings(reflection.comment),
      additionalDescription: this.extractAdditionalDescription(
        reflection.comment,
      ),
      mapDescription: this.extractMapDescription(reflection),
    }
  }

  /**
   * Parse accessor (getter/setter)
   */
  private parseAccessor(reflection: TypeDocReflection): ParsedAccessor {
    const getSignature = reflection.getSignature
    const setSignature = reflection.setSignature

    // Get type from getter return type or setter parameter type
    let type: TypeReference = { name: 'unknown' }
    let description = ''

    if (getSignature) {
      type = this.parseType(getSignature.type)
      description = this.extractDescriptionFromSignature(getSignature)
    } else if (setSignature?.parameters?.[0]) {
      type = this.parseType(setSignature.parameters[0].type)
      description = this.extractDescriptionFromSignature(setSignature)
    }

    return {
      name: reflection.name,
      type,
      description,
      hasGetter: Boolean(getSignature),
      hasSetter: Boolean(setSignature),
      isStatic: reflection.flags?.isStatic ?? false,
      isAbstract: reflection.flags?.isAbstract ?? false,
      isProtected: reflection.flags?.isProtected ?? false,
      isOverride: false, // TypeDoc doesn't expose override flag directly
    }
  }

  /**
   * Parse method
   */
  private parseMethod(reflection: TypeDocReflection): ParsedMethod {
    const signature = reflection.signatures?.[0]
    if (!signature) {
      return {
        name: reflection.name,
        parameters: [],
        returnType: { name: 'void' },
        isAsync: false,
        isStatic: reflection.flags?.isStatic ?? false,
        isAbstract: reflection.flags?.isAbstract ?? false,
        isProtected: reflection.flags?.isProtected ?? false,
      }
    }

    return this.parseMethodFromSignature(
      reflection.name,
      signature,
      reflection.flags,
    )
  }

  /**
   * Parse method from signature
   */
  private parseMethodFromSignature(
    name: string,
    signature: TypeDocSignature,
    flags?: TypeDocFlags,
  ): ParsedMethod {
    const returnType = this.parseType(signature.type)
    const isAsync = returnType.name === 'Promise'

    return {
      name,
      parameters: (signature.parameters ?? []).map((p) =>
        this.parseParameter(p),
      ),
      returnType,
      description: this.extractDescriptionFromSignature(signature),
      isAsync,
      isStatic: flags?.isStatic ?? false,
      isAbstract: flags?.isAbstract ?? false,
      isProtected: flags?.isProtected ?? false,
      typeParameters: this.parseTypeParametersFromSignature(signature),
      example: this.extractExample(signature),
      returns: this.extractReturns(signature),
      warnings: this.extractWarnings(signature.comment),
      additionalDescription: this.extractAdditionalDescription(
        signature.comment,
      ),
    }
  }

  /**
   * Parse parameter
   */
  private parseParameter(param: TypeDocParameter): ParsedParameter {
    return {
      name: param.name,
      type: this.parseType(param.type),
      description: this.extractDescriptionFromParam(param),
      isOptional: param.flags?.isOptional ?? false,
      isRest: param.flags?.isRest ?? false,
      defaultValue: param.defaultValue,
    }
  }

  /**
   * Parse type
   */
  private parseType(type: TypeDocType | undefined): TypeReference {
    if (!type) return { name: 'unknown' }

    switch (type.type) {
      case 'intrinsic':
        return { name: type.name ?? 'unknown' }

      case 'reference':
        return {
          name: type.name ?? 'unknown',
          typeArguments: type.typeArguments?.map((t) => this.parseType(t)),
        }

      case 'array':
        return {
          ...this.parseType(type.elementType),
          isArray: true,
        }

      case 'union':
        return {
          name: (type.types ?? [])
            .map((t) => this.stringifyType(t))
            .join(' | '),
          isUnion: true,
          unionTypes: (type.types ?? []).map((t) => this.parseType(t)),
        }

      case 'literal':
        if (typeof type.value === 'string')
          return { name: `"${type.value}"`, literal: type.value }

        return { name: String(type.value), literal: String(type.value) }

      case 'reflection':
        return { name: this.stringifyReflectionType(type) }

      case 'tuple':
        return {
          name: `[${(type.elements ?? []).map((t) => this.stringifyType(t)).join(', ')}]`,
        }

      case 'intersection':
        return {
          name: (type.types ?? [])
            .map((t) => this.stringifyType(t))
            .join(' & '),
        }

      default:
        return { name: 'unknown' }
    }
  }

  /**
   * Stringify type
   */
  private stringifyType(type: TypeDocType | undefined): string {
    if (!type) return 'unknown'

    switch (type.type) {
      case 'intrinsic':
        return type.name ?? 'unknown'

      case 'reference': {
        const args = type.typeArguments
          ?.map((t) => this.stringifyType(t))
          .join(', ')
        const name = type.name ?? 'unknown'
        return args ? `${name}<${args}>` : name
      }

      case 'array':
        return `${this.stringifyType(type.elementType)}[]`

      case 'union':
        return (type.types ?? []).map((t) => this.stringifyType(t)).join(' | ')

      case 'literal':
        return typeof type.value === 'string'
          ? `"${type.value}"`
          : String(type.value)

      case 'reflection':
        return this.stringifyReflectionType(type)

      case 'tuple':
        return `[${(type.elements ?? []).map((t) => this.stringifyType(t)).join(', ')}]`

      case 'intersection':
        return (type.types ?? []).map((t) => this.stringifyType(t)).join(' & ')

      default:
        return 'unknown'
    }
  }

  /**
   * Stringify reflection type
   */
  private stringifyReflectionType(type: TypeDocType): string {
    const declaration = type.declaration
    if (!declaration) return '{}'

    if (declaration.signatures && declaration.signatures.length > 0) {
      const sig = declaration.signatures[0]
      const params =
        sig.parameters
          ?.map((p) => `${p.name}: ${this.stringifyType(p.type)}`)
          .join(', ') ?? ''
      const ret = this.stringifyType(sig.type)
      return `(${params}) => ${ret}`
    }

    if (declaration.children) {
      const props = declaration.children
        .map((c) => {
          const optional = c.flags?.isOptional ? '?' : ''
          return `${c.name}${optional}: ${this.stringifyType(c.type)}`
        })
        .join('; ')
      return `{ ${props} }`
    }

    return '{}'
  }

  /**
   * Parse extends
   */
  private parseExtends(
    reflection: TypeDocReflection,
  ): TypeReference | undefined {
    const extendedTypes = reflection.extendedTypes
    if (!extendedTypes || extendedTypes.length === 0) return undefined
    return this.parseType(extendedTypes[0])
  }

  /**
   * Parse implements
   */
  private parseImplements(
    reflection: TypeDocReflection,
  ): TypeReference[] | undefined {
    const implementedTypes = reflection.implementedTypes
    if (!implementedTypes || implementedTypes.length === 0) return undefined
    return implementedTypes.map((t) => this.parseType(t))
  }

  /**
   * Parse type parameters
   */
  private parseTypeParameters(
    reflection: TypeDocReflection,
  ): TypeParameter[] | undefined {
    const typeParameters = reflection.typeParameters
    if (!typeParameters || typeParameters.length === 0) return undefined
    return typeParameters.map((tp) => ({
      name: tp.name,
      constraint: tp.type ? this.parseType(tp.type) : undefined,
      default: tp.default ? this.parseType(tp.default) : undefined,
    }))
  }

  /**
   * Parse type parameters from signature
   */
  private parseTypeParametersFromSignature(
    signature: TypeDocSignature,
  ): TypeParameter[] | undefined {
    const typeParameters = signature.typeParameters
    if (!typeParameters || typeParameters.length === 0) return undefined
    return typeParameters.map((tp) => ({
      name: tp.name,
      constraint: tp.type ? this.parseType(tp.type) : undefined,
      default: tp.default ? this.parseType(tp.default) : undefined,
    }))
  }

  /**
   * Extract description
   */
  private extractDescription(reflection: TypeDocReflection): string {
    const comment = reflection.comment
    if (!comment) return ''

    const summary = comment.summary
    if (!summary) return ''

    return summary.map((s) => s.text).join('')
  }

  /**
   * Check if reflection has @internal tag
   */
  private hasInternalTag(reflection: TypeDocReflection): boolean {
    const comment = reflection.comment
    if (!comment) return false

    // Check modifierTags (TypeDoc stores @internal here)
    if (comment.modifierTags?.includes('@internal')) return true

    // Also check blockTags as fallback
    if (comment.blockTags?.some((tag) => tag.tag === '@internal')) return true

    return false
  }

  /**
   * Check if member is inherited from an @internal class
   */
  private isInheritedFromInternalClass(reflection: TypeDocReflection): boolean {
    if (!reflection.inheritedFrom) return false

    // inheritedFrom.name is like "AssetCacheManager._getCachedExcelBinOutputByName"
    const className = reflection.inheritedFrom.name.split('.')[0]
    return this.internalClasses.has(className)
  }

  /**
   * Check if member should be hidden (has @internal or inherited from @internal class)
   */
  private shouldHideMember(reflection: TypeDocReflection): boolean {
    return (
      this.hasInternalTag(reflection) ||
      this.isInheritedFromInternalClass(reflection)
    )
  }

  /**
   * Extract description from signature
   */
  private extractDescriptionFromSignature(signature: TypeDocSignature): string {
    const comment = signature.comment
    if (!comment) return ''

    const summary = comment.summary
    if (!summary) return ''

    return summary.map((s) => s.text).join('')
  }

  /**
   * Extract description from parameter
   */
  private extractDescriptionFromParam(param: TypeDocParameter): string {
    const comment = param.comment
    if (!comment) return ''

    const summary = comment.summary
    if (!summary) return ''

    return summary.map((s) => s.text).join('')
  }

  /**
   * Extract @example
   */
  private extractExample(signature: TypeDocSignature): string | undefined {
    const blockTags = signature.comment?.blockTags
    if (!blockTags) return undefined

    const exampleTag = blockTags.find((tag) => tag.tag === '@example')
    if (!exampleTag) return undefined

    return exampleTag.content.map((c) => c.text).join('')
  }

  /**
   * Extract @returns
   */
  private extractReturns(signature: TypeDocSignature): string | undefined {
    const blockTags = signature.comment?.blockTags
    if (!blockTags) return undefined

    const returnsTag = blockTags.find(
      (tag) => tag.tag === '@returns' || tag.tag === '@return',
    )
    if (!returnsTag) return undefined

    return returnsTag.content.map((c) => c.text).join('')
  }

  /**
   * Extract @key/@value for Map properties with type info
   */
  private extractMapDescription(reflection: TypeDocReflection):
    | {
        key: string
        keyType: TypeReference
        value: string
        valueType: TypeReference
      }
    | undefined {
    const blockTags = reflection.comment?.blockTags
    if (!blockTags) return undefined

    const keyTag = blockTags.find((tag) => tag.tag === '@key')
    const valueTag = blockTags.find((tag) => tag.tag === '@value')

    if (!keyTag && !valueTag) return undefined

    // Extract Map type arguments
    const type = reflection.type
    let keyType: TypeReference = { name: 'unknown' }
    let valueType: TypeReference = { name: 'unknown' }

    if (
      type?.type === 'reference' &&
      type.name === 'Map' &&
      type.typeArguments
    ) {
      keyType = this.parseType(type.typeArguments[0])
      valueType = this.parseType(type.typeArguments[1])
    }

    return {
      key: keyTag?.content.map((c) => c.text).join('') ?? '',
      keyType,
      value: valueTag?.content.map((c) => c.text).join('') ?? '',
      valueType,
    }
  }

  /**
   * Extract enum value
   */
  private extractEnumValue(reflection: TypeDocReflection): string | number {
    const type = reflection.type
    if (type?.type === 'literal' && type.value !== undefined)
      return type.value as string | number

    return reflection.name
  }

  /**
   * Extract @warn and @warning tags
   */
  private extractWarnings(comment: TypeDocComment | undefined): string[] {
    const blockTags = comment?.blockTags
    if (!blockTags) return []

    const warnings: string[] = []
    for (const tag of blockTags) {
      if (tag.tag === '@warn' || tag.tag === '@warning') {
        const text = tag.content
          .map((c) => c.text)
          .join('')
          .trim()
        if (text) warnings.push(text)
      }
    }
    return warnings
  }

  /**
   * Extract @description tag (additional description beyond summary)
   */
  private extractAdditionalDescription(
    comment: TypeDocComment | undefined,
  ): string | undefined {
    const blockTags = comment?.blockTags
    if (!blockTags) return undefined

    const descTag = blockTags.find((tag) => tag.tag === '@description')
    if (!descTag) return undefined

    return (
      descTag.content
        .map((c) => c.text)
        .join('')
        .trim() || undefined
    )
  }
}
