import type {
  AvatarInfoResponse,
  ReliquaryEquipResponse,
  WeaponEquipResponse,
} from '@/types/api/responses'

/**
 * Constructor data for CharacterDetail
 */
export interface CharacterDetailData {
  /** Character ID */
  readonly avatarId: number
  /** Costume ID */
  readonly costumeId: number | undefined
  /** Character level */
  readonly level: number
  /** Character ascension (promote level) */
  readonly ascension: number
  /** Character experience */
  readonly experience: number
  /** Skill depot ID */
  readonly skillDepotId: number
  /** Unlocked constellation IDs */
  readonly constellationIds: readonly number[]
  /** Constellation count */
  readonly constellationCount: number
  /** Skill level map (skillId → level) */
  readonly skillLevelMap: Readonly<Record<string, number>>
  /** Skill extra level map (proudSkillGroupId → extra level) */
  readonly proudSkillExtraLevelMap: Readonly<Record<string, number>>
  /** Combat properties map (fightPropId → value) */
  readonly fightPropMap: Readonly<Partial<Record<number, number>>>
  /** Friendship level */
  readonly friendshipLevel: number
  /** Weapon equip info */
  readonly weaponEquip: WeaponEquipResponse | undefined
  /** Artifact equip list */
  readonly artifactEquips: readonly ReliquaryEquipResponse[]
}

/**
 * Character detail from Enka.Network showcase.
 * Pure DTO — stores raw API data without Repository dependencies.
 */
export class CharacterDetail {
  /** Character ID */
  public readonly avatarId: number
  /** Costume ID */
  public readonly costumeId: number | undefined
  /** Character level */
  public readonly level: number
  /** Character ascension */
  public readonly ascension: number
  /** Character experience */
  public readonly experience: number
  /** Skill depot ID */
  public readonly skillDepotId: number
  /** Unlocked constellation IDs */
  public readonly constellationIds: readonly number[]
  /** Constellation count */
  public readonly constellationCount: number
  /** Skill level map */
  public readonly skillLevelMap: Readonly<Record<string, number>>
  /** Skill extra level map */
  public readonly proudSkillExtraLevelMap: Readonly<Record<string, number>>
  /** Combat properties map */
  public readonly fightPropMap: Readonly<Partial<Record<number, number>>>
  /** Friendship level */
  public readonly friendshipLevel: number
  /** Weapon equip info */
  public readonly weaponEquip: WeaponEquipResponse | undefined
  /** Artifact equip list */
  public readonly artifactEquips: readonly ReliquaryEquipResponse[]

  /**
   * Create a CharacterDetail
   * @param data - Pre-resolved character detail data
   */
  constructor(data: CharacterDetailData) {
    this.avatarId = data.avatarId
    this.costumeId = data.costumeId
    this.level = data.level
    this.ascension = data.ascension
    this.experience = data.experience
    this.skillDepotId = data.skillDepotId
    this.constellationIds = data.constellationIds
    this.constellationCount = data.constellationCount
    this.skillLevelMap = data.skillLevelMap
    this.proudSkillExtraLevelMap = data.proudSkillExtraLevelMap
    this.fightPropMap = data.fightPropMap
    this.friendshipLevel = data.friendshipLevel
    this.weaponEquip = data.weaponEquip
    this.artifactEquips = data.artifactEquips
  }

  /**
   * Build a CharacterDetail from an AvatarInfoResponse
   * @param response - Enka API avatar info
   * @returns CharacterDetail instance
   */
  public static fromResponse(response: AvatarInfoResponse): CharacterDetail {
    const level = Number(response.propMap[4001]?.val ?? '1')
    const ascension = Number(response.propMap[1002]?.val ?? '0')
    const experience = Number(response.propMap[1001]?.val ?? '0')

    const weaponEquip = response.equipList.find(
      (e): e is WeaponEquipResponse => 'weapon' in e,
    )
    const artifactEquips = response.equipList.filter(
      (e): e is ReliquaryEquipResponse => 'reliquary' in e,
    )

    return new CharacterDetail({
      avatarId: response.avatarId,
      costumeId: response.costumeId,
      level,
      ascension,
      experience,
      skillDepotId: response.skillDepotId,
      constellationIds: response.talentIdList ?? [],
      constellationCount: response.talentIdList?.length ?? 0,
      skillLevelMap: response.skillLevelMap,
      proudSkillExtraLevelMap: response.proudSkillExtraLevelMap ?? {},
      fightPropMap: response.fightPropMap,
      friendshipLevel: response.fetterInfo.expLevel,
      weaponEquip,
      artifactEquips,
    })
  }
}
