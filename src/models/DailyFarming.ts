import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
/**
 * Class of materials available on specified days of the week
 */
export class DailyFarming {
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
            Client._getCachedExcelBinOutputByName(
                'DungeonEntryExcelConfigData',
            ),
        )
        const domains = dungeons.filter(
            (dungeon) =>
                dungeon.isDailyRefresh !== undefined &&
                (dungeon.isDailyRefresh as boolean),
        )
        this.talentBookIds = domains
            .filter((d) => d.type === 'DUNGEN_ENTRY_TYPE_AVATAR_TALENT')
            .flatMap(
                (d) =>
                    (d.descriptionCycleRewardList as number[][])[
                        rewardDateIndex
                    ],
            )
        this.weaponMaterialIds = domains
            .filter((d) => d.type === 'DUNGEN_ENTRY_TYPE_WEAPON_PROMOTE')
            .flatMap(
                (d) =>
                    (d.descriptionCycleRewardList as number[][])[
                        rewardDateIndex
                    ],
            )
    }
}
