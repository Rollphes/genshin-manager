import { characterLevelSchema } from '@/schemas/commonSchemas'
import { validate } from '@/schemas/validate'

/**
 * Promote data required for level calculation
 */
interface PromoteData {
  /** Promote level (0-6) */
  readonly promoteLevel: number
  /** Max level unlocked at this promote level */
  readonly unlockMaxLevel: number
}

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
  void validate(
    characterLevelSchema,
    level,
    'calculatePromoteLevel.function.level',
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
