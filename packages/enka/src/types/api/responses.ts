// ============================================
// Enka Network API Response Types
// ============================================

/**
 * ShowAvatarInfo response
 */
export interface ShowAvatarInfoResponse {
  /** Character ID */
  readonly avatarId: number
  /** Character level */
  readonly level: number
  /** Character costume ID */
  readonly costumeId?: number
  /** Character element ID */
  readonly energyType?: number
  /** Character constellation Count */
  readonly talentLevel?: number
}

/**
 * PlayerInfo response
 */
export interface PlayerInfoResponse {
  /** Player Nickname */
  readonly nickname?: string
  /** Player Adventure Level */
  readonly level: number
  /** Profile Signature */
  readonly signature?: string
  /** Player World Level */
  readonly worldLevel?: number
  /** Profile NameCard ID */
  readonly nameCardId: number
  /** Number of Completed Achievements */
  readonly finishAchievementNum?: number
  /** Abyss Floor */
  readonly towerFloorIndex?: number
  /** Abyss Floor's Chamber */
  readonly towerLevelIndex?: number
  /** Abyss Star Index */
  readonly towerStarIndex?: number
  /** List of Character IDs and Levels */
  readonly showAvatarInfoList?: readonly ShowAvatarInfoResponse[]
  /** List of NameCard IDs */
  readonly showNameCardIdList?: readonly number[]
  /** Profile Picture */
  readonly profilePicture?: ProfilePictureResponse
  /** Show Avatar Talent */
  readonly isShowAvatarTalent?: boolean
  /** Number of characters with max friendship level */
  readonly fetterCount?: number
  /** Imaginarium Theater Act Index */
  readonly theaterActIndex?: number
  /** Number of supporting cast members for Imaginarium Theater */
  readonly theaterModeIndex?: number
  /** Imaginarium Theater Star Index */
  readonly theaterStarIndex?: number
}

/**
 * ProfilePicture response
 */
export interface ProfilePictureResponse {
  /** Character ID */
  readonly avatarId?: number
  /** Profile Picture ID */
  readonly id?: number
  /** Costume ID */
  readonly costumeId?: number
}

/**
 * PropMap response
 */
export interface PropMapResponse {
  /** Property value */
  readonly val?: string
}

/**
 * Reliquary response
 */
export interface ReliquaryResponse {
  /** Level */
  readonly level: number
  /** Main Property ID */
  readonly mainPropId: number
  /** Append Property ID List */
  readonly appendPropIdList?: readonly number[]
}

/**
 * Weapon response
 */
export interface WeaponResponse {
  /** Level */
  readonly level: number
  /** Refinement Level */
  readonly promoteLevel?: number
  /** Affix Map */
  readonly affixMap?: Readonly<Record<string, number>>
}

/**
 * ReliquaryEquip response
 */
export interface ReliquaryEquipResponse {
  /** Reliquary ID */
  readonly itemId: number
  /** Artifact Base Info */
  readonly reliquary: ReliquaryResponse
}

/**
 * WeaponEquip response
 */
export interface WeaponEquipResponse {
  /** Weapon ID */
  readonly itemId: number
  /** Weapon Base Info */
  readonly weapon: WeaponResponse
}

/**
 * AvatarInfo response
 */
export interface AvatarInfoResponse {
  /** Character ID */
  readonly avatarId: number
  /** Character costume ID */
  readonly costumeId?: number
  /** Character Info Properties List */
  readonly propMap: Readonly<Partial<Record<number, PropMapResponse>>>
  /** List of Constellation IDs */
  readonly talentIdList?: readonly number[]
  /** Map of Character's Combat Properties */
  readonly fightPropMap: Readonly<Partial<Record<number, number>>>
  /** Character Skill Set ID */
  readonly skillDepotId: number
  /** Map of Skill Levels */
  readonly skillLevelMap: Readonly<Record<string, number>>
  /** Map of Skill Extra Levels */
  readonly proudSkillExtraLevelMap?: Readonly<Record<string, number>>
  /** List of Equipments: Weapon, Artifacts */
  readonly equipList: readonly (ReliquaryEquipResponse | WeaponEquipResponse)[]
  /** fetterInfo */
  readonly fetterInfo: {
    /** Character Friendship Level */
    readonly expLevel: number
  }
}

/**
 * Profile response
 */
export interface ProfileResponse {
  /** biography */
  readonly bio: string
  /** level */
  readonly level: number
  /** signup state */
  readonly signup_state: number
  /** profile picture */
  readonly avatar: string | null
  /** profile picture URL */
  readonly image_url: string
}

/**
 * Owner response
 */
export interface OwnerResponse {
  /** Hash */
  readonly hash?: string
  /** User Name */
  readonly username: string
  /** Profile */
  readonly profile: ProfileResponse
  /** Enka Network Account ID */
  readonly id: number
}

/**
 * EnkaData response
 */
export interface EnkaDataResponse {
  /** Player Info */
  readonly playerInfo: PlayerInfoResponse
  /** Avatar Info List */
  readonly avatarInfoList?: readonly AvatarInfoResponse[]
  /** Owner Info */
  readonly owner?: OwnerResponse
  /** TTL */
  readonly ttl?: number
  /** UID */
  readonly uid: number
}

/**
 * GameAccount response
 */
export interface GameAccountResponse {
  /** UID */
  readonly uid: number
  /** Is the UID public */
  readonly uid_public: boolean
  /** Is the UID public */
  readonly public: boolean
  /** Is the live preview public */
  readonly live_public: boolean
  /** is the account verified */
  readonly verified: boolean
  /** Player Info */
  readonly player_info: PlayerInfoResponse
  /** GameAccount Hash */
  readonly hash: string
  /** region */
  readonly region: string
  /** order */
  readonly order: number
  /** avatar order */
  readonly avatar_order: Readonly<Record<string, number>>
  /** hoyo type (0: GI 1:HSR) */
  readonly hoyo_type: number
}

/**
 * BuildSettings response
 */
export interface BuildSettingsResponse {
  /** build description */
  readonly caption?: string
  /** custom art source */
  readonly artSource?: string
  /** honkard width */
  readonly honkardWidth?: number
  /** Is Adaptive Color */
  readonly adaptiveColor?: boolean
}

/**
 * Build response
 */
export interface BuildResponse {
  /** Build ID */
  readonly id: number
  /** Build Name */
  readonly name: string
  /** Character ID */
  readonly avatar_id: string
  /** Avatar Info */
  readonly avatar_data: AvatarInfoResponse
  /** order */
  readonly order: number
  /** is the live preview */
  readonly live: boolean
  /** Build Settings */
  readonly settings: BuildSettingsResponse
  /** is the public */
  readonly public: boolean
  /** image URL */
  readonly image: null | string
  /** hoyo type (0: GI 1:HSR) */
  readonly hoyo_type: number
}

/**
 * EnkaRegion type
 */
export type EnkaRegion = 'euro' | 'usa' | 'asia' | 'cht' | 'china' | 'bilibili'

/**
 * EnkaStat response
 */
export interface EnkaStatResponse {
  /** response time (ms) */
  readonly time: Readonly<Partial<Record<EnkaRegion, number>>>
  /** ping (ms) */
  readonly ping: Readonly<Partial<Record<EnkaRegion, number>>>
  /** request capacity (req/min) */
  readonly nodes: Readonly<Partial<Record<EnkaRegion, number>>>
  /** underruns (fails) */
  readonly underruns: Readonly<Partial<Record<EnkaRegion, string>>>
}

/**
 * EnkaPing response
 */
export interface EnkaPingResponse {
  /** response time (ms) */
  readonly ms: number
  /** status code */
  readonly status: number
}

/**
 * EnkaPingu response
 */
export interface EnkaPinguResponse {
  /** CDN */
  readonly cdn: EnkaPingResponse
  /** Main */
  readonly main: EnkaPingResponse
  /** API */
  readonly api: EnkaPingResponse
  /** Fox */
  readonly fox: EnkaPingResponse
}

/**
 * EnkaStatus response
 */
export interface EnkaStatusResponse {
  /** now Date string */
  readonly now: string
  /** HSR Stat */
  readonly hsr: EnkaStatResponse
  /** GI Stat */
  readonly gi: EnkaStatResponse
  /** GG Stat */
  readonly gg: EnkaStatResponse
  /** Pingu Stat */
  readonly pingu: EnkaPinguResponse
}
