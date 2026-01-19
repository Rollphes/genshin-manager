/**
 * TypeDoc ReflectionKind values
 */
export const ReflectionKind = {
  Project: 1,
  Module: 2,
  Namespace: 4,
  Enum: 8,
  EnumMember: 16,
  Variable: 32,
  Function: 64,
  Class: 128,
  Interface: 256,
  Constructor: 512,
  Property: 1024,
  Method: 2048,
  CallSignature: 4096,
  IndexSignature: 8192,
  ConstructorSignature: 16384,
  Parameter: 32768,
  TypeLiteral: 65536,
  TypeParameter: 131072,
  Accessor: 262144,
  GetSignature: 524288,
  SetSignature: 1048576,
  TypeAlias: 2097152,
  Reference: 4194304,
} as const

export type ReflectionKindValue =
  (typeof ReflectionKind)[keyof typeof ReflectionKind]

/**
 * Parsed item (class/interface/type/enum/function)
 */
export interface ParsedItem {
  id: number
  name: string
  domain: string
  kind: 'class' | 'interface' | 'type' | 'enum' | 'function'
  description: string
  isAbstract?: boolean
  isStatic?: boolean
  /** @internal tagged item - should be excluded from docs output */
  isInternal?: boolean
  extends?: TypeReference
  implements?: TypeReference[]
  typeParameters?: TypeParameter[]
  constructor?: ParsedConstructor
  properties: ParsedProperty[]
  methods: ParsedMethod[]
  staticProperties: ParsedProperty[]
  staticMethods: ParsedMethod[]
  accessors: ParsedAccessor[]
  staticAccessors: ParsedAccessor[]
  enumMembers?: ParsedEnumMember[]
  typeDefinition?: string
  typeRef?: TypeReference
}

export interface TypeReference {
  name: string
  path?: string
  typeArguments?: TypeReference[]
  isArray?: boolean
  isUnion?: boolean
  unionTypes?: TypeReference[]
  isOptional?: boolean
  isRest?: boolean
  literal?: string
}

export interface TypeParameter {
  name: string
  constraint?: TypeReference
  default?: TypeReference
}

export interface ParsedConstructor {
  parameters: ParsedParameter[]
  description?: string
}

export interface ParsedProperty {
  name: string
  type: TypeReference
  description?: string
  isReadonly: boolean
  isOptional: boolean
  isStatic: boolean
  isAbstract: boolean
  isProtected: boolean
  defaultValue?: string
  warnings?: string[]
  additionalDescription?: string
  mapDescription?: {
    key: string
    keyType: TypeReference
    value: string
    valueType: TypeReference
  }
}

export interface ParsedMethod {
  name: string
  parameters: ParsedParameter[]
  returnType: TypeReference
  description?: string
  isAsync: boolean
  isStatic: boolean
  isAbstract: boolean
  isProtected: boolean
  typeParameters?: TypeParameter[]
  example?: string
  returns?: string
  warnings?: string[]
  additionalDescription?: string
}

export interface ParsedParameter {
  name: string
  type: TypeReference
  description?: string
  isOptional: boolean
  isRest: boolean
  defaultValue?: string
}

export interface ParsedEnumMember {
  name: string
  value: string | number
  description?: string
  /** Event parameters from @param JSDoc tags */
  parameters?: ParsedEventParameter[]
}

export interface ParsedEventParameter {
  name: string
  type: TypeReference
  description?: string
}

export interface ParsedAccessor {
  name: string
  type: TypeReference
  description?: string
  hasGetter: boolean
  hasSetter: boolean
  isStatic: boolean
  isAbstract: boolean
  isProtected: boolean
  isOverride: boolean
}

/**
 * Type link map: type name -> document path
 */
export type TypeLinkMap = Map<string, string>

/**
 * Domain classification result
 */
export interface DomainClassification {
  domain: string
  category: 'classes' | 'interfaces' | 'types' | 'functions'
  items: ParsedItem[]
}

/**
 * Generator configuration
 */
export interface GeneratorConfig {
  outputDir: string
  typeLinkMap: TypeLinkMap
  guideBasePath: string
  guideLinks: Record<string, string>
  hideExtends?: boolean
  hideImplements?: boolean
  /** Maps class names to their event enum names */
  eventMappings?: Record<string, string>
  /** All parsed items for resolving event enums */
  allItems?: ParsedItem[]
}

/**
 * Domain rule for classification
 */
export interface DomainRule {
  domain: string
  match?: string[]
  matchPattern?: string
}

/**
 * API docs generator config file format
 */
export interface ApiDocsConfig {
  typedocJson: string
  outputDir: string
  guideBasePath: string
  /** Hide @internal tagged items from documentation */
  hideInternal?: boolean
  hideExtends?: boolean
  hideImplements?: boolean
  guideLinks: Record<string, string>
  /** Maps class names to their event enum names */
  eventMappings?: Record<string, string>
  domainRules: DomainRule[]
  domainOrder: string[]
  categoryOrder: string[]
  defaultDomain: string
}

/**
 * Event parameter info extracted from EventMap interface
 */
export interface EventMapParameter {
  name: string
  type: TypeReference
  description?: string
}
