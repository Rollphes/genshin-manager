import { EventEmitter } from 'events'

/**
 * Type for values that can be awaited
 */
type Awaitable<Value> = PromiseLike<Value> | Value

/**
 * Class for supporting asynchronous event listeners.
 * @see EventEmitter
 */
export abstract class PromiseEventEmitter<T> {
  private readonly emitter: EventEmitter

  /**
   * Create a PromiseEventEmitter.
   * @example
   * ```ts
   * class MyEmitter extends PromiseEventEmitter<{test: [string]}> {}
   * const emitter = new MyEmitter()
   * emitter.on('test', async (data) => console.log(data))
   * ```
   */
  constructor() {
    this.emitter = new EventEmitter()
  }

  /**
   * Adds a **one-time**`listener` function for the event named `eventName`. The next time `eventName` is triggered, this listener is removed and then invoked.
   * @param eventName - the name of the event.
   * @param listener - the callback function. (supports async)
   * @see EventEmitter.once()
   */
  public once<K extends keyof T>(
    eventName: K,
    listener: T[K] extends unknown[]
      ? (...args: T[K]) => Awaitable<void>
      : never,
  ): this {
    this.emitter.once(eventName as string, listener as never)
    return this
  }

  /**
   * Adds the `listener` function to the end of the listeners array for the event named `eventName`.
   * No checks are made to see if the `listener` has already been added.
   * Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple times.
   * @param eventName - the name of the event.
   * @param listener - the callback function. (supports async)
   * @see EventEmitter.on()
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
   * Alias for `emitter.on(eventName, listener)`.
   * @param eventName - the name of the event.
   * @param listener - the callback function. (supports async)
   * @see EventEmitter.addListener()
   */
  public addListener<K extends keyof T>(
    eventName: K,
    listener: T[K] extends unknown[]
      ? (...args: T[K]) => Awaitable<void>
      : never,
  ): this {
    this.emitter.addListener(eventName as string, listener as never)
    return this
  }

  /**
   * Alias for `emitter.removeListener()`.
   * @param eventName - the name of the event.
   * @param listener - the callback function. (supports async)
   * @see EventEmitter.off()
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
   * Removes the specified `listener` from the listener array for the event named`eventName`.
   * @param eventName - the name of the event.
   * @param listener - the callback function. (supports async)
   * @see EventEmitter.removeListener()
   */
  public removeListener<K extends keyof T>(
    eventName: K,
    listener: T[K] extends unknown[]
      ? (...args: T[K]) => Awaitable<void>
      : never,
  ): this {
    this.emitter.removeListener(eventName as string, listener as never)
    return this
  }

  /**
   * Removes all listeners, or those of the specified `eventName`.
   * @param event - the name of the event.
   * @see EventEmitter.removeAllListeners()
   */
  public removeAllListeners(event?: keyof T): this {
    this.emitter.removeAllListeners(event as string)
    return this
  }

  /**
   * Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments to each.
   * Returns `true` if the event had listeners, `false` otherwise.
   * @param eventName - the name of the event.
   * @param args - arguments to pass to the listeners.
   * @see EventEmitter.emit()
   */
  protected emit<K extends keyof T>(
    eventName: K,
    ...args: T[K] extends unknown[] ? T[K] : never
  ): boolean {
    return this.emitter.emit(eventName as string, ...args)
  }
}
