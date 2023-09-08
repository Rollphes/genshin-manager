import { CharacterInfo } from '@/models/character/CharacterInfo'
import { Costume } from '@/models/character/Costume'
import { ShowAvatarInfo } from '@/models/enka/ShowAvatarInfo'
import { Material } from '@/models/Material'
import { APIPlayerInfo } from '@/types/EnkaTypes'
/**
 * Class of player obtained from EnkaNetwork.
 */
export class PlayerInfo {
  /**
   * Nickname of the player.
   */
  readonly nickname: string
  /**
   * Adventure Rank of the player.
   */
  readonly level: number
  /**
   * Signature of the player.
   */
  readonly signature: string
  /**
   * World Level of the player.
   */
  readonly worldLevel: number
  /**
   * Name card of the player.
   */
  readonly nameCard: Material
  /**
   * Number of achievements that the player has finished.
   */
  readonly finishAchievementNum: number
  /**
   * Floor index of the Spiral Abyss.
   */
  readonly towerFloorIndex: number
  /**
   * Level index of the Spiral Abyss.
   */
  readonly towerLevelIndex: number
  /**
   * List of avatars that the player has.
   */
  readonly showAvatarInfoList: ShowAvatarInfo[]
  /**
   * List of name cards that the player has.
   */
  readonly showNameCardList: Material[]
  /**
   * Profile picture of the player.
   */
  readonly profilePicture: Costume

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
    const characterData = new CharacterInfo(
      data.profilePicture?.avatarId || 10000005,
    )
    this.profilePicture = new Costume(
      data.profilePicture?.costumeId ?? characterData.defaultCostumeId,
    )
  }
}
