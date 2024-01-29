import { EnkaManagerError } from '@/errors/EnkaManagerError'
import { Artifact } from '@/models/Artifact'
import { CharacterConstellation } from '@/models/character/CharacterConstellation'
import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { CharacterSkill } from '@/models/character/CharacterSkill'
import { CharacterStatusManager } from '@/models/character/CharacterStatusManager'
import { SetBonus } from '@/models/SetBonus'
import { Weapon } from '@/models/weapon/Weapon'
import { BodyType, Element, WeaponType } from '@/types'
import {
  APIAvatarInfo,
  APIReliquaryEquip,
  APIWeaponEquip,
} from '@/types/EnkaTypes'

/**
 * Class of the character obtained from EnkaNetwork
 */
export class CharacterDetail {
  /**
   * Character id
   */
  public readonly id: number
  /**
   * Character name
   */
  public readonly name: string
  /**
   * Character element
   */
  public readonly element: Element | undefined
  /**
   * Character rarity
   */
  public readonly rarity: number
  /**
   * Character body type
   */
  public readonly bodyType: BodyType
  /**
   * Character weapon type
   */
  public readonly weaponType: WeaponType
  /**
   * Character costume
   */
  public readonly costume: CharacterCostume
  /**
   * Character level
   */
  public readonly level: number
  /**
   * Character max level
   */
  public readonly maxLevel: number
  /**
   * Character level XP
   */
  public readonly levelXp: number
  /**
   * Character ascension
   */
  public readonly ascension: number
  /**
   * Character constellations
   */
  public readonly constellations: CharacterConstellation[]
  /**
   * Character skills
   */
  public readonly skills: CharacterSkill[]
  /**
   * Character combat status
   */
  public readonly combatStatus: CharacterStatusManager
  /**
   * Weapon equipped by Character
   */
  public readonly weapon: Weapon
  /**
   * Artifacts equipped by Character
   */
  public readonly artifacts: Artifact[]
  /**
   * Character friendship level
   */
  public readonly friendShipLevel: number
  /**
   * Character set bonus
   */
  public readonly setBonus: SetBonus

  /**
   * Create a CharacterDetail
   * @param data Data from EnkaNetwork
   */
  constructor(data: APIAvatarInfo) {
    const characterInfo = new CharacterInfo(data.avatarId, data.skillDepotId)
    this.id = characterInfo.id
    this.name = characterInfo.name
    this.element = characterInfo.element
    this.rarity = characterInfo.rarity
    this.bodyType = characterInfo.bodyType
    this.weaponType = characterInfo.weaponType
    this.maxLevel = characterInfo.maxLevel
    this.costume = new CharacterCostume(
      data.costumeId ?? characterInfo.defaultCostumeId,
    )
    this.level = +(data.propMap[4001].val || 0)
    this.levelXp = +(data.propMap[1001].val || 0)
    this.ascension = +(data.propMap[1002].val || 0)
    this.constellations =
      characterInfo.constellationIds.map((id) => {
        return new CharacterConstellation(id, !data.talentIdList?.includes(id))
      }) || []

    this.skills = characterInfo.skillOrder.map((id) => {
      const proudId = characterInfo.proudMap.get(id)
      const extraLevel =
        proudId && data.proudSkillExtraLevelMap
          ? data.proudSkillExtraLevelMap[proudId]
          : 0
      return new CharacterSkill(id, data.skillLevelMap[id] || 0, extraLevel)
    })

    this.combatStatus = new CharacterStatusManager(data.fightPropMap)
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
          data.reliquary.level - 1,
          data.reliquary.appendPropIdList,
        ),
    )
    this.friendShipLevel = data.fetterInfo.expLevel
    this.setBonus = new SetBonus(this.artifacts)
  }
}
