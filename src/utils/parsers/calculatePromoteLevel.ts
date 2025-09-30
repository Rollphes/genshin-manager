import { characterLevelSchema } from '@/schemas'
import { JsonObject } from '@/types/json'
import { ValidationHelper } from '@/utils/validation'

/**
 * Calculate promote level
 * @param promotesJson promotes json
 * @param level level (1-90)
 * @param isAscended is ascended
 * @returns promote level (0-6)
 */
export function calculatePromoteLevel(
  promotesJson: JsonObject,
  level: number,
  isAscended: boolean,
): number {
  void ValidationHelper.validate(characterLevelSchema, level, {
    propertyKey: 'level',
  })
  const maxPromoteLevel = Math.max(
    ...(Object.values(promotesJson) as JsonObject[]).map(
      (promote) => (promote.promoteLevel ?? 0) as number,
    ),
  )
  const beforePromoteLevels = (Object.values(promotesJson) as JsonObject[])
    .filter((promote) => (promote.unlockMaxLevel as number) < level)
    .map((promote) => ((promote.promoteLevel ?? 0) as number) + 1)

  const afterPromoteLevels = (Object.values(promotesJson) as JsonObject[])
    .filter((promote) => (promote.unlockMaxLevel as number) <= level)
    .map((promote) => ((promote.promoteLevel ?? 0) as number) + 1)

  const beforePromoteLevelByLevel = Math.max(...beforePromoteLevels, 0)
  const afterPromoteLevelByLevel = Math.max(...afterPromoteLevels, 0)

  return isAscended
    ? Math.min(afterPromoteLevelByLevel, maxPromoteLevel)
    : beforePromoteLevelByLevel
}
