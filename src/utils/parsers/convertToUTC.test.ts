import { describe, expect, it } from 'vitest'

import { convertToUTC } from '@/utils/parsers/convertToUTC'

describe('convertToUTC', () => {
  it('should return Date object', () => {
    const result = convertToUTC('2024-01-15 12:00:00', 'os_asia')
    expect(result).toBeInstanceOf(Date)
  })

  it('should convert os_asia (UTC+8) date to UTC', () => {
    // 2024-01-15 12:00:00 in os_asia (UTC+8) should be 2024-01-15 04:00:00 UTC
    const result = convertToUTC('2024-01-15 12:00:00', 'os_asia')
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(0) // January
    expect(result.getUTCDate()).toBe(15)
    expect(result.getUTCHours()).toBe(4)
    expect(result.getUTCMinutes()).toBe(0)
  })

  it('should convert os_euro (UTC+1) date to UTC', () => {
    // 2024-01-15 12:00:00 in os_euro (UTC+1) should be 2024-01-15 11:00:00 UTC
    const result = convertToUTC('2024-01-15 12:00:00', 'os_euro')
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(0)
    expect(result.getUTCDate()).toBe(15)
    expect(result.getUTCHours()).toBe(11)
    expect(result.getUTCMinutes()).toBe(0)
  })

  it('should convert os_usa (UTC-5) date to UTC', () => {
    // 2024-01-15 12:00:00 in os_usa (UTC-5) should be 2024-01-15 17:00:00 UTC
    const result = convertToUTC('2024-01-15 12:00:00', 'os_usa')
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(0)
    expect(result.getUTCDate()).toBe(15)
    expect(result.getUTCHours()).toBe(17)
    expect(result.getUTCMinutes()).toBe(0)
  })

  it('should convert cn_gf01 (UTC+8) date to UTC', () => {
    // 2024-01-15 12:00:00 in cn_gf01 (UTC+8) should be 2024-01-15 04:00:00 UTC
    const result = convertToUTC('2024-01-15 12:00:00', 'cn_gf01')
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(0)
    expect(result.getUTCDate()).toBe(15)
    expect(result.getUTCHours()).toBe(4)
  })

  it('should convert cn_qd01 (UTC+8) date to UTC', () => {
    // 2024-01-15 12:00:00 in cn_qd01 (UTC+8) should be 2024-01-15 04:00:00 UTC
    const result = convertToUTC('2024-01-15 12:00:00', 'cn_qd01')
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(0)
    expect(result.getUTCDate()).toBe(15)
    expect(result.getUTCHours()).toBe(4)
  })

  it('should convert os_cht (UTC+8) date to UTC', () => {
    // 2024-01-15 12:00:00 in os_cht (UTC+8) should be 2024-01-15 04:00:00 UTC
    const result = convertToUTC('2024-01-15 12:00:00', 'os_cht')
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(0)
    expect(result.getUTCDate()).toBe(15)
    expect(result.getUTCHours()).toBe(4)
  })

  it('should handle date crossing midnight', () => {
    // 2024-01-15 02:00:00 in os_asia (UTC+8) should be 2024-01-14 18:00:00 UTC
    const result = convertToUTC('2024-01-15 02:00:00', 'os_asia')
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(0)
    expect(result.getUTCDate()).toBe(14)
    expect(result.getUTCHours()).toBe(18)
  })
})
