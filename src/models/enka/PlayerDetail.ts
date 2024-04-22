import { CharacterPreview } from '@/models/enka/CharacterPreview'
import { Material } from '@/models/Material'
import { ProfilePicture } from '@/models/ProfilePicture'
import { APIPlayerInfo } from '@/types/enkaNetwork'
/**
 * Class of player obtained from EnkaNetwork
 */
export class PlayerDetail {
  /**
   * Player Nickname
   */
  public readonly nickname: string
  /**
   * Player Adventure Rank
   */
  public readonly level: number
  /**
   * Player signature
   */
  public readonly signature: string
  /**
   * Player World Level
   */
  public readonly worldLevel: number
  /**
   * Profile NameCard ID
   */
  public readonly nameCard: Material
  /**
   * Number of Completed Achievements
   */
  public readonly finishAchievementNum: number
  /**
   * Abyss Floor
   */
  public readonly towerFloorIndex: number
  /**
   * Abyss Floor's Chamber
   */
  public readonly towerLevelIndex: number
  /**
   * Character previews
   */
  public readonly characterPreviews: CharacterPreview[]
  /**
   * Show NameCards
   */
  public readonly showNameCards: Material[]
  /**
   * Player Profile Picture
   */
  public readonly profilePicture: ProfilePicture
  /**
   * Data from EnkaNetwork
   */
  public readonly data: APIPlayerInfo

  /**
   * Create a PlayerDetail
   * @param data Data from EnkaNetwork
   */
  constructor(data: APIPlayerInfo) {
    this.nickname = data.nickname || ''
    this.level = data.level
    this.signature = data.signature || ''
    this.worldLevel = data.worldLevel || 0
    this.nameCard = new Material(data.nameCardId)
    this.finishAchievementNum = data.finishAchievementNum || 0
    this.towerFloorIndex = data.towerFloorIndex || 0
    this.towerLevelIndex = data.towerLevelIndex || 0
    this.characterPreviews = data.showAvatarInfoList
      ? data.showAvatarInfoList.map((v) => new CharacterPreview(v))
      : []
    this.showNameCards = data.showNameCardIdList
      ? data.showNameCardIdList.map((id) => new Material(id))
      : []

    let profilePictureId
    if (data.profilePicture && data.profilePicture.id) {
      profilePictureId = data.profilePicture.id
    } else {
      profilePictureId = ProfilePicture.findProfilePictureIdByUnlockParam(
        data.profilePicture?.costumeId ??
          data.profilePicture?.avatarId ??
          10000005,
      ) as number
    }
    this.profilePicture = new ProfilePicture(profilePictureId || 1)
    this.data = data
  }
}
