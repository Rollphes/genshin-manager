// builder
export type { JoinedRecord } from '@/builder/JoinQueryBuilder'
export { JoinQueryBuilder } from '@/builder/JoinQueryBuilder'
export { QueryBuilder } from '@/builder/QueryBuilder'
export type {
  IndexKey,
  OrderByConfig,
  SelectedRecord,
  WhereCondition,
  WhereEqCondition,
  WhereInCondition,
} from '@/builder/types'

// cache
export { IndexRegistry } from '@/cache/IndexRegistry'
export { Table } from '@/cache/Table'
export { TableCache } from '@/cache/TableCache'
export type { IndexKey as CacheIndexKey } from '@/cache/types'

// location
export { Location } from '@/location/Location'
export type {
  FilterSegment,
  IndexSegment,
  LocationSegment,
  PropSegment,
  RootSegment,
} from '@/location/types'

// value
export type { LocatedElement } from '@/value/LocatedArray'
export { LocatedArray } from '@/value/LocatedArray'
export { LocatedValue } from '@/value/LocatedValue'
export type { TextMapProvider } from '@/value/types'
