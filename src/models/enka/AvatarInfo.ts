import { Client } from '@/client/Client'
import { EnkaManagerError } from '@/errors/EnkaManagerError'
import { Artifact } from '@/models/Artifact'
import { Character } from '@/models/character/Character'
import { Costume } from '@/models/character/Costume'
import { FightProp } from '@/models/character/FightProp'
import { Skill } from '@/models/character/Skill'
import { Talent } from '@/models/character/Talent'
import { Weapon } from '@/models/Weapon'
import {
  APIAvatarInfo,
  APIReliquaryEquip,
  APIWeaponEquip,
} from '@/types/EnkaTypes'
interface SetBonus {
  1: Artifact[]
  2: Artifact[]
  4: Artifact[]
}

export class AvatarInfo extends Character {
  public readonly costume: Costume
  public readonly level: number
  public readonly levelXp: number
  public readonly ascension: number
  public readonly talentList: Talent[]
  public readonly skills: Skill[]
  public readonly fightPropMap: FightProp
  public readonly weapon: Weapon
  public readonly artifacts: Artifact[]
  public readonly friendShipLevel: number

  private readonly oneSetBonusIds: number[] = [15009, 15010, 15011, 15013]

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

    this.fightPropMap = new FightProp(data.fightPropMap)
    const weaponData = data.equipList.find(
      (equip): equip is APIWeaponEquip => equip.flat.itemType == 'ITEM_WEAPON',
    )
    if (!weaponData) throw new EnkaManagerError('Weapon not found.')
    const affixMap = weaponData.weapon.affixMap
    this.weapon = new Weapon(
      weaponData.itemId,
      weaponData.weapon.level,
      weaponData.weapon.promoteLevel,
      (affixMap ? affixMap[weaponData.itemId + 100000] : 0) + 1,
    )
    const artifactDatas = data.equipList.filter(
      (equip): equip is APIReliquaryEquip =>
        equip.flat.itemType == 'ITEM_RELIQUARY',
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
  }

  public searchActiveSetBonus(): SetBonus {
    const setIds: number[] = this.artifacts
      .map((artifact) => artifact.setId)
      .filter((setId): setId is number => setId !== undefined)
    const countIds: { [setId: string]: number } = {}
    setIds.forEach((value) => {
      if (value in countIds) countIds[value]++
      else countIds[value] = 1
    })

    const setBracers: { [setId: string]: Artifact } = {}
    Object.keys(countIds).map((setId) => {
      const setJson = Client.cachedExcelBinOutputGetter(
        'ReliquarySetExcelConfigData',
        setId,
      )
      setBracers[setId] = new Artifact(
        (setJson.containsList as number[])[0],
        10001,
      )
    })
    const activeSetIds: string[] = Object.keys(countIds).filter((value) => {
      if (this.oneSetBonusIds.includes(+value)) {
        countIds[value] = 1
        return value
      } else if (countIds[value] >= 4) {
        countIds[value] = 4
        return value
      } else if (countIds[value] >= 2) {
        countIds[value] = 2
        return value
      }
    })
    return {
      1: activeSetIds
        .filter((setId) => countIds[setId] == 1)
        .map((setId) => setBracers[setId]),
      2: activeSetIds
        .filter((setId) => countIds[setId] == 2)
        .map((setId) => setBracers[setId]),
      4: activeSetIds
        .filter((setId) => countIds[setId] == 4)
        .map((setId) => setBracers[setId]),
    }
  }
}
