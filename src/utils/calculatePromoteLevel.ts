import { JsonObject } from '@/utils/JsonParser'

/**
 * Calculate promote level
 * @param promotesJson Promotes json
 * @param level Level
 * @param isAscended Is ascended
 * @returns Promote level
 */
export function calculatePromoteLevel(
  promotesJson: JsonObject,
  level: number,
  isAscended: boolean,
): number {
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
