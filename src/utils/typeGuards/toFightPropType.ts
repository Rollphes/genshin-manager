import { EnumValidationError } from '@/errors'
import { FightProps, FightPropType } from '@/types'

/**
 * Cached array of valid FightPropType values
 * @remarks Computed once for performance optimization
 */
const allowedValues = Object.values(FightProps)

/**
 * Safely converts a value to FightPropType
 * @param value - The value to convert
 * @param context - Context information for error messages
 * @returns The value as FightPropType
 * @throws EnumValidationError if the value is not a valid FightPropType
 */
export function toFightPropType(
  value: unknown,
  context?: string,
): FightPropType {
  if (typeof value !== 'string' || !value.startsWith('FIGHT_PROP_')) {
    throw new EnumValidationError(
      value,
      allowedValues,
      'FightPropType',
      context ? { propertyKey: context } : undefined,
    )
  }
  return value as FightPropType
}
