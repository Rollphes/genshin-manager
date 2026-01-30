import type { CVType } from '@/types/types'

/**
 * Constructor data for CharacterProfile
 */
export interface CharacterProfileData {
  /** Character ID */
  readonly characterId: number
  /** Fetter ID */
  readonly fetterId: number
  /** Birth date */
  readonly birthDate: Date | undefined
  /** Affiliation */
  readonly native: string
  /** Vision */
  readonly vision: string
  /** Constellation name */
  readonly constellation: string
  /** Profile title */
  readonly title: string
  /** Profile detail */
  readonly detail: string
  /** Association type */
  readonly assocType: string
  /** Voice actors by language */
  readonly cv: Readonly<Record<CVType, string>>
}

/**
 * Character profile information.
 * Pure DTO.
 */
export class CharacterProfile {
  /** Character ID */
  public readonly characterId: number
  /** Fetter ID */
  public readonly fetterId: number
  /** Birth date */
  public readonly birthDate: Date | undefined
  /** Affiliation */
  public readonly native: string
  /** Vision */
  public readonly vision: string
  /** Constellation name */
  public readonly constellation: string
  /** Profile title */
  public readonly title: string
  /** Profile detail */
  public readonly detail: string
  /** Association type */
  public readonly assocType: string
  /** Voice actors by language */
  public readonly cv: Readonly<Record<CVType, string>>

  /**
   * Create a CharacterProfile
   * @param data - Pre-resolved profile data
   */
  constructor(data: CharacterProfileData) {
    this.characterId = data.characterId
    this.fetterId = data.fetterId
    this.birthDate = data.birthDate
    this.native = data.native
    this.vision = data.vision
    this.constellation = data.constellation
    this.title = data.title
    this.detail = data.detail
    this.assocType = data.assocType
    this.cv = data.cv
  }
}
