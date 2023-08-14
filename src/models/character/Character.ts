import { Client } from '@/client/Client'
import { ElementKeys, ValueOf } from '@/types'
import { JsonObject } from '@/utils/JsonParser'
export class Character {
  public readonly id: number
  public readonly defaultCostumeId: number
  public readonly name: string
  public readonly depotId: number
  public readonly element: ValueOf<typeof ElementKeys> | undefined
  public readonly skillOrder: number[]
  public readonly subSkills: number[]
  public readonly talentIds: number[]
  public readonly proudMap: Map<number, number> = new Map()

  constructor(characterId: number, skillDepotId?: number) {
    this.id = characterId
    const costumeDatas = Object.values(
      Client.cachedExcelBinOutput
        .get('AvatarCostumeExcelConfigData')
        ?.get() as JsonObject,
    ) as JsonObject[]
    const defaultCostumeData = costumeDatas.find(
      (k) => k.avatarId == this.id && !('rarity' in k),
    ) as JsonObject
    this.defaultCostumeId = defaultCostumeData.costumeId as number

    const avatarJson = Client.cachedExcelBinOutputGetter(
      'AvatarExcelConfigData',
      this.id,
    )

    this.depotId =
      skillDepotId && [10000005, 10000007].includes(this.id)
        ? skillDepotId
        : (avatarJson.skillDepotId as number)
    const depotJson = Client.cachedExcelBinOutputGetter(
      'AvatarSkillDepotExcelConfigData',
      this.depotId,
    )

    const skillJson = depotJson.energySkill
      ? Client.cachedExcelBinOutputGetter(
          'AvatarSkillExcelConfigData',
          depotJson.energySkill as number,
        )
      : undefined

    this.name =
      Client.cachedTextMap.get(String(avatarJson.nameTextMapHash)) || ''

    this.element = skillJson
      ? ElementKeys[skillJson.costElemType as keyof typeof ElementKeys]
      : undefined

    this.skillOrder = [501, 701].includes(this.depotId)
      ? (depotJson.skills as number[]).slice(0, 1)
      : (depotJson.skills as number[])
          .slice(0, 2)
          .concat(depotJson.energySkill as number)
    const runSkillId = (depotJson.subSkills as number[])[3]
    this.subSkills =
      runSkillId ?? null
        ? [runSkillId].concat(depotJson.subSkills as number[])
        : (depotJson.subSkills as number[])

    this.talentIds = depotJson.talents as number[]

    this.skillOrder.forEach((skillId) => {
      const skillJson = Client.cachedExcelBinOutputGetter(
        'AvatarSkillExcelConfigData',
        skillId,
      )
      const proudId = skillJson.proudSkillGroupId as number | undefined
      if (proudId) this.proudMap.set(skillId, proudId)
    })
  }
}
