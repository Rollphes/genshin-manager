import { Region, TimeZonesPerRegion } from '@/types/sg-hk4e-api'

/**
 * Convert the date string to UTC
 * @param dateString date string
 * @param region game region
 * @returns UTC date
 */
export function convertToUTC(dateString: string, region: Region): Date {
  const date = new Date(dateString)
  const offset = TimeZonesPerRegion[region] * 60 * 60 * 1000

  return new Date(
    date.getTime() + (-offset - date.getTimezoneOffset() * 60 * 1000),
  )
}
