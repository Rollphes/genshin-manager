import { logger } from '@genshin-manager/core'

import { FightProp } from '@/types/enums'

/**
 * Convert string to FightProp enum with safe fallback
 * Returns FightPropNone for unknown values and logs a warning
 * This ensures forward compatibility with game updates that may add new FightProp values
 * @param value - String value from game data
 * @returns FightProp enum value, or FightPropNone if not found
 */
export function toFightProp(value: string): FightProp {
  const entries = Object.entries(FightProp)
  const found = entries.find(([, v]) => {
    const vStr: string = v
    return vStr === value
  })

  if (found) return found[1]

  // Log warning for unknown FightProp values (indicates game update with new props)
  logger.warn(
    `Unknown FightProp value: ${value}. Using FightPropNone as fallback.`,
  )
  return FightProp.FightPropNone
}
