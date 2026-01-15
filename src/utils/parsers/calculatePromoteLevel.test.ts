import { describe, expect, it } from 'vitest'

import { calculatePromoteLevel } from '@/utils/parsers/calculatePromoteLevel'

describe('calculatePromoteLevel', () => {
  // Standard promote configuration (6 ascension levels)
  const standardPromotes = {
    '0': { promoteLevel: 0, unlockMaxLevel: 20 },
    '1': { promoteLevel: 1, unlockMaxLevel: 40 },
    '2': { promoteLevel: 2, unlockMaxLevel: 50 },
    '3': { promoteLevel: 3, unlockMaxLevel: 60 },
    '4': { promoteLevel: 4, unlockMaxLevel: 70 },
    '5': { promoteLevel: 5, unlockMaxLevel: 80 },
    '6': { promoteLevel: 6, unlockMaxLevel: 90 },
  }

  describe('not ascended', () => {
    it('should return 0 for level 1', () => {
      expect(calculatePromoteLevel(standardPromotes, 1, false)).toBe(0)
    })

    it('should return 0 for level 20', () => {
      expect(calculatePromoteLevel(standardPromotes, 20, false)).toBe(0)
    })

    it('should return 1 for level 21-40', () => {
      expect(calculatePromoteLevel(standardPromotes, 21, false)).toBe(1)
      expect(calculatePromoteLevel(standardPromotes, 40, false)).toBe(1)
    })

    it('should return 2 for level 41-50', () => {
      expect(calculatePromoteLevel(standardPromotes, 41, false)).toBe(2)
      expect(calculatePromoteLevel(standardPromotes, 50, false)).toBe(2)
    })

    it('should return 3 for level 51-60', () => {
      expect(calculatePromoteLevel(standardPromotes, 51, false)).toBe(3)
      expect(calculatePromoteLevel(standardPromotes, 60, false)).toBe(3)
    })

    it('should return 4 for level 61-70', () => {
      expect(calculatePromoteLevel(standardPromotes, 61, false)).toBe(4)
      expect(calculatePromoteLevel(standardPromotes, 70, false)).toBe(4)
    })

    it('should return 5 for level 71-80', () => {
      expect(calculatePromoteLevel(standardPromotes, 71, false)).toBe(5)
      expect(calculatePromoteLevel(standardPromotes, 80, false)).toBe(5)
    })

    it('should return 6 for level 81-90', () => {
      expect(calculatePromoteLevel(standardPromotes, 81, false)).toBe(6)
      expect(calculatePromoteLevel(standardPromotes, 90, false)).toBe(6)
    })
  })

  describe('ascended', () => {
    it('should return 1 for level 20 ascended', () => {
      expect(calculatePromoteLevel(standardPromotes, 20, true)).toBe(1)
    })

    it('should return 2 for level 40 ascended', () => {
      expect(calculatePromoteLevel(standardPromotes, 40, true)).toBe(2)
    })

    it('should return 3 for level 50 ascended', () => {
      expect(calculatePromoteLevel(standardPromotes, 50, true)).toBe(3)
    })

    it('should return 4 for level 60 ascended', () => {
      expect(calculatePromoteLevel(standardPromotes, 60, true)).toBe(4)
    })

    it('should return 5 for level 70 ascended', () => {
      expect(calculatePromoteLevel(standardPromotes, 70, true)).toBe(5)
    })

    it('should return 6 for level 80 ascended', () => {
      expect(calculatePromoteLevel(standardPromotes, 80, true)).toBe(6)
    })

    it('should cap at max promote level for level 90 ascended', () => {
      expect(calculatePromoteLevel(standardPromotes, 90, true)).toBe(6)
    })
  })

  describe('edge cases', () => {
    it('should handle empty promotes', () => {
      const emptyPromotes = {}
      expect(calculatePromoteLevel(emptyPromotes, 50, false)).toBe(0)
    })

    it('should handle promotes with undefined values', () => {
      const promotesWithUndefined = {
        '0': { promoteLevel: 0, unlockMaxLevel: 20 },
        '1': undefined,
        '2': { promoteLevel: 2, unlockMaxLevel: 50 },
      }
      expect(calculatePromoteLevel(promotesWithUndefined, 25, false)).toBe(1)
    })

    it('should handle level at exact boundary (not ascended)', () => {
      expect(calculatePromoteLevel(standardPromotes, 20, false)).toBe(0)
      expect(calculatePromoteLevel(standardPromotes, 40, false)).toBe(1)
    })

    it('should handle level at exact boundary (ascended)', () => {
      expect(calculatePromoteLevel(standardPromotes, 20, true)).toBe(1)
      expect(calculatePromoteLevel(standardPromotes, 40, true)).toBe(2)
    })
  })

  describe('validation', () => {
    it('should throw for level below 1', () => {
      expect(() => calculatePromoteLevel(standardPromotes, 0, false)).toThrow()
    })

    it('should throw for level above 100', () => {
      expect(() =>
        calculatePromoteLevel(standardPromotes, 101, false),
      ).toThrow()
    })
  })
})
