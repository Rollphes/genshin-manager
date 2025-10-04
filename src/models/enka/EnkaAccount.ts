import { APIOwner } from '@/types/enkaNetwork'

/**
 * Represents an EnkaNetwork user account with access credentials
 */
export class EnkaAccount {
  /**
   * Account ID
   */
  public readonly id: number
  /**
   * Account name
   */
  public readonly username: string
  /**
   * Account biography
   */
  public readonly bio: string
  /**
   * Account level
   */
  public readonly level: number
  /**
   * Account signup state
   */
  public readonly signupState: number
  /**
   * Account avatar URL
   */
  public readonly avatar?: string
  /**
   * Account image URL
   */
  public readonly imageURL: string
  /**
   * Enkanetwork URL
   */
  public readonly url: string
  /**
   * Data from EnkaNetwork
   */
  public readonly data: APIOwner

  /**
   * Create a EnkaAccount
   * @param ownerData ownerData from EnkaNetwork
   * @param enkaBaseURL URL of enka.network
   */
  constructor(ownerData: APIOwner, enkaBaseURL: string) {
    this.id = ownerData.id
    this.username = ownerData.username
    this.bio = ownerData.profile.bio
    this.level = ownerData.profile.level
    this.signupState = ownerData.profile.signup_state
    this.avatar = ownerData.profile.avatar ?? undefined
    this.imageURL = ownerData.profile.image_url
    this.url = `${enkaBaseURL}/u/${this.username}`
    this.data = ownerData
  }
}
