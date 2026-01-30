import type {
  PlayerInfoResponse,
  ShowAvatarInfoResponse,
} from '@/types/api/responses'

/**
 * Character preview data
 */
export interface CharacterPreviewData {
  /** Character ID */
  readonly avatarId: number
  /** Character level */
  readonly level: number
  /** Character costume ID */
  readonly costumeId: number | undefined
  /** Character element ID */
  readonly energyType: number | undefined
  /** Character constellation count */
  readonly talentLevel: number | undefined
}

/**
 * Constructor data for PlayerDetail
 */
export interface PlayerDetailData {
  /** Player Nickname */
  readonly nickname: string
  /** Player Adventure Rank */
  readonly level: number
  /** Player signature */
  readonly signature: string
  /** Player World Level */
  readonly worldLevel: number
  /** Profile NameCard ID */
  readonly nameCardId: number
  /** Number of Completed Achievements */
  readonly finishAchievementNum: number
  /** Abyss Floor */
  readonly towerFloorIndex: number
  /** Abyss Floor's Chamber */
  readonly towerLevelIndex: number
  /** Abyss Star Index */
  readonly towerStarIndex: number
  /** Character previews */
  readonly characterPreviews: readonly CharacterPreviewData[]
  /** Show NameCard IDs */
  readonly showNameCardIds: readonly number[]
  /** Profile Picture ID */
  readonly profilePictureId: number | undefined
  /** Profile Picture avatar ID */
  readonly profilePictureAvatarId: number | undefined
  /** Profile Picture costume ID */
  readonly profilePictureCostumeId: number | undefined
  /** Number of characters with max friendship level */
  readonly maxFriendshipCharactersCount: number
  /** Imaginarium Theater Act Index */
  readonly theaterActIndex: number
  /** Imaginarium Theater Mode Index */
  readonly theaterModeIndex: number
  /** Imaginarium Theater Star Index */
  readonly theaterStarIndex: number
  /** Show Character Preview Constellation */
  readonly isShowCharacterPreviewConstellation: boolean
  /** Raw data */
  readonly data: PlayerInfoResponse
}

/**
 * Contains player profile information from EnkaNetwork.
 * Pure DTO.
 */
export class PlayerDetail {
  /** Player Nickname */
  public readonly nickname: string
  /** Player Adventure Rank */
  public readonly level: number
  /** Player signature */
  public readonly signature: string
  /** Player World Level */
  public readonly worldLevel: number
  /** Profile NameCard ID */
  public readonly nameCardId: number
  /** Number of Completed Achievements */
  public readonly finishAchievementNum: number
  /** Abyss Floor */
  public readonly towerFloorIndex: number
  /** Abyss Floor's Chamber */
  public readonly towerLevelIndex: number
  /** Abyss Star Index */
  public readonly towerStarIndex: number
  /** Character previews */
  public readonly characterPreviews: readonly CharacterPreviewData[]
  /** Show NameCard IDs */
  public readonly showNameCardIds: readonly number[]
  /** Profile Picture ID */
  public readonly profilePictureId: number | undefined
  /** Profile Picture avatar ID */
  public readonly profilePictureAvatarId: number | undefined
  /** Profile Picture costume ID */
  public readonly profilePictureCostumeId: number | undefined
  /** Number of characters with max friendship level */
  public readonly maxFriendshipCharactersCount: number
  /** Imaginarium Theater Act Index */
  public readonly theaterActIndex: number
  /** Imaginarium Theater Mode Index */
  public readonly theaterModeIndex: number
  /** Imaginarium Theater Star Index */
  public readonly theaterStarIndex: number
  /** Show Character Preview Constellation */
  public readonly isShowCharacterPreviewConstellation: boolean
  /** Raw data */
  public readonly data: PlayerInfoResponse

  /**
   * Create a PlayerDetail
   * @param data - Pre-resolved player detail data
   */
  constructor(data: PlayerDetailData) {
    this.nickname = data.nickname
    this.level = data.level
    this.signature = data.signature
    this.worldLevel = data.worldLevel
    this.nameCardId = data.nameCardId
    this.finishAchievementNum = data.finishAchievementNum
    this.towerFloorIndex = data.towerFloorIndex
    this.towerLevelIndex = data.towerLevelIndex
    this.towerStarIndex = data.towerStarIndex
    this.characterPreviews = data.characterPreviews
    this.showNameCardIds = data.showNameCardIds
    this.profilePictureId = data.profilePictureId
    this.profilePictureAvatarId = data.profilePictureAvatarId
    this.profilePictureCostumeId = data.profilePictureCostumeId
    this.maxFriendshipCharactersCount = data.maxFriendshipCharactersCount
    this.theaterActIndex = data.theaterActIndex
    this.theaterModeIndex = data.theaterModeIndex
    this.theaterStarIndex = data.theaterStarIndex
    this.isShowCharacterPreviewConstellation =
      data.isShowCharacterPreviewConstellation
    this.data = data.data
  }

  /**
   * Build a PlayerDetail from API response
   * @param apiData - API response
   * @returns PlayerDetail instance
   */
  public static fromResponse(apiData: PlayerInfoResponse): PlayerDetail {
    const previews: CharacterPreviewData[] = (
      apiData.showAvatarInfoList ?? []
    ).map((info: ShowAvatarInfoResponse) => ({
      avatarId: info.avatarId,
      level: info.level,
      costumeId: info.costumeId,
      energyType: info.energyType,
      talentLevel: info.talentLevel,
    }))

    return new PlayerDetail({
      nickname: apiData.nickname ?? '',
      level: apiData.level,
      signature: apiData.signature ?? '',
      worldLevel: apiData.worldLevel ?? 0,
      nameCardId: apiData.nameCardId,
      finishAchievementNum: apiData.finishAchievementNum ?? 0,
      towerFloorIndex: apiData.towerFloorIndex ?? 0,
      towerLevelIndex: apiData.towerLevelIndex ?? 0,
      towerStarIndex: apiData.towerStarIndex ?? 0,
      characterPreviews: previews,
      showNameCardIds: apiData.showNameCardIdList ?? [],
      profilePictureId: apiData.profilePicture?.id,
      profilePictureAvatarId: apiData.profilePicture?.avatarId,
      profilePictureCostumeId: apiData.profilePicture?.costumeId,
      maxFriendshipCharactersCount: apiData.fetterCount ?? 0,
      theaterActIndex: apiData.theaterActIndex ?? 0,
      theaterModeIndex: apiData.theaterModeIndex ?? 0,
      theaterStarIndex: apiData.theaterStarIndex ?? 0,
      isShowCharacterPreviewConstellation: apiData.isShowAvatarTalent ?? false,
      data: apiData,
    })
  }
}
