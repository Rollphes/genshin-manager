import type { ExcelBinCache, TextMapIndex } from '@genshin-manager/data'

import type { DomainData } from '@/common/DailyFarming'
import { DailyFarming } from '@/common/DailyFarming'
import type { RepositoryDependencies } from '@/types/RepositoryDependencies'

/**
 * Repository for building DailyFarming DTOs from ExcelBin and TextMap data.
 */
export class DailyFarmingRepository {
  /** Dungeon entry ID to text map ID override */
  private static readonly replaceTextMapIdMap: Record<number, string> = {
    50: 'UI_DUNGEON_ENTRY_37',
    135: 'UI_DUNGEON_ENTRY_52',
    44: 'UI_DUNGEON_ENTRY_29',
    131: 'UI_DUNGEON_ENTRY_46',
  }

  /** Blacklisted weapon IDs (same as WeaponRepository) */
  private static readonly blackWeaponIds = new Set([
    10002, 10003, 10004, 10005, 10006, 10008, 11411, 11508, 12304, 12508, 12509,
    13304, 13503, 14306, 14411, 14508, 15306, 20001,
  ])

  private readonly excelBinCache: ExcelBinCache
  private readonly textMap: TextMapIndex

  /**
   * Create a DailyFarmingRepository
   * @param deps - Repository dependencies
   */
  constructor(deps: RepositoryDependencies) {
    this.excelBinCache = deps.excelBinCache
    this.textMap = deps.textMap
  }

  /**
   * Build a DailyFarming DTO for a specific day of week
   * @param dayOfWeek - Day of week (0=Sunday, 1-6=Mon-Sat)
   * @returns DailyFarming DTO
   * @throws {@link ExcelBinPropertyNotFoundError} - When data is not found
   */
  public async getDailyFarming(dayOfWeek: number): Promise<DailyFarming> {
    const rewardDateIndex = dayOfWeek === 0 ? 3 : (dayOfWeek - 1) % 3

    const dungeonResults = await this.excelBinCache
      .from('DungeonEntryExcelConfigData')
      .select(['dungeonEntryId', 'type', 'descriptionCycleRewardList'])
      .execute()

    const skillDomains = dungeonResults.filter(
      (d) => d.type.value === 'DUNGEN_ENTRY_TYPE_AVATAR_TALENT',
    )
    const weaponDomains = dungeonResults.filter(
      (d) => d.type.value === 'DUNGEN_ENTRY_TYPE_WEAPON_PROMOTE',
    )

    const domains: DomainData[] = []
    const iterations = dayOfWeek === 0 ? 3 : 1

    for (let i = 0; i < iterations; i++) {
      const allDomainEntries = [...weaponDomains, ...skillDomains]
      for (const domain of allDomainEntries) {
        const rewardList = domain.descriptionCycleRewardList.value
        const rewardEntry = rewardList[dayOfWeek === 0 ? i : rewardDateIndex]
        // descriptionCycleRewardList is { [key: string]: number }[] - convert to number[]
        const materialIds = Object.values(rewardEntry)
        const dungeonEntryId = domain.dungeonEntryId.value

        const nameTextId =
          String(dungeonEntryId) in DailyFarmingRepository.replaceTextMapIdMap
            ? DailyFarmingRepository.replaceTextMapIdMap[dungeonEntryId]
            : `UI_DUNGEON_ENTRY_${String(dungeonEntryId)}`

        const manualResult = await this.excelBinCache
          .fromWithTextMap('ManualTextMapConfigData', this.textMap)
          .select(['textMapId', 'textMapContentTextMapHash'])
          .where('textMapId', '=', nameTextId)
          .executeTakeFirstOrThrow()

        const domainName = manualResult.textMapContentTextMapHash.toText()

        const characterIds =
          await this.getCharacterIdsByMaterialIds(materialIds)
        const weaponIds = await this.getWeaponIdsByMaterialIds(materialIds)

        domains.push({
          name: domainName,
          description: '',
          materialIds,
          characterIds,
          weaponIds,
        })
      }
    }

    const talentBookIds = skillDomains.flatMap((d) => {
      const rewardList = d.descriptionCycleRewardList.value
      return Object.values(rewardList[rewardDateIndex])
    })

    const weaponMaterialIds = weaponDomains.flatMap((d) => {
      const rewardList = d.descriptionCycleRewardList.value
      return Object.values(rewardList[rewardDateIndex])
    })

    return new DailyFarming({
      dayOfWeek,
      talentBookIds,
      weaponMaterialIds,
      domains,
    })
  }

  /**
   * Find character IDs that use the given material IDs for skill leveling
   * @param materialIds - Target material IDs
   * @returns Array of character IDs
   */
  private async getCharacterIdsByMaterialIds(
    materialIds: number[],
  ): Promise<number[]> {
    const materialIdSet = new Set(materialIds)

    // 1. Find proudSkillGroupIds that use these materials
    const proudSkillResults = await this.excelBinCache
      .from('ProudSkillExcelConfigData')
      .select(['proudSkillGroupId', 'costItems'])
      .execute()

    const proudSkillGroupIds = new Set<number>()
    for (const record of proudSkillResults) {
      const costItems = record.costItems.value
      if (costItems.some((item) => materialIdSet.has(item.id)))
        proudSkillGroupIds.add(record.proudSkillGroupId.value)
    }

    // 2. Find skill IDs that have these proudSkillGroupIds
    const skillResults = await this.excelBinCache
      .from('AvatarSkillExcelConfigData')
      .select(['id', 'proudSkillGroupId'])
      .execute()

    const skillIds = new Set<number>()
    for (const record of skillResults) {
      if (proudSkillGroupIds.has(record.proudSkillGroupId.value))
        skillIds.add(record.id.value)
    }

    // 3. Find skillDepotIds that contain these skills
    const depotResults = await this.excelBinCache
      .from('AvatarSkillDepotExcelConfigData')
      .select(['id', 'skills', 'energySkill'])
      .execute()

    const skillDepotIds = new Set<number>()
    for (const record of depotResults) {
      const skills = record.skills.value
      const energySkill = record.energySkill.value
      const allSkills = [...skills, energySkill]
      if (allSkills.some((skillId) => skillIds.has(skillId)))
        skillDepotIds.add(record.id.value)
    }

    // 4. Find characters with these skillDepotIds
    const avatarResults = await this.excelBinCache
      .from('AvatarExcelConfigData')
      .select(['id', 'skillDepotId'])
      .execute()

    const characterIds = new Set<number>()
    for (const record of avatarResults) {
      const characterId = record.id.value
      if (
        skillDepotIds.has(record.skillDepotId.value) &&
        characterId <= 11000000 &&
        characterId !== 10000001
      )
        characterIds.add(characterId)
    }

    return Array.from(characterIds)
  }

  /**
   * Find weapon IDs that use the given material IDs for ascension
   * @param materialIds - Target material IDs
   * @returns Array of weapon IDs
   */
  private async getWeaponIdsByMaterialIds(
    materialIds: number[],
  ): Promise<number[]> {
    const materialIdSet = new Set(materialIds)

    const promoteResults = await this.excelBinCache
      .from('WeaponPromoteExcelConfigData')
      .select(['weaponPromoteId', 'costItems'])
      .execute()

    const weaponPromoteIds = new Set<number>()
    for (const record of promoteResults) {
      const costItems = record.costItems.value
      if (costItems.some((item) => materialIdSet.has(item.id)))
        weaponPromoteIds.add(record.weaponPromoteId.value)
    }

    const weaponResults = await this.excelBinCache
      .from('WeaponExcelConfigData')
      .select(['id', 'weaponPromoteId'])
      .execute()

    const result = new Set<number>()
    for (const record of weaponResults) {
      const weaponId = record.id.value
      if (
        weaponPromoteIds.has(record.weaponPromoteId.value) &&
        !DailyFarmingRepository.blackWeaponIds.has(weaponId)
      )
        result.add(weaponId)
    }

    return Array.from(result)
  }
}
