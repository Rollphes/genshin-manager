import { characterLevelSchema } from '@/domain/schemas/commonSchemas'
import { validate } from '@/domain/validation/validate'
import type { AvatarPromoteExcelConfigDataType } from '@/infrastructure/types/generated/AvatarPromoteExcelConfigData'

type PromoteData = Pick<
  AvatarPromoteExcelConfigDataType,
  'promoteLevel' | 'unlockMaxLevel'
>

/**
 * Calculate promote level from array of promote data
 * @param promotes - array of promote data
 * @param level - level (1-90)
 * @param isAscended - is ascended
 * @returns promote level (0-6)
 */
export function calculatePromoteLevel(
  promotes: PromoteData[],
  level: number,
  isAscended: boolean,
): number {
  void validate(characterLevelSchema, level, {
    propertyKey: 'level',
  })
  const maxPromoteLevel = Math.max(
    ...promotes.map((promote) => promote.promoteLevel),
  )
  const beforePromoteLevels = promotes
    .filter((promote) => promote.unlockMaxLevel < level)
    .map((promote) => promote.promoteLevel + 1)

  const afterPromoteLevels = promotes
    .filter((promote) => promote.unlockMaxLevel <= level)
    .map((promote) => promote.promoteLevel + 1)

  const beforePromoteLevelByLevel = Math.max(...beforePromoteLevels, 0)
  const afterPromoteLevelByLevel = Math.max(...afterPromoteLevels, 0)

  return isAscended
    ? Math.min(afterPromoteLevelByLevel, maxPromoteLevel)
    : beforePromoteLevelByLevel
}
