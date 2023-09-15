import { ArtifactType } from '@/models/Artifact'
import { FightPropType } from '@/models/StatProperty'
import { ElementKeys, ValueOf } from '@/types'

interface APICostume {
  sideIconName: string
  icon: string
  art: string
  avatarId: number
}

export interface APIShowAvatarInfo {
  avatarId: number
  level: number
  costumeId?: number
}

export interface APIPlayerInfo {
  nickname: string
  level: number
  signature?: string
  worldLevel?: number
  nameCardId: number
  finishAchievementNum?: number
  towerFloorIndex?: number
  towerLevelIndex?: number
  showAvatarInfoList?: APIShowAvatarInfo[]
  showNameCardIdList?: number[]
  profilePicture?: APIProfilePicture
}

interface APIProfilePicture {
  avatarId?: number
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

export interface APIReliquaryEquip {
  itemId: number
  reliquary: APIReliquary
  flat: APIReliquaryFlat
}
export interface APIWeaponEquip {
  itemId: number
  weapon: APIWeapon
  flat: APIWeaponFlat
}

export interface APIAvatarInfo {
  avatarId: number
  costumeId?: number
  propMap: { [key in number]: APIPropMap }
  talentIdList?: number[]
  fightPropMap: { [key in number]: number }
  skillDepotId: number
  inherentProudSkillList: number[]
  skillLevelMap: { [key in string]: number }
  proudSkillExtraLevelMap?: { [key in string]: number }
  equipList: (APIReliquaryEquip | APIWeaponEquip)[]
  fetterInfo: {
    expLevel: number
  }
}

export interface APIEnkaData {
  playerInfo: APIPlayerInfo
  avatarInfoList?: APIAvatarInfo[]
  ttl?: number
  uid: number
}

export interface APICharData {
  Element: ValueOf<typeof ElementKeys>
  Consts: string[]
  SkillOrder: number[]
  Skills: { [key in string]: string }
  ProudMap: { [key in string]: number }
  NameTextMapHash: number
  SideIconName: string
  QualityType: string
  Costumes?: { [key in string]: APICostume }
}
