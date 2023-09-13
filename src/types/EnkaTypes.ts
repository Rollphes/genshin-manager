import { ArtifactType } from '@/models/Artifact'
import { FightPropType } from '@/models/StatProperty'
import { ElementKeys } from '@/types'

export interface APICostume {
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

export interface APIProfilePicture {
  avatarId?: number
  costumeId?: number
}

export interface APIPropMap {
  type: number
  ival: string
  val?: string
}

export interface APIReliquary {
  level: number
  mainPropId: number
  appendPropIdList?: number[]
}

export interface APIWeapon {
  level: number
  promoteLevel?: number
  affixMap?: { [key in string]: number }
}

export interface APIReliquaryFlat {
  nameTextMapHash: string
  setNameTextMapHash: string
  rankLevel: number
  reliquaryMainstat: APIReliquaryMainstat
  reliquarySubstats?: APIItemStats[]
  itemType: 'ITEM_RELIQUARY'
  icon: string
  equipType: ArtifactType
}
export interface APIWeaponFlat {
  nameTextMapHash: string
  rankLevel: number
  weaponStats: APIItemStats[]
  itemType: 'ITEM_WEAPON'
  icon: string
}

export interface APIItemStats {
  appendPropId: FightPropType
  statValue: number
}

export interface APIReliquaryMainstat {
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

type ValueOf<T> = T[keyof T]
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
