/**
 * Constructor data for ImageAssets
 */
export interface ImageAssetsData {
  /** Image name (e.g. "UI_AvatarIcon_Hutao") */
  readonly name: string
  /** Image URL override */
  readonly url?: string
  /** Base URL for image hosting */
  readonly imageBaseURL: string
}

/**
 * Image asset reference with URL construction.
 * Pure DTO — does not perform any I/O.
 */
export class ImageAssets {
  private static readonly IMAGE_BASE_URL_MIHOYO =
    'https://upload-os-bbs.mihoyo.com/game_record/genshin'

  private static readonly imageTypes: Record<string, RegExp[]> = {
    character_side_icon: [/^UI_AvatarIcon_Side_(.+)$/],
    character_icon: [/^UI_AvatarIcon_(.+)$/],
    equip: [/^UI_EquipIcon_(.+?)(_Awaken)?$/, /^UI_RelicIcon_(.+)$/],
  }

  /** Image name */
  public readonly name: string
  /** Image base URL */
  public readonly imageBaseURL: string
  /** Full image URL */
  public readonly url: string
  /** Image type category (e.g. "character_icon", "equip") */
  public readonly imageType: string | undefined
  /** Mihoyo CDN URL */
  public readonly mihoyoURL: string

  /**
   * Create an ImageAssets reference
   * @param data - Image asset data
   */
  constructor(data: ImageAssetsData) {
    this.name = data.name
    this.imageBaseURL = data.imageBaseURL
    this.url =
      data.url ??
      (data.name === '' ? '' : `${data.imageBaseURL}/${data.name}.png`)

    this.imageType = Object.keys(ImageAssets.imageTypes).find((type) =>
      ImageAssets.imageTypes[type].some((regex) => regex.test(data.name)),
    )

    this.mihoyoURL =
      data.name === '' || !this.imageType
        ? ''
        : `${ImageAssets.IMAGE_BASE_URL_MIHOYO}/${data.name}.png`
  }
}
