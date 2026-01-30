import { EventEmitter } from 'events'

/**
 * Type for values that can be awaited
 */
type Awaitable<Value> = PromiseLike<Value> | Value

/**
 * Class for supporting asynchronous event listeners.
 * @see {@link EventEmitter}
 */
export abstract class PromiseEventEmitter<T> {
  private readonly emitter: EventEmitter

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
    this.emitter.once(eventName as string, listener as never)
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
    this.emitter.addListener(eventName as string, listener as never)
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
    this.emitter.removeListener(eventName as string, listener as never)
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
}
