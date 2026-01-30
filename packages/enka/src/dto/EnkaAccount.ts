import type { OwnerResponse } from '@/types/api/responses'

/**
 * Constructor data for EnkaAccount
 */
export interface EnkaAccountData {
  /** Account ID */
  readonly id: number
  /** Account name */
  readonly username: string
  /** Account biography */
  readonly bio: string
  /** Account level */
  readonly level: number
  /** Account signup state */
  readonly signupState: number
  /** Account avatar URL */
  readonly avatar: string | undefined
  /** Account image URL */
  readonly imageURL: string
  /** Enkanetwork URL */
  readonly url: string
  /** Raw data from EnkaNetwork */
  readonly data: OwnerResponse
}

/**
 * Represents an EnkaNetwork user account.
 * Pure DTO.
 */
export class EnkaAccount {
  /** Account ID */
  public readonly id: number
  /** Account name */
  public readonly username: string
  /** Account biography */
  public readonly bio: string
  /** Account level */
  public readonly level: number
  /** Account signup state */
  public readonly signupState: number
  /** Account avatar URL */
  public readonly avatar: string | undefined
  /** Account image URL */
  public readonly imageURL: string
  /** Enkanetwork URL */
  public readonly url: string
  /** Raw data */
  public readonly data: OwnerResponse

  /**
   * Create an EnkaAccount
   * @param data - Pre-resolved account data
   */
  constructor(data: EnkaAccountData) {
    this.id = data.id
    this.username = data.username
    this.bio = data.bio
    this.level = data.level
    this.signupState = data.signupState
    this.avatar = data.avatar
    this.imageURL = data.imageURL
    this.url = data.url
    this.data = data.data
  }

  /**
   * Build an EnkaAccount from API response
   * @param ownerData - API response
   * @param enkaBaseURL - Enka base URL
   * @returns EnkaAccount instance
   */
  public static fromResponse(
    ownerData: OwnerResponse,
    enkaBaseURL: string,
  ): EnkaAccount {
    return new EnkaAccount({
      id: ownerData.id,
      username: ownerData.username,
      bio: ownerData.profile.bio,
      level: ownerData.profile.level,
      signupState: ownerData.profile.signup_state,
      avatar: ownerData.profile.avatar ?? undefined,
      imageURL: ownerData.profile.image_url,
      url: `${enkaBaseURL}/u/${ownerData.username}`,
      data: ownerData,
    })
  }
}
