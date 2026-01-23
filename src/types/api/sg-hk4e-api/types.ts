/**
 * Region type
 */
export type Region =
  | 'cn_gf01'
  | 'cn_qd01'
  | 'os_usa'
  | 'os_euro'
  | 'os_asia'
  | 'os_cht'

/**
 * Time difference per region (hour).
 * @internal
 */
export const TimeZonesPerRegion = {
  cn_gf01: 8,
  cn_qd01: 8,
  os_usa: -5,
  os_euro: 1,
  os_asia: 8,
  os_cht: 8,
} as const satisfies Record<Region, number>
