import { EventEmitter } from 'events'

/**
 * Type for event map.
 */
export type EventMap<T> = Record<keyof T, unknown[]> | DefaultEventMap
/**
 * Default event map type
 */
export type DefaultEventMap = [never]

/**
 * Key type for event handling
 */
export type Key<K, E, T> = T extends DefaultEventMap
  ? string | symbol
  : (K | E) | keyof T
/**
 * Rest arguments type
 */
export type AnyRest = [...args: unknown[]]
/**
 * Arguments type for events
 */
export type Args<K, T> = T extends DefaultEventMap
  ? AnyRest
  : K extends keyof T
    ? T[K]
    : never
/**
 * Event listener type
 */
export type Listener<K, T, R> = T extends DefaultEventMap
  ? (...args: unknown[]) => R
  : K extends keyof T
    ? T[K] extends unknown[]
      ? (...args: T[K]) => R
      : never
    : never
/**
 * Type for event listener.
 */
export type Listener1<K, T> = Listener<K, T, Awaitable<void>>
/**
 * Synchronous event listener type
 */
export type Listener2<K, T> = Listener<K, T, void>

/**
 * Type for values that can be awaited
 */
export type Awaitable<Value> = PromiseLike<Value> | Value

/**
 * Class for supporting asynchronous event listeners.
 * @see EventEmitter
 */
export abstract class PromiseEventEmitter<
  T extends EventMap<T>,
  E extends keyof T,
> {
  private readonly emitter: EventEmitter<T>

  /**
   * Create a PromiseEventEmitter.
   * @example
   * ```ts
   * class MyEmitter extends PromiseEventEmitter<{test: [string]}, 'test'> {}
   * const emitter = new MyEmitter()
   * emitter.on('test', async (data) => console.log(data))
   * ```
   */
  constructor() {
    this.emitter = new EventEmitter()
  }

  /**
   * Adds a **one-time**`listener` function for the event named `eventName`. The next time `eventName` is triggered, this listener is removed and then invoked.
   * @param eventName the name of the event.
   * @param listener the callback function. (supports async)
   * @see EventEmitter.once()
   */
  public once<K>(eventName: Key<K, E, T>, listener: Listener1<K, T>): this {
    this.emitter.once<K>(eventName, listener as Listener2<K, T>)
    return this
  }

  /**
   * Adds the `listener` function to the end of the listeners array for the event named `eventName`.
   * No checks are made to see if the `listener` has already been added.
   * Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple times.
   * @param eventName the name of the event.
   * @param listener the callback function. (supports async)
   * @see EventEmitter.on()
   */
  public on<K>(eventName: Key<K, E, T>, listener: Listener1<K, T>): this {
    this.addListener(eventName, listener)
    return this
  }

  /**
   * Alias for `emitter.on(eventName, listener)`.
   * @param eventName the name of the event.
   * @param listener the callback function. (supports async)
   * @see EventEmitter.addListener()
   */
  public addListener<K>(
    eventName: Key<K, E, T>,
    listener: Listener1<K, T>,
  ): this {
    this.emitter.addListener(eventName, listener as Listener2<K, T>)
    return this
  }

  /**
   * Alias for `emitter.removeListener()`.
   * @param eventName the name of the event.
   * @param listener the callback function. (supports async)
   * @see EventEmitter.off()
   */
  public off<K>(eventName: Key<K, E, T>, listener: Listener1<K, T>): this {
    this.removeListener(eventName, listener)
    return this
  }

  /**
   * Removes the specified `listener` from the listener array for the event named`eventName`.
   * @param eventName the name of the event.
   * @param listener the callback function. (supports async)
   * @see EventEmitter.removeListener()
   */
  public removeListener<K>(
    eventName: Key<K, E, T>,
    listener: Listener1<K, T>,
  ): this {
    this.emitter.removeListener(eventName, listener as Listener2<K, T>)
    return this
  }

  /**
   * Removes all listeners, or those of the specified `eventName`.
   * @param event the name of the event.
   * @see EventEmitter.removeAllListeners()
   */
  public removeAllListeners<K>(event?: Key<K, E, T>): this {
    this.emitter.removeAllListeners(event)
    return this
  }

  /**
   * Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments to each.
   * Returns `true` if the event had listeners, `false` otherwise.
   * @param eventName the name of the event.
   * @param args arguments to pass to the listeners.
   * @see EventEmitter.emit()
   */
  protected emit<K>(eventName: Key<K, E, T>, ...args: Args<K, T>): boolean {
    return this.emitter.emit<K>(eventName, ...args)
  }
}
