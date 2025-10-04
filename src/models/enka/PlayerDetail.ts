import { CharacterPreview } from '@/models/enka/CharacterPreview'
import { Material } from '@/models/Material'
import { ProfilePicture } from '@/models/ProfilePicture'
import { APIPlayerInfo } from '@/types/enkaNetwork'
/**
 * Contains player profile information and game progress from EnkaNetwork
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
   * Abyss Star Index
   */
  public readonly towerStarIndex: number
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
   * Number of characters with max friendship level
   */
  public readonly maxFriendshipCharactersCount: number
  /**
   * Imaginarium Theater Act Index
   */
  public readonly theaterActIndex: number
  /**
   * Imaginarium Theater Mode Index (5:easy, 6:hard...)
   */
  public readonly theaterModeIndex: number
  /**
   * Imaginarium Theater Star Index
   */
  public readonly theaterStarIndex: number
  /**
   * Show Character Preview Constellation
   */
  public readonly isShowCharacterPreviewConstellation: boolean
  /**
   * Data from EnkaNetwork
   */
  public readonly data: APIPlayerInfo

  /**
   * Create a PlayerDetail
   * @param data data from EnkaNetwork
   */
  constructor(data: APIPlayerInfo) {
    this.nickname = data.nickname ?? ''
    this.level = data.level
    this.signature = data.signature ?? ''
    this.worldLevel = data.worldLevel ?? 0
    this.nameCard = new Material(data.nameCardId)
    this.finishAchievementNum = data.finishAchievementNum ?? 0
    this.towerFloorIndex = data.towerFloorIndex ?? 0
    this.towerLevelIndex = data.towerLevelIndex ?? 0
    this.towerStarIndex = data.towerStarIndex ?? 0
    this.characterPreviews = this.initializeCharacterPreviews(data)
    this.showNameCards = this.initializeShowNameCards(data)
    this.profilePicture = this.createProfilePicture(data)
    this.maxFriendshipCharactersCount = data.fetterCount ?? 0
    this.theaterActIndex = data.theaterActIndex ?? 0
    this.theaterModeIndex = data.theaterModeIndex ?? 0
    this.theaterStarIndex = data.theaterStarIndex ?? 0
    this.isShowCharacterPreviewConstellation = data.isShowAvatarTalent ?? false
    this.data = data
  }

  /**
   * Initialize character previews from API data
   * @param data API player info
   * @returns array of character previews
   */
  private initializeCharacterPreviews(data: APIPlayerInfo): CharacterPreview[] {
    return data.showAvatarInfoList
      ? data.showAvatarInfoList.map((v) => new CharacterPreview(v))
      : []
  }

  /**
   * Initialize show name cards from API data
   * @param data API player info
   * @returns array of materials
   */
  private initializeShowNameCards(data: APIPlayerInfo): Material[] {
    return data.showNameCardIdList
      ? data.showNameCardIdList.map((id) => new Material(id))
      : []
  }

  /**
   * Create profile picture from API data
   * @param data API player info
   * @returns profile picture instance
   */
  private createProfilePicture(data: APIPlayerInfo): ProfilePicture {
    let profilePictureId
    if (data.profilePicture?.id) {
      profilePictureId = data.profilePicture.id
    } else {
      profilePictureId = ProfilePicture.findProfilePictureIdByUnlockParam(
        data.profilePicture?.costumeId ??
          data.profilePicture?.avatarId ??
          10000005,
      )
    }
    return new ProfilePicture(profilePictureId ?? 1)
  }
}
