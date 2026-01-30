import type { ImageAssets } from '@/assets/ImageAssets'
import type { StatProperty } from '@/common/StatProperty'
import type { EquipType, FightProp } from '@/types/enums'

/**
 * Sub-stat append property
 */
export interface ArtifactAppendProp {
  /** Append property ID */
  readonly id: number
  /** Stat type */
  readonly type: FightProp
  /** Stat value */
  readonly value: number
}

/**
 * Constructor data for Artifact
 */
export interface ArtifactData {
  /** Artifact ID */
  readonly id: number
  /** Artifact level (0-20) */
  readonly level: number
  /** Equipment type (flower, plume, etc.) */
  readonly type: EquipType
  /** Artifact name */
  readonly name: string
  /** Artifact description */
  readonly description: string
  /** Set ID */
  readonly setId: number | undefined
  /** Set name */
  readonly setName: string | undefined
  /** Set descriptions by piece count (1, 2, or 4) */
  readonly setDescriptions: Readonly<Record<number, string | undefined>>
  /** Rarity (1-5) */
  readonly rarity: number
  /** Main stat */
  readonly mainStat: StatProperty
  /** Aggregated sub stats */
  readonly subStats: readonly StatProperty[]
  /** Individual append properties */
  readonly appendProps: readonly ArtifactAppendProp[]
  /** Artifact icon */
  readonly icon: ImageAssets
}

/**
 * Artifact data with stats and set information.
 * Pure DTO — no static dependencies.
 */
export class Artifact {
  /** Artifact ID */
  public readonly id: number
  /** Artifact level */
  public readonly level: number
  /** Equipment type */
  public readonly type: EquipType
  /** Artifact name */
  public readonly name: string
  /** Artifact description */
  public readonly description: string
  /** Set ID */
  public readonly setId: number | undefined
  /** Set name */
  public readonly setName: string | undefined
  /** Set descriptions by piece count */
  public readonly setDescriptions: Readonly<Record<number, string | undefined>>
  /** Rarity */
  public readonly rarity: number
  /** Main stat */
  public readonly mainStat: StatProperty
  /** Aggregated sub stats */
  public readonly subStats: readonly StatProperty[]
  /** Individual append properties */
  public readonly appendProps: readonly ArtifactAppendProp[]
  /** Artifact icon */
  public readonly icon: ImageAssets

  /**
   * Create an Artifact
   * @param data - Pre-resolved artifact data
   */
  constructor(data: ArtifactData) {
    this.id = data.id
    this.level = data.level
    this.type = data.type
    this.name = data.name
    this.description = data.description
    this.setId = data.setId
    this.setName = data.setName
    this.setDescriptions = data.setDescriptions
    this.rarity = data.rarity
    this.mainStat = data.mainStat
    this.subStats = data.subStats
    this.appendProps = data.appendProps
    this.icon = data.icon
  }
}
