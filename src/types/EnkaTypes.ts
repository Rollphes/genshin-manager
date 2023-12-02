import { ArtifactType } from '@/models/Artifact'
import { FightPropType } from '@/models/StatProperty'

/**
 * Enka API ShowAvatarInfo type.
 */
export interface APIShowAvatarInfo {
  /**
   * Character ID
   */
  avatarId: number
  /**
   * Character level.
   */
  level: number
  /**
   * Character costume ID
   */
  costumeId?: number
}

/**
 * Enka API PlayerInfo type.
 */
export interface APIPlayerInfo {
  /**
   * Player Nickname
   */
  nickname: string
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
   * Profile Namecard ID
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
   * List of Character IDs and Levels
   */
  showAvatarInfoList?: APIShowAvatarInfo[]
  /**
   * List of Namecard IDs
   */
  showNameCardIdList?: number[]
  /**
   * Profile Picture
   */
  profilePicture?: APIProfilePicture
}

interface APIProfilePicture {
  avatarId?: number
  id?: number //ProfilePicture id
  costumeId?: number
}

interface APIPropMap {
  type: number
  ival: string
  val?: string
}

interface APIReliquary {
  level: number
  mainPropId: number
  appendPropIdList?: number[]
}

interface APIWeapon {
  level: number
  promoteLevel?: number
  affixMap?: { [key in string]: number }
}

interface APIReliquaryFlat {
  nameTextMapHash: string
  setNameTextMapHash: string
  rankLevel: number
  reliquaryMainstat: APIReliquaryMainstat
  reliquarySubstats?: APIItemStats[]
  itemType: 'ITEM_RELIQUARY'
  icon: string
  equipType: ArtifactType
}
interface APIWeaponFlat {
  nameTextMapHash: string
  rankLevel: number
  weaponStats: APIItemStats[]
  itemType: 'ITEM_WEAPON'
  icon: string
}

interface APIItemStats {
  appendPropId: FightPropType
  statValue: number
}

interface APIReliquaryMainstat {
  mainPropId: FightPropType
  statValue: number
}

/**
 * Enka API ReliquaryEquip type.
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
  /**
   * Detailed Info of Artifact
   */
  flat: APIReliquaryFlat
}
/**
 * Enka API WeaponEquip type.
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
  /**
   * Detailed Info of Weapon
   */
  flat: APIWeaponFlat
}

/**
 * Enka API AvatarInfo type.
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
  propMap: { [key in number]: APIPropMap }
  /**
   * List of Constellation IDs
   * There is no data if 0 Constellation
   */
  talentIdList?: number[]
  /**
   * Map of Character's Combat Properties.
   */
  fightPropMap: { [key in number]: number }
  /**
   * Character Skill Set ID
   */
  skillDepotId: number
  /**
   * List of Unlocked Skill Ids
   */
  inherentProudSkillList: number[]
  /**
   * Map of Skill Levels
   */
  skillLevelMap: { [key in string]: number }
  /**
   * Map of Skill Extra Levels
   */
  proudSkillExtraLevelMap?: { [key in string]: number }
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
 * EnkaNetWork response type.
 * https://enka.network/api/uid/:uid
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
   * TTL
   */
  ttl?: number
  /**
   * uid
   */
  uid: number
}
