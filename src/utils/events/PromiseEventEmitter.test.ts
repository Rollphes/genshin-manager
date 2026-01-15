import { describe, expect, it, vi } from 'vitest'

import { PromiseEventEmitter } from '@/utils/events/PromiseEventEmitter'

// Test implementation of abstract class
interface TestEventMap {
  testEvent: [data: string]
  numEvent: [value: number]
  multiArgs: [a: string, b: number, c: boolean]
}

enum TestEvents {
  TEST_EVENT = 'testEvent',
  NUM_EVENT = 'numEvent',
  MULTI_ARGS = 'multiArgs',
}

class TestEmitter extends PromiseEventEmitter<TestEventMap, TestEvents> {
  public emitTestEvent(data: string): boolean {
    return this.emit(TestEvents.TEST_EVENT, data)
  }

  public emitNumEvent(value: number): boolean {
    return this.emit(TestEvents.NUM_EVENT, value)
  }

  public emitMultiArgs(a: string, b: number, c: boolean): boolean {
    return this.emit(TestEvents.MULTI_ARGS, a, b, c)
  }
}

describe('PromiseEventEmitter', () => {
  describe('on', () => {
    it('should register listener and receive events', () => {
      const emitter = new TestEmitter()
      const listener = vi.fn()
      emitter.on(TestEvents.TEST_EVENT, listener)
      emitter.emitTestEvent('hello')
      expect(listener).toHaveBeenCalledWith('hello')
    })

    it('should call listener multiple times', () => {
      const emitter = new TestEmitter()
      const listener = vi.fn()
      emitter.on(TestEvents.TEST_EVENT, listener)
      emitter.emitTestEvent('first')
      emitter.emitTestEvent('second')
      expect(listener).toHaveBeenCalledTimes(2)
    })

    it('should return this for chaining', () => {
      const emitter = new TestEmitter()
      const result = emitter.on(TestEvents.TEST_EVENT, vi.fn())
      expect(result).toBe(emitter)
    })
  })

  describe('once', () => {
    it('should call listener only once', () => {
      const emitter = new TestEmitter()
      const listener = vi.fn()
      emitter.once(TestEvents.TEST_EVENT, listener)
      emitter.emitTestEvent('first')
      emitter.emitTestEvent('second')
      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith('first')
    })

    it('should return this for chaining', () => {
      const emitter = new TestEmitter()
      const result = emitter.once(TestEvents.TEST_EVENT, vi.fn())
      expect(result).toBe(emitter)
    })
  })

  describe('addListener', () => {
    it('should work same as on', () => {
      const emitter = new TestEmitter()
      const listener = vi.fn()
      emitter.addListener(TestEvents.TEST_EVENT, listener)
      emitter.emitTestEvent('test')
      expect(listener).toHaveBeenCalledWith('test')
    })

    it('should return this for chaining', () => {
      const emitter = new TestEmitter()
      const result = emitter.addListener(TestEvents.TEST_EVENT, vi.fn())
      expect(result).toBe(emitter)
    })
  })

  describe('off', () => {
    it('should remove listener', () => {
      const emitter = new TestEmitter()
      const listener = vi.fn()
      emitter.on(TestEvents.TEST_EVENT, listener)
      emitter.off(TestEvents.TEST_EVENT, listener)
      emitter.emitTestEvent('test')
      expect(listener).not.toHaveBeenCalled()
    })

    it('should return this for chaining', () => {
      const emitter = new TestEmitter()
      const listener = vi.fn()
      const result = emitter.off(TestEvents.TEST_EVENT, listener)
      expect(result).toBe(emitter)
    })
  })

  describe('removeListener', () => {
    it('should remove listener', () => {
      const emitter = new TestEmitter()
      const listener = vi.fn()
      emitter.on(TestEvents.TEST_EVENT, listener)
      emitter.removeListener(TestEvents.TEST_EVENT, listener)
      emitter.emitTestEvent('test')
      expect(listener).not.toHaveBeenCalled()
    })

    it('should return this for chaining', () => {
      const emitter = new TestEmitter()
      const listener = vi.fn()
      const result = emitter.removeListener(TestEvents.TEST_EVENT, listener)
      expect(result).toBe(emitter)
    })
  })

  describe('removeAllListeners', () => {
    it('should remove all listeners for specific event', () => {
      const emitter = new TestEmitter()
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      emitter.on(TestEvents.TEST_EVENT, listener1)
      emitter.on(TestEvents.TEST_EVENT, listener2)
      emitter.removeAllListeners(TestEvents.TEST_EVENT)
      emitter.emitTestEvent('test')
      expect(listener1).not.toHaveBeenCalled()
      expect(listener2).not.toHaveBeenCalled()
    })

    it('should return this for chaining', () => {
      const emitter = new TestEmitter()
      const result = emitter.removeAllListeners()
      expect(result).toBe(emitter)
    })
  })

  describe('emit', () => {
    it('should return true when listeners exist', () => {
      const emitter = new TestEmitter()
      emitter.on(TestEvents.TEST_EVENT, vi.fn())
      const result = emitter.emitTestEvent('test')
      expect(result).toBe(true)
    })

    it('should return false when no listeners', () => {
      const emitter = new TestEmitter()
      const result = emitter.emitTestEvent('test')
      expect(result).toBe(false)
    })

    it('should pass multiple arguments to listener', () => {
      const emitter = new TestEmitter()
      const listener = vi.fn()
      emitter.on(TestEvents.MULTI_ARGS, listener)
      emitter.emitMultiArgs('str', 42, true)
      expect(listener).toHaveBeenCalledWith('str', 42, true)
    })
  })

  describe('async listener support', () => {
    it('should support async listeners', async () => {
      const emitter = new TestEmitter()
      let resolved = false
      emitter.on(TestEvents.TEST_EVENT, async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        resolved = true
      })
      emitter.emitTestEvent('test')
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(resolved).toBe(true)
    })
  })

  describe('multiple listeners', () => {
    it('should call multiple listeners in order', () => {
      const emitter = new TestEmitter()
      const order: number[] = []
      emitter.on(TestEvents.TEST_EVENT, () => order.push(1))
      emitter.on(TestEvents.TEST_EVENT, () => order.push(2))
      emitter.on(TestEvents.TEST_EVENT, () => order.push(3))
      emitter.emitTestEvent('test')
      expect(order).toEqual([1, 2, 3])
    })
  })
})
