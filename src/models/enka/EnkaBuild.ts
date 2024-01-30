import { CharacterDetail } from '@/models/enka/CharacterDetail'
import { APIBuild } from '@/types/EnkaAccountTypes'

/**
 * Class of Enka Build
 */
export class EnkaBuild {
  /**
   * Build id
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
   * Create a EnkaBuild
   * @param data Data from EnkaNetwork
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
    this.url = `${genshinAccountURL}/${this.characterDetail.id}/${this.id}`
  }
}
