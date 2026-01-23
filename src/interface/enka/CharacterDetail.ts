import { GeneralError } from '@/application/errors/GeneralError'
import { BodyType, WeaponType } from '@/domain/types/enums'
import { Element } from '@/domain/types/types'
import type {
  AvatarInfoResponse,
  ReliquaryEquipResponse,
  WeaponEquipResponse,
} from '@/infrastructure/types/api/enkaNetwork/responses'
import { Artifact } from '@/interface/Artifact'
import { CharacterConstellation } from '@/interface/character/CharacterConstellation'
import { CharacterCostume } from '@/interface/character/CharacterCostume'
import { CharacterInfo } from '@/interface/character/CharacterInfo'
import { CharacterSkill } from '@/interface/character/CharacterSkill'
import { CharacterStatusManager } from '@/interface/character/CharacterStatusManager'
import { SetBonus } from '@/interface/SetBonus'
import { WeaponInfo } from '@/interface/weapon/WeaponInfo'

/**
 * Represents detailed character data retrieved from the EnkaNetwork API
 */
export class CharacterDetail {
  /**
   * Character ID
   */
  public readonly id: number
  /**
   * Character default costume ID
   */
  public readonly defaultCostumeId: number
  /**
   * Character Depot ID
   */
  public readonly depotId: number
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
   * Character promote level (ascension)
   */
  public readonly promoteLevel: number
  /**
   * Character constellations
   * @warning This value shows the actual constellation level regardless of the player's privacy settings.
   * It is not affected by the `isShowCharacterPreviewConstellation` setting.
   * @see PlayerDetail
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
  public readonly weapon: WeaponInfo
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
   * Data from EnkaNetwork
   */
  public readonly data: AvatarInfoResponse

  /**
   * Create a CharacterDetail
   * @param data - data from EnkaNetwork
   */
  constructor(data: AvatarInfoResponse) {
    const characterInfo = new CharacterInfo(data.avatarId, data.skillDepotId)
    this.id = characterInfo.id
    this.defaultCostumeId = characterInfo.defaultCostumeId
    this.depotId = characterInfo.depotId
    this.name = characterInfo.name
    this.element = characterInfo.element
    this.rarity = characterInfo.rarity
    this.bodyType = characterInfo.bodyType
    this.weaponType = characterInfo.weaponType
    this.maxLevel = characterInfo.maxLevel
    this.costume = new CharacterCostume(
      data.costumeId ?? characterInfo.defaultCostumeId,
    )
    this.level = +(data.propMap[4001].val ?? 0)
    this.levelXp = +(data.propMap[1001].val ?? 0)
    this.promoteLevel = +(data.propMap[1002].val ?? 0)
    this.constellations = characterInfo.constellationIds.map((id) => {
      return new CharacterConstellation(id, !data.talentIdList?.includes(id))
    })

    this.skills = characterInfo.skillOrder.map((id) => {
      const proudId = characterInfo.proudMap.get(id)
      const extraLevel =
        proudId && data.proudSkillExtraLevelMap
          ? data.proudSkillExtraLevelMap[proudId]
          : 0
      return new CharacterSkill(id, data.skillLevelMap[id], extraLevel)
    })

    this.combatStatus = new CharacterStatusManager(data.fightPropMap)
    const weaponData = data.equipList.find(
      (equip): equip is WeaponEquipResponse => 'weapon' in equip,
    )
    if (!weaponData) throw new GeneralError('Weapon not found.')
    const affixMap = weaponData.weapon.affixMap
    this.weapon = new WeaponInfo(
      weaponData.itemId,
      weaponData.weapon.level,
      [0, 20, 40, 50, 60, 70, 80, 90][weaponData.weapon.promoteLevel ?? 0] >=
        weaponData.weapon.level,
      (affixMap ? affixMap[weaponData.itemId + 100000] : 0) + 1,
    )
    const artifactDatas = data.equipList.filter(
      (equip): equip is ReliquaryEquipResponse => 'reliquary' in equip,
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

    this.data = data
  }
}
