import { Region, TimeZonesPerRegion } from '@/types'

/**
 * Convert the date string to UTC.
 * @param dateString
 * @param region
 * @returns
 */
export function convertToUTC(dateString: string, region: Region) {
  const date = new Date(dateString)
  const offset = TimeZonesPerRegion[region] * 60 * 60 * 1000

  return new Date(
    date.getTime() + (-offset - date.getTimezoneOffset() * 60 * 1000),
  )
}
