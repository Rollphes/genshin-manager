import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { JsonObject } from '@/types/json'

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
  if (level < 1 || level > 100)
    throw new OutOfRangeError('level', level, 1, 100)
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
