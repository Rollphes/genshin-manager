import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { CharacterSkill } from '@/models/character/CharacterSkill'
import { CharacterSkillAscension } from '@/models/character/CharacterSkillAscension'
import { Weapon } from '@/models/weapon/Weapon'
import { WeaponAscension } from '@/models/weapon/WeaponAscension'
/**
 * Class of materials available on specified days of the week
 */
export class DailyFarming {
  /**
   * Map of dungeon entry ID and text map ID
   */
  private static readonly replaceTextMapIdMap: { [key in number]: string } = {
    50: 'UI_DUNGEON_ENTRY_37',
    135: 'UI_DUNGEON_ENTRY_52',
    44: 'UI_DUNGEON_ENTRY_29',
    131: 'UI_DUNGEON_ENTRY_46',
  }

  /**
   * Day-of-week (0-6)
   * @description 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
   */
  public readonly dayOfWeek: number
  /**
   * Talent book IDs (Material IDs)
   */
  public readonly talentBookIds: number[]
  /**
   * Weapon material IDs (Material IDs)
   */
  public readonly weaponMaterialIds: number[]
  /**
   * Domains
   */
  public readonly domains: {
    name: string
    description: string
    materialIds: number[]
    characterIds: number[]
    weaponIds: number[]
  }[] = []

  /**
   * Create a DailyFarming
   * @description 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
   * @param dayOfWeek day-of-week (0-6)
   */
  constructor(dayOfWeek: number) {
    if (dayOfWeek < 0 || dayOfWeek > 6)
      throw new OutOfRangeError('dayOfWeek', dayOfWeek, 0, 6)
    this.dayOfWeek = dayOfWeek
    const rewardDateIndex = dayOfWeek === 0 ? 3 : (dayOfWeek - 1) % 3
    const dungeons = Object.values(
      Client._getCachedExcelBinOutputByName('DungeonEntryExcelConfigData'),
    )
    const domains = dungeons.filter(
      (dungeon) =>
        dungeon.isDailyRefresh !== undefined &&
        (dungeon.isDailyRefresh as boolean),
    )
    const skillDomains = domains.filter(
      (d) => d.type === 'DUNGEN_ENTRY_TYPE_AVATAR_TALENT',
    )
    const weaponDomains = domains.filter(
      (d) => d.type === 'DUNGEN_ENTRY_TYPE_WEAPON_PROMOTE',
    )

    ;[...weaponDomains, ...skillDomains].forEach((domain) => {
      const materialIds = (domain.descriptionCycleRewardList as number[][])[
        rewardDateIndex
      ]

      const nameTextId = Object.keys(DailyFarming.replaceTextMapIdMap).includes(
        String(domain.dungeonEntryId),
      )
        ? DailyFarming.replaceTextMapIdMap[domain.dungeonEntryId as number]
        : `UI_DUNGEON_ENTRY_${domain.dungeonEntryId as number}`

      const manualTextJson = Client._getJsonFromCachedExcelBinOutput(
        'ManualTextMapConfigData',
        nameTextId,
      )

      this.domains.push({
        name:
          Client.cachedTextMap.get(
            String(manualTextJson.textMapContentTextMapHash),
          ) || '',
        description:
          Client.cachedTextMap.get(String(domain.descTextMapHash)) || '',
        materialIds: materialIds,
        characterIds: this.getCharacterIdsByMaterialIds(materialIds),
        weaponIds: this.getWeaponIdsByMaterialIds(materialIds),
      })
    })

    this.talentBookIds = skillDomains.flatMap(
      (d) => (d.descriptionCycleRewardList as number[][])[rewardDateIndex],
    )
    this.weaponMaterialIds = weaponDomains.flatMap(
      (d) => (d.descriptionCycleRewardList as number[][])[rewardDateIndex],
    )
  }

  private getCharacterIdsByMaterialIds(materialIds: number[]): number[] {
    const result = new Set<number>()
    CharacterSkill.allSkillIds.forEach((skillId) => {
      for (let skillLevel = 1; skillLevel <= 10; skillLevel++) {
        const skillAscension = new CharacterSkillAscension(skillId, skillLevel)
        const costMaterialIds = skillAscension.costItems.map((item) => item.id)
        if (costMaterialIds.some((id) => materialIds.includes(id))) {
          result.add(skillId)
          break
        }
      }
    })
    return Array.from(result)
  }

  private getWeaponIdsByMaterialIds(materialIds: number[]): number[] {
    const result = new Set<number>()
    Weapon.allWeaponIds.forEach((weaponId) => {
      const maxPromoteLevel =
        WeaponAscension.getMaxPromoteLevelByWeaponId(weaponId)
      for (
        let promoteLevel = 1;
        promoteLevel <= maxPromoteLevel;
        promoteLevel++
      ) {
        const weapon = new WeaponAscension(weaponId, promoteLevel)
        const costMaterialIds = weapon.costItems.map((item) => item.id)
        if (costMaterialIds.some((id) => materialIds.includes(id))) {
          result.add(weaponId)
          break
        }
      }
    })
    return Array.from(result)
  }
}
