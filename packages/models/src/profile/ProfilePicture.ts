import type { ImageAssets } from '@/assets/ImageAssets'
import type { ProfilePictureUnlockType } from '@/types/enums'

/**
 * Constructor data for ProfilePicture
 */
export interface ProfilePictureData {
  /** Profile picture ID */
  readonly id: number
  /** Unlock type */
  readonly type: ProfilePictureUnlockType
  /** Character ID (if unlocked by avatar) */
  readonly characterId: number | undefined
  /** Costume ID (if unlocked by avatar or costume) */
  readonly costumeId: number | undefined
  /** Material ID (if unlocked by item) */
  readonly materialId: number | undefined
  /** Quest ID (if unlocked by quest) */
  readonly questId: number | undefined
  /** Profile picture icon */
  readonly icon: ImageAssets
}

/**
 * Profile picture data.
 * Pure DTO — no static dependencies.
 */
export class ProfilePicture {
  /** Profile picture ID */
  public readonly id: number
  /** Unlock type */
  public readonly type: ProfilePictureUnlockType
  /** Character ID */
  public readonly characterId: number | undefined
  /** Costume ID */
  public readonly costumeId: number | undefined
  /** Material ID */
  public readonly materialId: number | undefined
  /** Quest ID */
  public readonly questId: number | undefined
  /** Profile picture icon */
  public readonly icon: ImageAssets

  /**
   * Create a ProfilePicture
   * @param data - Pre-resolved profile picture data
   */
  constructor(data: ProfilePictureData) {
    this.id = data.id
    this.type = data.type
    this.characterId = data.characterId
    this.costumeId = data.costumeId
    this.materialId = data.materialId
    this.questId = data.questId
    this.icon = data.icon
  }
}
