import { EnkaManagerError } from '@/errors/EnkaManagerError'
import { Artifact } from '@/models/Artifact'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { Costume } from '@/models/character/Costume'
import { Skill } from '@/models/character/Skill'
import { Talent } from '@/models/character/Talent'
import { FightProp } from '@/models/FightProp'
import { SetBonus } from '@/models/SetBonus'
import { Weapon } from '@/models/weapon/Weapon'
import {
  APIAvatarInfo,
  APIReliquaryEquip,
  APIWeaponEquip,
} from '@/types/EnkaTypes'

/**
 * Class of the character obtained from EnkaNetwork.
 */
export class AvatarInfo extends CharacterInfo {
  /**
   * Costume equipped by the character.
   */
  public readonly costume: Costume
  /**
   * Level of the character.
   */
  public readonly level: number
  /**
   * Experience of the character.
   */
  public readonly levelXp: number
  /**
   * Ascension of the character.
   */
  public readonly ascension: number
  /**
   * List of talents that the character has.
   */
  public readonly talentList: Talent[]
  /**
   * List of skills that the character has.
   */
  public readonly skills: Skill[]
  /**
   * FightProp of the character.
   */
  public readonly fightProp: FightProp
  /**
   * Weapon equipped by the character.
   */
  public readonly weapon: Weapon
  /**
   * Artifacts equipped by the character.
   */
  public readonly artifacts: Artifact[]
  /**
   * Friendship level of the character.
   */
  public readonly friendShipLevel: number
  /**
   * Artifact set bonus of the character.
   */
  public readonly setBonus: SetBonus

  /**
   * Create a AvatarInfo
   * @param data Data from EnkaNetwork
   */
  constructor(data: APIAvatarInfo) {
    super(data.avatarId, data.skillDepotId)
    this.costume = new Costume(data.costumeId ?? this.defaultCostumeId)
    this.level = +(data.propMap[4001].val || 0)
    this.levelXp = +(data.propMap[1001].val || 0)
    this.ascension = +(data.propMap[1002].val || 0)
    this.talentList =
      this.talentIds.map((id) => {
        return new Talent(id, !data.talentIdList?.includes(id))
      }) || []

    this.skills = this.skillOrder.map((id) => {
      const proudId = this.proudMap.get(id)
      const extraLevel =
        proudId && data.proudSkillExtraLevelMap
          ? data.proudSkillExtraLevelMap[proudId]
          : 0
      return new Skill(id, data.skillLevelMap[id] || 0, extraLevel)
    })

    this.fightProp = new FightProp(data.fightPropMap)
    const weaponData = data.equipList.find(
      (equip): equip is APIWeaponEquip => equip.flat.itemType === 'ITEM_WEAPON',
    )
    if (!weaponData) throw new EnkaManagerError('Weapon not found.')
    const affixMap = weaponData.weapon.affixMap
    this.weapon = new Weapon(
      weaponData.itemId,
      weaponData.weapon.level,
      [0, 20, 40, 50, 60, 70, 80, 90][weaponData.weapon.promoteLevel ?? 0] >=
        weaponData.weapon.level,
      (affixMap ? affixMap[weaponData.itemId + 100000] : 0) + 1,
    )
    const artifactDatas = data.equipList.filter(
      (equip): equip is APIReliquaryEquip =>
        equip.flat.itemType === 'ITEM_RELIQUARY',
    )
    this.artifacts = artifactDatas.map(
      (data) =>
        new Artifact(
          data.itemId,
          data.reliquary.mainPropId,
          data.reliquary.level,
          data.reliquary.appendPropIdList,
        ),
    )
    this.friendShipLevel = data.fetterInfo.expLevel
    this.setBonus = new SetBonus(this.artifacts)
  }
}
