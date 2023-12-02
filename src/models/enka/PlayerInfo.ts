import { ShowAvatarInfo } from '@/models/enka/ShowAvatarInfo'
import { Material } from '@/models/Material'
import { ProfilePicture } from '@/models/ProfilePicture'
import { APIPlayerInfo } from '@/types/EnkaTypes'
/**
 * Class of player obtained from EnkaNetwork
 */
export class PlayerInfo {
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
   * Profile Namecard ID
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
   * List of Character Costume and Level
   */
  public readonly showAvatarInfoList: ShowAvatarInfo[]
  /**
   * List of Namecard
   */
  public readonly showNameCardList: Material[]
  /**
   * Player Profile Picture
   */
  public readonly profilePicture: ProfilePicture

  /**
   * Create a PlayerInfo
   * @param data Data from EnkaNetwork
   */
  constructor(data: APIPlayerInfo) {
    this.nickname = data.nickname
    this.level = data.level
    this.signature = data.signature || ''
    this.worldLevel = data.worldLevel || 0
    this.nameCard = new Material(data.nameCardId)
    this.finishAchievementNum = data.finishAchievementNum || 0
    this.towerFloorIndex = data.towerFloorIndex || 0
    this.towerLevelIndex = data.towerLevelIndex || 0
    this.showAvatarInfoList = data.showAvatarInfoList
      ? data.showAvatarInfoList.map((v) => new ShowAvatarInfo(v))
      : []
    this.showNameCardList = data.showNameCardIdList
      ? data.showNameCardIdList.map((id) => new Material(id))
      : []

    let profilePictureId
    if (data.profilePicture && data.profilePicture.id) {
      profilePictureId = data.profilePicture.id
    } else {
      profilePictureId = ProfilePicture.findProfilePictureIdByInfoId(
        data.profilePicture?.costumeId ??
          data.profilePicture?.avatarId ??
          10000005,
      ) as number
    }
    this.profilePicture = new ProfilePicture(profilePictureId || 10000005)
  }
}
