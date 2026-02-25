import { logger } from '@/logger/Logger'

/**
 * Type for values that can be awaited
 */
type Awaitable<Value> = PromiseLike<Value> | Value

/**
 * Extract listener type from event map
 */
type ListenerOf<T, K extends keyof T> = T[K] extends unknown[]
  ? (...args: T[K]) => Awaitable<void>
  : never

/**
 * Internal listener entry with once flag
 */
interface ListenerEntry<T, K extends keyof T> {
  readonly listener: ListenerOf<T, K>
  readonly once: boolean
}

/**
 * Class for supporting asynchronous event listeners.
 * Properly handles errors from async listeners by logging them.
 * Type-safe implementation without Node.js EventEmitter dependency.
 */
export abstract class PromiseEventEmitter<
  T extends { [K in keyof T]: unknown[] },
> {
  /** Map of event names to listener entries */
  private readonly listeners = new Map<keyof T, ListenerEntry<T, keyof T>[]>()

  /**
   * Adds a one-time listener function for the event named eventName.
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public once<K extends keyof T>(
    eventName: K,
    listener: ListenerOf<T, K>,
  ): this {
    return this.addListenerInternal(eventName, listener, true)
  }

  /**
   * Adds the listener function to the end of the listeners array.
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public on<K extends keyof T>(eventName: K, listener: ListenerOf<T, K>): this {
    return this.addListener(eventName, listener)
  }

  /**
   * Alias for on(eventName, listener).
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public addListener<K extends keyof T>(
    eventName: K,
    listener: ListenerOf<T, K>,
  ): this {
    return this.addListenerInternal(eventName, listener, false)
  }

  /**
   * Alias for removeListener().
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public off<K extends keyof T>(
    eventName: K,
    listener: ListenerOf<T, K>,
  ): this {
    return this.removeListener(eventName, listener)
  }

  /**
   * Removes the specified listener from the listener array.
   * @param eventName - The name of the event
   * @param listener - The callback function (supports async)
   * @returns this
   */
  public removeListener<K extends keyof T>(
    eventName: K,
    listener: ListenerOf<T, K>,
  ): this {
    const entries = this.listeners.get(eventName)
    if (!entries) return this

    const index = entries.findIndex((entry) => entry.listener === listener)
    if (index !== -1) {
      entries.splice(index, 1)
      if (entries.length === 0) this.listeners.delete(eventName)
    }
    return this
  }

  /**
   * Removes all listeners, or those of the specified eventName.
   * @param event - The name of the event
   * @returns this
   */
  public removeAllListeners(event?: keyof T): this {
    if (event !== undefined) this.listeners.delete(event)
    else this.listeners.clear()

    return this
  }

  /**
   * Synchronously calls each of the listeners registered for the event.
   * @param eventName - The name of the event
   * @param args - Arguments to pass to the listeners
   * @returns True if the event had listeners, false otherwise
   */
  protected emit<K extends keyof T>(eventName: K, ...args: T[K]): boolean {
    const entries = this.listeners.get(eventName)
    if (!entries || entries.length === 0) return false

    // Copy to avoid mutation during iteration
    const toCall = [...entries]

    // Remove once listeners before calling
    const onceIndices: number[] = []
    toCall.forEach((entry, i) => {
      if (entry.once) onceIndices.push(i)
    })
    // Remove in reverse order to preserve indices
    for (let i = onceIndices.length - 1; i >= 0; i--)
      entries.splice(onceIndices[i], 1)

    if (entries.length === 0) this.listeners.delete(eventName)

    // Call listeners
    for (const entry of toCall)
      this.invokeListener(eventName, entry.listener, args)

    return true
  }

  /**
   * Internal method to add a listener
   * @param eventName - The name of the event
   * @param listener - The callback function
   * @param once - Whether to remove after first call
   * @returns this
   */
  private addListenerInternal<K extends keyof T>(
    eventName: K,
    listener: ListenerOf<T, K>,
    once: boolean,
  ): this {
    let entries = this.listeners.get(eventName)
    if (!entries) {
      entries = []
      this.listeners.set(eventName, entries)
    }
    entries.push({ listener, once } as ListenerEntry<T, keyof T>)
    return this
  }

  /**
   * Invoke a listener with error handling for async listeners
   * @param eventName - Event name for error logging
   * @param listener - Listener function to invoke
   * @param args - Arguments to pass
   */
  private invokeListener<K extends keyof T>(
    eventName: K,
    listener: ListenerOf<T, K>,
    args: T[K],
  ): void {
    try {
      const result = listener(...args)
      // Handle async listeners - catch rejected promises
      if (result && typeof result === 'object' && 'then' in result) {
        result.then(undefined, (error: unknown) => {
          logger.error(
            `Unhandled error in async event listener for "${String(eventName)}"`,
            error instanceof Error ? error : new Error(String(error)),
          )
        })
      }
    } catch (error) {
      // Handle sync errors
      logger.error(
        `Unhandled error in event listener for "${String(eventName)}"`,
        error instanceof Error ? error : new Error(String(error)),
      )
    }
  }
}
