import type { QueryLocation } from '@/location/QueryLocation'
import { LocatedValue } from '@/value/LocatedValue'
import type { TextMapProvider } from '@/value/types'

/**
 * Element type for array items
 * If T is a primitive (string, number, boolean, null, undefined), returns LocatedValue<T>
 * If T is an array, returns LocatedArray<U> where U is the element type
 * If T is an object, each property is wrapped in LocatedValue/LocatedArray
 */
export type LocatedElement<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  ? LocatedValue<T>
  : T extends readonly (infer U)[]
    ? LocatedArray<U>
    : {
        [K in keyof T]: T[K] extends readonly (infer U)[]
          ? LocatedArray<U>
          : LocatedValue<T[K]>
      }

/**
 * An array wrapper that tracks location information for each element
 * Provides array methods that wrap elements with location tracking
 * @template T - The type of array elements
 */
export class LocatedArray<T> {
  /** The wrapped array */
  public readonly value: readonly T[]

  /** Location path for error messages */
  public readonly location: QueryLocation

  private readonly textMapProvider?: TextMapProvider

  /**
   * Creates a new LocatedArray
   * @param value - The array to wrap
   * @param location - The location path
   * @param textMapProvider - Optional TextMap provider for text lookups
   */
  constructor(
    value: readonly T[],
    location: QueryLocation,
    textMapProvider?: TextMapProvider,
  ) {
    this.value = value
    this.location = location
    this.textMapProvider = textMapProvider
  }

  /**
   * Gets the length of the array
   */
  public get length(): number {
    return this.value.length
  }

  /**
   * Maps each element with location tracking
   * @param fn - The mapping function receiving a located element and index
   * @returns Array of mapped values
   */
  public map<R>(fn: (item: LocatedElement<T>, index: number) => R): R[] {
    return this.value.map((item, index) => {
      const itemLocation = this.location.index(index)
      const locatedItem = this.wrapElement(item, itemLocation)
      return fn(locatedItem, index)
    })
  }

  /**
   * Filters elements with location tracking
   * @param fn - The filter function receiving a located element and index
   * @returns A new LocatedArray with filtered elements
   */
  public filter(
    fn: (item: LocatedElement<T>, index: number) => boolean,
  ): LocatedArray<T> {
    const filtered = this.value.filter((item, index) => {
      const itemLocation = this.location.index(index)
      const locatedItem = this.wrapElement(item, itemLocation)
      return fn(locatedItem, index)
    })
    return new LocatedArray(filtered, this.location, this.textMapProvider)
  }

  /**
   * Finds an element with location tracking
   * @param fn - The find function receiving a located element and index
   * @returns The located element or undefined
   */
  public find(
    fn: (item: LocatedElement<T>, index: number) => boolean,
  ): LocatedElement<T> | undefined {
    const index = this.value.findIndex((item, i) => {
      const itemLocation = this.location.index(i)
      const locatedItem = this.wrapElement(item, itemLocation)
      return fn(locatedItem, i)
    })

    if (index === -1) return undefined

    const itemLocation = this.location.index(index)
    return this.wrapElement(this.value[index], itemLocation)
  }

  /**
   * Gets an element at index with location tracking
   * @param index - The array index
   * @returns The located element or undefined if out of bounds
   */
  public at(index: number): LocatedElement<T> | undefined {
    const item = this.value[index]
    if (item === undefined) return undefined

    const itemLocation = this.location.index(index)
    return this.wrapElement(item, itemLocation)
  }

  /**
   * Checks if any element matches the predicate
   * @param fn - The predicate function
   * @returns True if any element matches
   */
  public some(
    fn: (item: LocatedElement<T>, index: number) => boolean,
  ): boolean {
    return this.value.some((item, index) => {
      const itemLocation = this.location.index(index)
      const locatedItem = this.wrapElement(item, itemLocation)
      return fn(locatedItem, index)
    })
  }

  /**
   * Checks if all elements match the predicate
   * @param fn - The predicate function
   * @returns True if all elements match
   */
  public every(
    fn: (item: LocatedElement<T>, index: number) => boolean,
  ): boolean {
    return this.value.every((item, index) => {
      const itemLocation = this.location.index(index)
      const locatedItem = this.wrapElement(item, itemLocation)
      return fn(locatedItem, index)
    })
  }

  /**
   * Gets a copy of the raw array
   * @returns A shallow copy of the wrapped array
   */
  public toArray(): T[] {
    return [...this.value]
  }

  /**
   * Wraps an element with location tracking
   * @param item - The item to wrap
   * @param itemLocation - The item's location
   * @returns A located element
   */
  private wrapElement(item: T, itemLocation: QueryLocation): LocatedElement<T> {
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      // Object: wrap each property with LocatedValue/LocatedArray
      const wrapped: Record<string, unknown> = {}
      for (const [key, val] of Object.entries(item)) {
        const propLocation = itemLocation.prop(key)
        if (Array.isArray(val)) {
          wrapped[key] = new LocatedArray(
            val as unknown[],
            propLocation,
            this.textMapProvider,
          )
        } else {
          wrapped[key] = new LocatedValue(
            val,
            propLocation,
            this.textMapProvider,
          )
        }
      }
      return wrapped as LocatedElement<T>
    }
    // Primitive or array: wrap as LocatedValue
    return new LocatedValue(
      item,
      itemLocation,
      this.textMapProvider,
    ) as LocatedElement<T>
  }
}
