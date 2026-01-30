import { CharacterDetail } from '@/dto/CharacterDetail'
import type { BuildResponse } from '@/types/api/responses'

/**
 * Constructor data for EnkaBuild
 */
export interface EnkaBuildData {
  /** Build ID */
  readonly id: number
  /** Build name */
  readonly name: string
  /** Character ID (as string from API) */
  readonly avatarId: string
  /** Build order */
  readonly order: number
  /** Whether this is a live preview */
  readonly isLive: boolean
  /** Whether this build is public */
  readonly isPublic: boolean
  /** Build description/caption */
  readonly description: string | undefined
  /** Honkard width setting */
  readonly honkardWidth: number | undefined
  /** Whether adaptive color is enabled */
  readonly isAdaptiveColor: boolean
  /** Image URL */
  readonly imageURL: string | undefined
  /** Character detail data */
  readonly characterDetail: CharacterDetail
}

/**
 * Build configuration from Enka.Network profile.
 * Pure DTO — stores API data with CharacterDetail.
 */
export class EnkaBuild {
  /** Build ID */
  public readonly id: number
  /** Build name */
  public readonly name: string
  /** Character ID */
  public readonly avatarId: string
  /** Build order */
  public readonly order: number
  /** Whether this is a live preview */
  public readonly isLive: boolean
  /** Whether this build is public */
  public readonly isPublic: boolean
  /** Build description */
  public readonly description: string | undefined
  /** Honkard width */
  public readonly honkardWidth: number | undefined
  /** Whether adaptive color is enabled */
  public readonly isAdaptiveColor: boolean
  /** Image URL */
  public readonly imageURL: string | undefined
  /** Character detail */
  public readonly characterDetail: CharacterDetail

  /**
   * Create an EnkaBuild
   * @param data - Pre-resolved build data
   */
  constructor(data: EnkaBuildData) {
    this.id = data.id
    this.name = data.name
    this.avatarId = data.avatarId
    this.order = data.order
    this.isLive = data.isLive
    this.isPublic = data.isPublic
    this.description = data.description
    this.honkardWidth = data.honkardWidth
    this.isAdaptiveColor = data.isAdaptiveColor
    this.imageURL = data.imageURL
    this.characterDetail = data.characterDetail
  }

  /**
   * Build an EnkaBuild from a BuildResponse
   * @param response - Enka API build response
   * @returns EnkaBuild instance
   */
  public static fromResponse(response: BuildResponse): EnkaBuild {
    return new EnkaBuild({
      id: response.id,
      name: response.name,
      avatarId: response.avatar_id,
      order: response.order,
      isLive: response.live,
      isPublic: response.public,
      description: response.settings.caption,
      honkardWidth: response.settings.honkardWidth,
      isAdaptiveColor: response.settings.adaptiveColor ?? false,
      imageURL: response.image ?? undefined,
      characterDetail: CharacterDetail.fromResponse(response.avatar_data),
    })
  }
}
