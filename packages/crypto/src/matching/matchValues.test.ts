import { describe, expect, it } from 'vitest'

import { matchValues } from '@/matching/matchValues'

describe('matchValues', () => {
  describe('exact strategy', () => {
    it('should return true for equal strings', () => {
      expect(matchValues('test', 'test', 'exact')).toBe(true)
    })

    it('should return false for different strings', () => {
      expect(matchValues('test', 'Test', 'exact')).toBe(false)
    })

    it('should return true for equal numbers', () => {
      expect(matchValues(42, 42, 'exact')).toBe(true)
    })

    it('should return false for different numbers', () => {
      expect(matchValues(42, 43, 'exact')).toBe(false)
    })

    it('should return true for both null', () => {
      expect(matchValues(null, null, 'exact')).toBe(true)
    })

    it('should return true for equal booleans', () => {
      expect(matchValues(true, true, 'exact')).toBe(true)
      expect(matchValues(false, false, 'exact')).toBe(true)
    })
  })

  describe('fuzzy strategy', () => {
    it('should match case-insensitive strings', () => {
      expect(matchValues('Test', 'test', 'fuzzy')).toBe(true)
      expect(matchValues('TEST', 'test', 'fuzzy')).toBe(true)
    })

    it('should match nearly equal numbers', () => {
      expect(matchValues(1.0001, 1.0002, 'fuzzy')).toBe(true)
      expect(matchValues(0, 0.0005, 'fuzzy')).toBe(true)
    })

    it('should not match numbers with large difference', () => {
      expect(matchValues(1, 2, 'fuzzy')).toBe(false)
    })

    it('should match null with null or undefined', () => {
      expect(matchValues(null, null, 'fuzzy')).toBe(true)
      expect(matchValues(null, undefined, 'fuzzy')).toBe(true)
    })

    it('should match undefined with null or undefined', () => {
      expect(matchValues(undefined, undefined, 'fuzzy')).toBe(true)
      expect(matchValues(undefined, null, 'fuzzy')).toBe(true)
    })
  })

  describe('subset strategy', () => {
    it('should match equal values', () => {
      expect(matchValues('test', 'test', 'subset')).toBe(true)
      expect(matchValues(42, 42, 'subset')).toBe(true)
    })

    it('should not match different values', () => {
      expect(matchValues('test', 'Test', 'subset')).toBe(false)
    })

    it('should match null with null or undefined', () => {
      expect(matchValues(null, null, 'subset')).toBe(true)
      expect(matchValues(null, undefined, 'subset')).toBe(true)
    })
  })
})
