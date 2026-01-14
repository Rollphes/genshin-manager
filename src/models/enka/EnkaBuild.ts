import { CharacterDetail } from '@/models/enka/CharacterDetail'
import { APIBuild } from '@/types/enkaNetwork/EnkaAccountTypes'

/**
 * Represents a character build configuration from EnkaNetwork showcases
 */
export class EnkaBuild {
  /**
   * Build ID
   */
  public readonly id: number
  /**
   * Build name
   */
  public readonly name: string
  /**
   * Build description
   */
  public readonly description: string
  /**
   * Build custom art source URL
   */
  public readonly customArtURL?: string
  /**
   * Character Detail
   */
  public readonly characterDetail: CharacterDetail
  /**
   * Is the public
   */
  public readonly isPublic: boolean
  /**
   * Is the live preview
   */
  public readonly isLive: boolean
  /**
   * Is adaptive color
   */
  public readonly isAdaptiveColor: boolean
  /**
   * honkard width
   */
  public readonly honkardWidth: number
  /**
   * EnkaNetwork URL
   */
  public readonly url: string
  /**
   * Data from EnkaNetwork
   */
  public readonly data: APIBuild

  /**
   * Create a EnkaBuild
   * @param data data from EnkaNetwork
   * @param genshinAccountURL URL of enka.network game account
   */
  constructor(data: APIBuild, genshinAccountURL: string) {
    this.id = data.id
    this.name = data.name
    this.description = data.settings.caption ?? ''
    this.characterDetail = new CharacterDetail(data.avatar_data)
    this.isPublic = data.public
    this.isLive = data.live
    this.customArtURL = data.image ?? data.settings.artSource ?? undefined
    this.isAdaptiveColor = data.settings.adaptiveColor ?? false
    this.honkardWidth = data.settings.honkardWidth ?? 0
    this.url = `${genshinAccountURL}/${String(this.characterDetail.id)}/${String(this.id)}`
    this.data = data
  }
}
