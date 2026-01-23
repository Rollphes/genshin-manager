import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Logger, logger, LogLevel } from '@/infrastructure/logger/Logger'

describe('Logger', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())

  beforeEach(() => {
    consoleSpy.mockClear()
    logger.configure({ level: LogLevel.NONE })
  })

  afterEach(() => {
    logger.configure({ level: LogLevel.NONE })
  })

  describe('LogLevel', () => {
    it('should have correct values', () => {
      expect(LogLevel.NONE).toBe(0)
      expect(LogLevel.ERROR).toBe(1)
      expect(LogLevel.WARN).toBe(2)
      expect(LogLevel.INFO).toBe(3)
      expect(LogLevel.DEBUG).toBe(4)
    })
  })

  describe('configure', () => {
    it('should set log level', () => {
      logger.configure({ level: LogLevel.DEBUG })
      expect(logger.shouldLog(LogLevel.DEBUG)).toBe(true)
    })

    it('should default to NONE when level is not provided', () => {
      logger.configure({ level: LogLevel.DEBUG })
      logger.configure({})
      expect(logger.shouldLog(LogLevel.ERROR)).toBe(false)
    })
  })

  describe('shouldLog', () => {
    it('should return false when level is NONE', () => {
      logger.configure({ level: LogLevel.NONE })
      expect(logger.shouldLog(LogLevel.ERROR)).toBe(false)
      expect(logger.shouldLog(LogLevel.WARN)).toBe(false)
      expect(logger.shouldLog(LogLevel.INFO)).toBe(false)
      expect(logger.shouldLog(LogLevel.DEBUG)).toBe(false)
    })

    it('should return true for ERROR when level is ERROR', () => {
      logger.configure({ level: LogLevel.ERROR })
      expect(logger.shouldLog(LogLevel.ERROR)).toBe(true)
      expect(logger.shouldLog(LogLevel.WARN)).toBe(false)
      expect(logger.shouldLog(LogLevel.INFO)).toBe(false)
      expect(logger.shouldLog(LogLevel.DEBUG)).toBe(false)
    })

    it('should return true for ERROR and WARN when level is WARN', () => {
      logger.configure({ level: LogLevel.WARN })
      expect(logger.shouldLog(LogLevel.ERROR)).toBe(true)
      expect(logger.shouldLog(LogLevel.WARN)).toBe(true)
      expect(logger.shouldLog(LogLevel.INFO)).toBe(false)
      expect(logger.shouldLog(LogLevel.DEBUG)).toBe(false)
    })

    it('should return true for ERROR, WARN, INFO when level is INFO', () => {
      logger.configure({ level: LogLevel.INFO })
      expect(logger.shouldLog(LogLevel.ERROR)).toBe(true)
      expect(logger.shouldLog(LogLevel.WARN)).toBe(true)
      expect(logger.shouldLog(LogLevel.INFO)).toBe(true)
      expect(logger.shouldLog(LogLevel.DEBUG)).toBe(false)
    })

    it('should return true for all levels when level is DEBUG', () => {
      logger.configure({ level: LogLevel.DEBUG })
      expect(logger.shouldLog(LogLevel.ERROR)).toBe(true)
      expect(logger.shouldLog(LogLevel.WARN)).toBe(true)
      expect(logger.shouldLog(LogLevel.INFO)).toBe(true)
      expect(logger.shouldLog(LogLevel.DEBUG)).toBe(true)
    })
  })

  describe('debug', () => {
    it('should not log when level is below DEBUG', () => {
      logger.configure({ level: LogLevel.INFO })
      logger.debug('test message')
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should log when level is DEBUG', () => {
      logger.configure({ level: LogLevel.DEBUG })
      logger.debug('test message')
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should include data when provided', () => {
      logger.configure({ level: LogLevel.DEBUG })
      logger.debug('test message', { key: 'value' })
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        expect.stringContaining('"key"'),
      )
    })
  })

  describe('info', () => {
    it('should not log when level is below INFO', () => {
      logger.configure({ level: LogLevel.WARN })
      logger.info('test message')
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should log when level is INFO', () => {
      logger.configure({ level: LogLevel.INFO })
      logger.info('test message')
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('should not log when level is below WARN', () => {
      logger.configure({ level: LogLevel.ERROR })
      logger.warn('test message')
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should log when level is WARN', () => {
      logger.configure({ level: LogLevel.WARN })
      logger.warn('test message')
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('error', () => {
    it('should not log when level is NONE', () => {
      logger.configure({ level: LogLevel.NONE })
      logger.error('test message')
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should log when level is ERROR', () => {
      logger.configure({ level: LogLevel.ERROR })
      logger.error('test message')
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should handle unknown data type', () => {
      logger.configure({ level: LogLevel.ERROR })
      logger.error('test message', new Error('error'))
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('Logger class', () => {
    it('should be instantiable', () => {
      const customLogger = new Logger()
      expect(customLogger).toBeInstanceOf(Logger)
    })

    it('should maintain independent state per instance', () => {
      const logger1 = new Logger()
      const logger2 = new Logger()
      logger1.configure({ level: LogLevel.DEBUG })
      logger2.configure({ level: LogLevel.NONE })
      expect(logger1.shouldLog(LogLevel.DEBUG)).toBe(true)
      expect(logger2.shouldLog(LogLevel.DEBUG)).toBe(false)
    })
  })

  describe('logger singleton', () => {
    it('should have all methods', () => {
      expect(typeof logger.configure).toBe('function')
      expect(typeof logger.debug).toBe('function')
      expect(typeof logger.info).toBe('function')
      expect(typeof logger.warn).toBe('function')
      expect(typeof logger.error).toBe('function')
      expect(typeof logger.shouldLog).toBe('function')
    })
  })
})
