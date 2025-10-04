import { describe, expect, it } from 'vitest'

import { FightProps } from '@/types'
import { toFightPropType } from '@/utils/typeGuards'

/**
 * Type guard utilities test suite
 */
describe('Type Guards', () => {
  describe('toFightPropType', () => {
    it('should convert valid value to FightPropType', () => {
      const result = toFightPropType('FIGHT_PROP_BASE_HP')
      expect(result).toBe('FIGHT_PROP_BASE_HP')
    })

    it('should throw error for invalid value', () => {
      expect(() => toFightPropType('INVALID')).toThrow(
        'FightPropType must be one of',
      )
      expect(() => toFightPropType(123)).toThrow('FightPropType must be one of')
    })

    it('should include context in error message', () => {
      expect(() => toFightPropType('INVALID', 'testContext')).toThrow(
        'testContext',
      )
    })

    it('should work with all FightProps values', () => {
      Object.values(FightProps).forEach((value) => {
        expect(() => toFightPropType(value)).not.toThrow()
        expect(toFightPropType(value)).toBe(value)
      })
    })
  })

  describe('Type Guards Integration', () => {
    it('should handle error cases gracefully', () => {
      const invalidData: Record<string, unknown> = {
        propType: 'INVALID_PROP',
      }

      expect(() => toFightPropType(invalidData.propType)).toThrow()
    })
  })
})
