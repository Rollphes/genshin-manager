import fs from 'fs'

import {
  type ParsedClass,
  type ParsedConstructor,
  type ParsedEnumMember,
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
  type?: TypeDocType
  extendedTypes?: TypeDocType[]
  implementedTypes?: TypeDocType[]
  typeParameters?: TypeDocTypeParameter[]
  defaultValue?: string
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
}

interface TypeDocCommentPart {
  kind: string
  text: string
}

interface TypeDocBlockTag {
  tag: string
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
}

export class TypeDocParser {
  private project: TypeDocProject

  constructor(jsonPath: string) {
    const content = fs.readFileSync(jsonPath, 'utf-8')
    this.project = JSON.parse(content) as TypeDocProject
  }

  /**
   * Parse all exported items
   */
  public parseAll(): ParsedClass[] {
    const results: ParsedClass[] = []
    const children = this.project.children ?? []

    for (const child of children) {
      const parsed = this.parseReflection(child)
      if (parsed) results.push(parsed)
    }

    return results
  }

  /**
   * Parse individual reflection
   */
  private parseReflection(reflection: TypeDocReflection): ParsedClass | null {
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
  private parseClass(reflection: TypeDocReflection): ParsedClass {
    const children = reflection.children ?? []

    const properties = children
      .filter((c) => c.kind === ReflectionKind.Property && !c.flags?.isStatic)
      .map((c) => this.parseProperty(c))

    const methods = children
      .filter((c) => c.kind === ReflectionKind.Method && !c.flags?.isStatic)
      .map((c) => this.parseMethod(c))

    const staticProperties = children
      .filter((c) => c.kind === ReflectionKind.Property && c.flags?.isStatic)
      .map((c) => this.parseProperty(c))

    const staticMethods = children
      .filter((c) => c.kind === ReflectionKind.Method && c.flags?.isStatic)
      .map((c) => this.parseMethod(c))

    const constructorReflection = children.find(
      (c) => c.kind === ReflectionKind.Constructor,
    )

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'class',
      description: this.extractDescription(reflection),
      extends: this.parseExtends(reflection),
      implements: this.parseImplements(reflection),
      typeParameters: this.parseTypeParameters(reflection),
      constructor: constructorReflection
        ? this.parseConstructor(constructorReflection)
        : undefined,
      properties: properties.sort((a, b) => a.name.localeCompare(b.name)),
      methods: methods.sort((a, b) => a.name.localeCompare(b.name)),
      events: [],
      staticProperties: staticProperties.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
      staticMethods: staticMethods.sort((a, b) => a.name.localeCompare(b.name)),
    }
  }

  /**
   * Parse interface
   */
  private parseInterface(reflection: TypeDocReflection): ParsedClass {
    const children = reflection.children ?? []

    const properties = children
      .filter((c) => c.kind === ReflectionKind.Property)
      .map((c) => this.parseProperty(c))

    const methods = children
      .filter((c) => c.kind === ReflectionKind.Method)
      .map((c) => this.parseMethod(c))

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'interface',
      description: this.extractDescription(reflection),
      extends: this.parseExtends(reflection),
      typeParameters: this.parseTypeParameters(reflection),
      properties: properties.sort((a, b) => a.name.localeCompare(b.name)),
      methods: methods.sort((a, b) => a.name.localeCompare(b.name)),
      events: [],
      staticProperties: [],
      staticMethods: [],
    }
  }

  /**
   * Parse type alias
   */
  private parseTypeAlias(reflection: TypeDocReflection): ParsedClass {
    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'type',
      description: this.extractDescription(reflection),
      typeParameters: this.parseTypeParameters(reflection),
      typeDefinition: this.stringifyType(reflection.type),
      typeRef: this.parseType(reflection.type),
      properties: [],
      methods: [],
      events: [],
      staticProperties: [],
      staticMethods: [],
    }
  }

  /**
   * Parse enum
   */
  private parseEnum(reflection: TypeDocReflection): ParsedClass {
    const children = reflection.children ?? []

    const enumMembers: ParsedEnumMember[] = children
      .filter((c) => c.kind === ReflectionKind.EnumMember)
      .map((c) => ({
        name: c.name,
        value: this.extractEnumValue(c),
        description: this.extractDescription(c),
      }))

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'enum',
      description: this.extractDescription(reflection),
      enumMembers,
      properties: [],
      methods: [],
      events: [],
      staticProperties: [],
      staticMethods: [],
    }
  }

  /**
   * Parse function
   */
  private parseFunction(reflection: TypeDocReflection): ParsedClass {
    const signature = reflection.signatures?.[0]

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'function',
      description: signature
        ? this.extractDescriptionFromSignature(signature)
        : '',
      methods: signature
        ? [this.parseMethodFromSignature(reflection.name, signature)]
        : [],
      properties: [],
      events: [],
      staticProperties: [],
      staticMethods: [],
    }
  }

  /**
   * Parse variable (for constants/schemas)
   */
  private parseVariable(reflection: TypeDocReflection): ParsedClass | null {
    // Only include exported variables that look like schemas or constants
    if (!/Schema$|^[A-Z_]+$/.exec(reflection.name)) return null

    return {
      id: reflection.id,
      name: reflection.name,
      domain: '',
      kind: 'type',
      description: this.extractDescription(reflection),
      typeDefinition: this.stringifyType(reflection.type),
      typeRef: this.parseType(reflection.type),
      properties: [],
      methods: [],
      events: [],
      staticProperties: [],
      staticMethods: [],
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
      defaultValue: reflection.defaultValue,
      warnings: this.extractWarnings(reflection.comment),
      additionalDescription: this.extractAdditionalDescription(reflection.comment),
      mapDescription: this.extractMapDescription(reflection),
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
      typeParameters: this.parseTypeParametersFromSignature(signature),
      example: this.extractExample(signature),
      returns: this.extractReturns(signature),
      warnings: this.extractWarnings(signature.comment),
      additionalDescription: this.extractAdditionalDescription(signature.comment),
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
        const text = tag.content.map((c) => c.text).join('').trim()
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

    return descTag.content.map((c) => c.text).join('').trim() || undefined
  }
}
