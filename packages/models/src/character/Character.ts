import type {
  CharacterAscension,
  CostItem,
} from '@/character/CharacterAscension'
import type { CharacterBaseStats } from '@/character/CharacterBaseStats'
import type { CharacterConstellation } from '@/character/CharacterConstellation'
import type { CharacterCostume } from '@/character/CharacterCostume'
import type { CharacterInfo } from '@/character/CharacterInfo'
import type { CharacterInherentSkill } from '@/character/CharacterInherentSkill'
import type { CharacterProfile } from '@/character/CharacterProfile'
import type { CharacterStory } from '@/character/CharacterStory'

/**
 * Ascension material with material ID and count
 */
export interface AscensionMaterial {
  /** Material ID */
  readonly id: number
  /** Material count */
  readonly count: number
}

/**
 * Constructor data for Character
 */
export interface CharacterData {
  /** Character info */
  readonly info: CharacterInfo
  /** Base stats at current level */
  readonly baseStats: CharacterBaseStats
  /** Current ascension data */
  readonly ascension: CharacterAscension
  /** Constellations (ordered, with locked status) */
  readonly constellations: readonly CharacterConstellation[]
  /** Inherent skills */
  readonly inherentSkills: readonly CharacterInherentSkill[]
  /** Profile */
  readonly profile: CharacterProfile | undefined
  /** Stories */
  readonly stories: readonly CharacterStory[]
  /** Costumes */
  readonly costumes: readonly CharacterCostume[]
  /** Constellation level (0-6) */
  readonly constellationLevel: number
  /** All ascension materials (for all promote levels) */
  readonly allAscensionMaterials: readonly CostItem[]
}

/**
 * Full character aggregate DTO.
 * Composes all character sub-DTOs into a single object.
 * Pure DTO — all data is pre-resolved by Repository.
 */
export class Character {
  /** Character info */
  public readonly info: CharacterInfo
  /** Base stats at current level */
  public readonly baseStats: CharacterBaseStats
  /** Current ascension data */
  public readonly ascension: CharacterAscension
  /** Constellations */
  public readonly constellations: readonly CharacterConstellation[]
  /** Inherent skills */
  public readonly inherentSkills: readonly CharacterInherentSkill[]
  /** Profile */
  public readonly profile: CharacterProfile | undefined
  /** Stories */
  public readonly stories: readonly CharacterStory[]
  /** Costumes */
  public readonly costumes: readonly CharacterCostume[]
  /** Constellation level (0-6) */
  public readonly constellationLevel: number
  /** All ascension materials */
  public readonly allAscensionMaterials: readonly CostItem[]

  /**
   * Create a Character
   * @param data - Pre-resolved character data
   */
  constructor(data: CharacterData) {
    this.info = data.info
    this.baseStats = data.baseStats
    this.ascension = data.ascension
    this.constellations = data.constellations
    this.inherentSkills = data.inherentSkills
    this.profile = data.profile
    this.stories = data.stories
    this.costumes = data.costumes
    this.constellationLevel = data.constellationLevel
    this.allAscensionMaterials = data.allAscensionMaterials
  }

  /**
   * Character ID (shortcut)
   */
  public get id(): number {
    return this.info.id
  }

  /**
   * Character name (shortcut)
   */
  public get name(): string {
    return this.info.name
  }

  /**
   * Character level (shortcut)
   */
  public get level(): number {
    return this.baseStats.level
  }

  /**
   * Whether character can still ascend
   */
  public get isCanAscend(): boolean {
    return this.baseStats.level < this.info.maxLevel
  }
}
