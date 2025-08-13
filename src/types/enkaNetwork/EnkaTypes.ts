/**
 * Enka API ShowAvatarInfo type
 */
export interface APIShowAvatarInfo {
  /**
   * Character ID
   */
  avatarId: number
  /**
   * Character level
   */
  level: number
  /**
   * Character costume ID
   */
  costumeId?: number
  /**
   * Character element ID
   */
  energyType?: number
  /**
   * Character constellation Count
   */
  talentLevel?: number
}

/**
 * Enka API PlayerInfo type
 */
export interface APIPlayerInfo {
  /**
   * Player Nickname
   */
  nickname?: string
  /**
   * Player Adventure Level
   */
  level: number
  /**
   * Profile Signature
   */
  signature?: string
  /**
   * Player World Level
   */
  worldLevel?: number
  /**
   * Profile NameCard ID
   */
  nameCardId: number
  /**
   * Number of Completed Achievements
   */
  finishAchievementNum?: number
  /**
   * Abyss Floor
   */
  towerFloorIndex?: number
  /**
   * Abyss Floor's Chamber
   */
  towerLevelIndex?: number
  /**
   * Abyss Star Index
   */
  towerStarIndex?: number
  /**
   * List of Character IDs and Levels
   */
  showAvatarInfoList?: APIShowAvatarInfo[]
  /**
   * List of NameCard IDs
   */
  showNameCardIdList?: number[]
  /**
   * Profile Picture
   */
  profilePicture?: APIProfilePicture
  /**
   * Show Avatar Talent
   */
  isShowAvatarTalent?: boolean
  /**
   * Number of characters with max friendship level
   */
  fetterCount?: number
  /**
   * Imaginarium Theater Act Index
   */
  theaterActIndex?: number
  /**
   * Number of supporting cast members for Imaginarium Theater
   */
  theaterModeIndex?: number
  /**
   * Imaginarium Theater Star Index
   */
  theaterStarIndex?: number
}

/**
 * Enka API ProfilePicture type
 */
export interface APIProfilePicture {
  /**
   * Character ID
   */
  avatarId?: number
  /**
   * Profile Picture ID
   */
  id?: number //ProfilePicture ID
  /**
   * Costume ID
   */
  costumeId?: number
}

/**
 * Enka API PropMap type
 */
export interface APIPropMap {
  /**
   * Property value
   */
  val?: string
}

/**
 * Enka API Reliquary type
 */
export interface APIReliquary {
  /**
   * Level
   */
  level: number
  /**
   * Main Property ID
   */
  mainPropId: number
  /**
   * Append Property ID List
   */
  appendPropIdList?: number[]
}

/**
 * Enka API Weapon type
 */
export interface APIWeapon {
  /**
   * Level
   */
  level: number
  /**
   * Refinement Level
   */
  promoteLevel?: number
  /**
   * Affix Map
   */
  affixMap?: Record<string, number>
}

/**
 * Enka API ReliquaryEquip type
 */
export interface APIReliquaryEquip {
  /**
   * Reliquary ID
   */
  itemId: number
  /**
   * Artifact Base Info
   */
  reliquary: APIReliquary
}
/**
 * Enka API WeaponEquip type
 */
export interface APIWeaponEquip {
  /**
   * Weapon ID
   */
  itemId: number
  /**
   * Weapon Base Info
   */
  weapon: APIWeapon
}

/**
 * Enka API AvatarInfo type
 */
export interface APIAvatarInfo {
  /**
   * Character ID
   */
  avatarId: number
  /**
   * Character costume ID
   */
  costumeId?: number
  /**
   * Character Info Properties List
   */
  propMap: Record<number, APIPropMap>
  /**
   * List of Constellation IDs
   * @warn There is no data if 0 Constellation
   */
  talentIdList?: number[]
  /**
   * Map of Character's Combat Properties
   */
  fightPropMap: Record<number, number>
  /**
   * Character Skill Set ID
   */
  skillDepotId: number
  /**
   * Map of Skill Levels
   */
  skillLevelMap: Record<string, number>
  /**
   * Map of Skill Extra Levels
   */
  proudSkillExtraLevelMap?: Record<string, number>
  /**
   * List of Equipments: Weapon, Artifacts
   */
  equipList: (APIReliquaryEquip | APIWeaponEquip)[]
  /**
   * fetterInfo
   */
  fetterInfo: {
    /**
     * Character Friendship Level
     */
    expLevel: number
  }
}

/**
 * Enka API Owner type
 */
export interface APIOwner {
  /**
   * Hash
   */
  hash?: string
  /**
   * User Name
   */
  username: string
  /**
   * Profile
   */
  profile: APIProfile
  /**
   * Enka Network Account ID
   */
  id: number
}

/**
 * Enka API PlayerDetail type
 */
export interface APIProfile {
  /**
   * biography
   */
  bio: string
  /**
   * level
   */
  level: number
  /**
   * signup state
   */
  signup_state: number
  /**
   * profile picture
   */
  avatar: string | null
  /**
   * profile picture #2?
   */
  image_url: string
}

/**
 * EnkaNetWork response type
 * @link https://enka.network/api/uid/:uid
 */
export interface APIEnkaData {
  /**
   * Player Info
   */
  playerInfo: APIPlayerInfo
  /**
   * Avatar Info List
   */
  avatarInfoList?: APIAvatarInfo[]
  /**
   * Owner Info
   */
  owner?: APIOwner
  /**
   * TTL
   */
  ttl?: number
  /**
   * UID
   */
  uid: number
}
