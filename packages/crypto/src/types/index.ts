import type { JsonPrimitive } from '@/types/json'
/**
 * Brand symbol for PathSegment
 */
declare const _pathSegmentBrand: unique symbol

/**
 * Branded type for path segments in flattened entries
 * Ensures type safety when working with JSON property paths
 */
export type PathSegment = string & {
  readonly [_pathSegmentBrand]: typeof _pathSegmentBrand
}

/**
 * Brand symbol for FeatureKey
 */
declare const _featureKeyBrand: unique symbol

/**
 * Branded type for feature keys used in Map lookups
 * Represents a serialized (value + pattern) combination for uniqueness checks
 */
export type FeatureKey = string & {
  readonly [_featureKeyBrand]: typeof _featureKeyBrand
}

/**
 * Value type classification
 */
export type ValueType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'array'
  | 'object'

/**
 * Flattened entry representing a single property path and its value
 */
export interface FlattenedEntry {
  /** Property path segments (e.g., ['propGrowCurves', '0', 'growCurve']) */
  path: PathSegment[]
  /** The primitive value at this path */
  value: JsonPrimitive
  /** Type of the value */
  valueType: ValueType
}

/**
 * Path feature for pattern matching
 */
export interface PathFeature {
  /** Property path segments */
  path: PathSegment[]
  /** The primitive value */
  value: JsonPrimitive
  /** Structure pattern for matching */
  pattern: StructurePattern
}

/**
 * All features for a single JSON element
 */
export type ElementFeatures = PathFeature[]

/**
 * All features for all elements in a single file
 */
export type FileFeatures = ElementFeatures[]

/**
 * Structure pattern for feature matching
 */
export interface StructurePattern {
  /** Depth level */
  depth: number
  /** Type of the value */
  valueType: ValueType
  /** Whether the value is an enum (UPPER_SNAKE_CASE) */
  isEnum: boolean
  /** Whether this value is an array element */
  isArrayElement: boolean
  /** Number of array levels in the path (how deeply nested in arrays) */
  arrayDepth: number
}

/**
 * Feature = multiple values + structure pattern
 * Multiple values are used for drift-resistant matching
 */
export interface Feature {
  /** Multiple primitive values for robust matching (max 10, selected by diversity) */
  values: JsonPrimitive[]
  /** Structure pattern */
  pattern: StructurePattern
}

/**
 * Entry for feature-to-key mapping during extraction
 * Groups all data associated with a single FeatureKey
 */
export interface FeatureEntry {
  /** Set of correct key names that map to this feature */
  correctKeys: Set<PathSegment>
  /** Ancestor key names [parent, grandparent, ...] */
  ancestorKeys: PathSegment[]
  /** The primitive value */
  value: JsonPrimitive
  /** Structure pattern */
  pattern: StructurePattern
}

/**
 * Anchor = unique feature + correct key + ancestor keys
 */
export interface Anchor {
  /** Feature for matching */
  feature: Feature
  /** Correct key name (user-verified) */
  correctKey: PathSegment
  /** Ancestor key names for hierarchy reconstruction [parent, grandparent, ...] */
  ancestorKeys: PathSegment[]
}

/**
 * Cross-file anchor for keys that are unique in some files but not others
 */
export interface CrossFileAnchor {
  /** Correct key name */
  correctKey: PathSegment
  /** Structure pattern */
  pattern: StructurePattern
  /** Source file where this key is uniquely identifiable */
  sourceFile: string
  /** Sample values for reference */
  sampleValues: JsonPrimitive[]
}

/**
 * Anchor file output format
 */
export interface AnchorFile {
  /** Metadata */
  metadata: {
    sourceFile: AnchorName
    commitId: string
    generatedAt: string
    totalElements: number
  }
  /** Anchors extracted from single file */
  anchors: Anchor[]
  /** Anchors resolved from cross-file analysis */
  crossFileAnchors: Anchor[]
  /** Ancestor keys derivable from child anchors */
  derivedAncestorKeys: PathSegment[]
  /** Keys excluded due to non-uniqueness */
  excludedKeys: PathSegment[]
}

/**
 * Options for KeyRestorer.restore()
 */
export interface RestoreOptions {
  /** Exclude encrypted keys (all uppercase) from data output. Default: false */
  excludeEncryptedKeysFromData?: boolean
}

/**
 * Result of key restoration
 */
export interface RestorationResult {
  /** Restored data with correct key names */
  data: unknown[]
  /** Encrypted keys that were successfully mapped to correct keys */
  restoredKeys: PathSegment[]
  /** Encrypted keys that could not be mapped (kept as-is) */
  unresolvedKeys: PathSegment[]
}

/**
 * Available anchor names for KeyRestorer
 */
export const AnchorNames = {
  AnimalCodexExcelConfigData: 'AnimalCodexExcelConfigData',
  AvatarCostumeExcelConfigData: 'AvatarCostumeExcelConfigData',
  AvatarCurveExcelConfigData: 'AvatarCurveExcelConfigData',
  AvatarExcelConfigData: 'AvatarExcelConfigData',
  AvatarPromoteExcelConfigData: 'AvatarPromoteExcelConfigData',
  AvatarSkillDepotExcelConfigData: 'AvatarSkillDepotExcelConfigData',
  AvatarSkillExcelConfigData: 'AvatarSkillExcelConfigData',
  AvatarTalentExcelConfigData: 'AvatarTalentExcelConfigData',
  DungeonEntryExcelConfigData: 'DungeonEntryExcelConfigData',
  DungeonLevelEntityConfigData: 'DungeonLevelEntityConfigData',
  EquipAffixExcelConfigData: 'EquipAffixExcelConfigData',
  FetterInfoExcelConfigData: 'FetterInfoExcelConfigData',
  FetterStoryExcelConfigData: 'FetterStoryExcelConfigData',
  FettersExcelConfigData: 'FettersExcelConfigData',
  ManualTextMapConfigData: 'ManualTextMapConfigData',
  MaterialExcelConfigData: 'MaterialExcelConfigData',
  MonsterCurveExcelConfigData: 'MonsterCurveExcelConfigData',
  MonsterDescribeExcelConfigData: 'MonsterDescribeExcelConfigData',
  MonsterExcelConfigData: 'MonsterExcelConfigData',
  ProfilePictureExcelConfigData: 'ProfilePictureExcelConfigData',
  ProudSkillExcelConfigData: 'ProudSkillExcelConfigData',
  ReliquaryAffixExcelConfigData: 'ReliquaryAffixExcelConfigData',
  ReliquaryExcelConfigData: 'ReliquaryExcelConfigData',
  ReliquaryLevelExcelConfigData: 'ReliquaryLevelExcelConfigData',
  ReliquaryMainPropExcelConfigData: 'ReliquaryMainPropExcelConfigData',
  ReliquarySetExcelConfigData: 'ReliquarySetExcelConfigData',
  TowerFloorExcelConfigData: 'TowerFloorExcelConfigData',
  TowerLevelExcelConfigData: 'TowerLevelExcelConfigData',
  TowerScheduleExcelConfigData: 'TowerScheduleExcelConfigData',
  WeaponCurveExcelConfigData: 'WeaponCurveExcelConfigData',
  WeaponExcelConfigData: 'WeaponExcelConfigData',
  WeaponPromoteExcelConfigData: 'WeaponPromoteExcelConfigData',
} as const

/**
 * Anchor name type derived from AnchorNames
 */
export type AnchorName = (typeof AnchorNames)[keyof typeof AnchorNames]
