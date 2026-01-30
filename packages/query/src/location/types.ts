/**
 * Root segment representing the entry point of a data location
 */
export interface RootSegment {
  /** Segment type identifier */
  readonly type: 'root'
  /** Root value in format "type:name" */
  readonly value: string
}

/**
 * Property access segment
 */
export interface PropSegment {
  /** Segment type identifier */
  readonly type: 'prop'
  /** Property name */
  readonly value: string
}

/**
 * Array index access segment
 */
export interface IndexSegment {
  /** Segment type identifier */
  readonly type: 'index'
  /** Array index */
  readonly value: number
}

/**
 * Filter condition segment for WHERE-like queries
 */
export interface FilterSegment {
  /** Segment type identifier */
  readonly type: 'filter'
  /** Filter key */
  readonly key: string
  /** Filter value */
  readonly value: string | number
}

/**
 * Union type of all location segment types
 */
export type LocationSegment =
  | RootSegment
  | PropSegment
  | IndexSegment
  | FilterSegment
