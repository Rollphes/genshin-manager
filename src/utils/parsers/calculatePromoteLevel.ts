import { characterLevelSchema } from '@/schemas/commonSchemas'
import type { AvatarPromoteExcelConfigDataType } from '@/types/generated/AvatarPromoteExcelConfigData'
import { validate } from '@/utils/validation/validate'

/**
 * Calculate promote level
 * @param promotesJson promotes json
 * @param level level (1-90)
 * @param isAscended is ascended
 * @returns promote level (0-6)
 */
export function calculatePromoteLevel(
  promotesJson: Record<
    string,
    | Pick<AvatarPromoteExcelConfigDataType, 'promoteLevel' | 'unlockMaxLevel'>
    | undefined
  >,
  level: number,
  isAscended: boolean,
): number {
  void validate(characterLevelSchema, level, {
    propertyKey: 'level',
  })
  const promotes = Object.values(promotesJson).filter(
    (
      p,
    ): p is Pick<
      AvatarPromoteExcelConfigDataType,
      'promoteLevel' | 'unlockMaxLevel'
    > => p !== undefined,
  )
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
