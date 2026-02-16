import { EventEmitter } from 'events'

import { logger } from '@/logger/Logger'

/**
 * Type for values that can be awaited
 */
type Awaitable<Value> = PromiseLike<Value> | Value

/**
 * Listener function type for internal storage
 */
type ListenerFn = (...args: unknown[]) => Awaitable<void>

/**
 * Class for supporting asynchronous event listeners.
 * Properly handles errors from async listeners by logging them.
 * @see {@link EventEmitter}
 */
export abstract class PromiseEventEmitter<T> {
  private readonly emitter: EventEmitter

  /** Map of original listeners to wrapped listeners for proper removal */
  private readonly listenerWrapperMap = new WeakMap<ListenerFn, ListenerFn>()

  /**
   * Create a PromiseEventEmitter.
   */
  constructor() {
    this.emitter = new EventEmitter()
  }

  /**
   * Adds a one-time listener function for the event named eventName.
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public once<K extends keyof T>(
    eventName: K,
    listener: T[K] extends unknown[]
      ? (...args: T[K]) => Awaitable<void>
      : never,
  ): this {
    // Cast through unknown required due to generic constraint complexity
    const wrapped = this.wrapListener(
      eventName as string,
      listener as unknown as ListenerFn,
    )
    this.emitter.once(eventName as string, wrapped as never)
    return this
  }

  /**
   * Adds the listener function to the end of the listeners array.
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public on<K extends keyof T>(
    eventName: K,
    listener: T[K] extends unknown[]
      ? (...args: T[K]) => Awaitable<void>
      : never,
  ): this {
    this.addListener(eventName, listener)
    return this
  }

  /**
   * Alias for on(eventName, listener).
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public addListener<K extends keyof T>(
    eventName: K,
    listener: T[K] extends unknown[]
      ? (...args: T[K]) => Awaitable<void>
      : never,
  ): this {
    // Cast through unknown required due to generic constraint complexity
    const listenerFn = listener as unknown as ListenerFn
    const wrapped = this.wrapListener(eventName as string, listenerFn)
    this.listenerWrapperMap.set(listenerFn, wrapped)
    this.emitter.addListener(eventName as string, wrapped as never)
    return this
  }

  /**
   * Alias for removeListener().
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public off<K extends keyof T>(
    eventName: K,
    listener: T[K] extends unknown[]
      ? (...args: T[K]) => Awaitable<void>
      : never,
  ): this {
    this.removeListener(eventName, listener)
    return this
  }

  /**
   * Removes the specified listener from the listener array.
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public removeListener<K extends keyof T>(
    eventName: K,
    listener: T[K] extends unknown[]
      ? (...args: T[K]) => Awaitable<void>
      : never,
  ): this {
    // Cast through unknown required due to generic constraint complexity
    const listenerFn = listener as unknown as ListenerFn
    const wrapped = this.listenerWrapperMap.get(listenerFn)
    if (wrapped) {
      this.emitter.removeListener(eventName as string, wrapped as never)
      this.listenerWrapperMap.delete(listenerFn)
    } else {
      this.emitter.removeListener(eventName as string, listener as never)
    }
    return this
  }

  /**
   * Removes all listeners, or those of the specified eventName.
   * @param event - The name of the event
   * @returns this
   */
  public removeAllListeners(event?: keyof T): this {
    this.emitter.removeAllListeners(event as string)
    return this
  }

  /**
   * Synchronously calls each of the listeners registered for the event.
   * @param eventName - The name of the event
   * @param args - Arguments to pass to the listeners
   * @returns True if the event had listeners, false otherwise
   */
  protected emit<K extends keyof T>(
    eventName: K,
    ...args: T[K] extends unknown[] ? T[K] : never
  ): boolean {
    return this.emitter.emit(eventName as string, ...args)
  }

  /**
   * Wrap a listener to catch and log errors from async listeners
   * @param eventName - Event name for error logging
   * @param listener - Original listener function
   * @returns Wrapped listener that catches async errors
   */
  private wrapListener(eventName: string, listener: ListenerFn): ListenerFn {
    return (...args: unknown[]): void => {
      try {
        const result = listener(...args)
        // Handle async listeners - catch rejected promises
        if (result && typeof result === 'object' && 'then' in result) {
          ;(result as Promise<void>).catch((error: unknown) => {
            logger.error(
              `Unhandled error in async event listener for "${eventName}"`,
              error instanceof Error ? error : new Error(String(error)),
            )
          })
        }
      } catch (error) {
        // Handle sync errors
        logger.error(
          `Unhandled error in event listener for "${eventName}"`,
          error instanceof Error ? error : new Error(String(error)),
        )
      }
    }
  }
}
