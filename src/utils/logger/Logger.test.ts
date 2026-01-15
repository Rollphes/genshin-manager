import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  configure,
  debug,
  error,
  info,
  log,
  logger,
  LogLevel,
  shouldLog,
  warn,
} from '@/utils/logger/Logger'

describe('Logger', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())

  beforeEach(() => {
    consoleSpy.mockClear()
    configure({ level: LogLevel.NONE })
  })

  afterEach(() => {
    configure({ level: LogLevel.NONE })
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
      configure({ level: LogLevel.DEBUG })
      expect(shouldLog(LogLevel.DEBUG)).toBe(true)
    })

    it('should default to NONE when level is not provided', () => {
      configure({ level: LogLevel.DEBUG })
      configure({})
      expect(shouldLog(LogLevel.ERROR)).toBe(false)
    })
  })

  describe('shouldLog', () => {
    it('should return false when level is NONE', () => {
      configure({ level: LogLevel.NONE })
      expect(shouldLog(LogLevel.ERROR)).toBe(false)
      expect(shouldLog(LogLevel.WARN)).toBe(false)
      expect(shouldLog(LogLevel.INFO)).toBe(false)
      expect(shouldLog(LogLevel.DEBUG)).toBe(false)
    })

    it('should return true for ERROR when level is ERROR', () => {
      configure({ level: LogLevel.ERROR })
      expect(shouldLog(LogLevel.ERROR)).toBe(true)
      expect(shouldLog(LogLevel.WARN)).toBe(false)
      expect(shouldLog(LogLevel.INFO)).toBe(false)
      expect(shouldLog(LogLevel.DEBUG)).toBe(false)
    })

    it('should return true for ERROR and WARN when level is WARN', () => {
      configure({ level: LogLevel.WARN })
      expect(shouldLog(LogLevel.ERROR)).toBe(true)
      expect(shouldLog(LogLevel.WARN)).toBe(true)
      expect(shouldLog(LogLevel.INFO)).toBe(false)
      expect(shouldLog(LogLevel.DEBUG)).toBe(false)
    })

    it('should return true for ERROR, WARN, INFO when level is INFO', () => {
      configure({ level: LogLevel.INFO })
      expect(shouldLog(LogLevel.ERROR)).toBe(true)
      expect(shouldLog(LogLevel.WARN)).toBe(true)
      expect(shouldLog(LogLevel.INFO)).toBe(true)
      expect(shouldLog(LogLevel.DEBUG)).toBe(false)
    })

    it('should return true for all levels when level is DEBUG', () => {
      configure({ level: LogLevel.DEBUG })
      expect(shouldLog(LogLevel.ERROR)).toBe(true)
      expect(shouldLog(LogLevel.WARN)).toBe(true)
      expect(shouldLog(LogLevel.INFO)).toBe(true)
      expect(shouldLog(LogLevel.DEBUG)).toBe(true)
    })
  })

  describe('debug', () => {
    it('should not log when level is below DEBUG', () => {
      configure({ level: LogLevel.INFO })
      debug('test message')
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should log when level is DEBUG', () => {
      configure({ level: LogLevel.DEBUG })
      debug('test message')
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should include data when provided', () => {
      configure({ level: LogLevel.DEBUG })
      debug('test message', { key: 'value' })
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        expect.stringContaining('"key"'),
      )
    })
  })

  describe('info', () => {
    it('should not log when level is below INFO', () => {
      configure({ level: LogLevel.WARN })
      info('test message')
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should log when level is INFO', () => {
      configure({ level: LogLevel.INFO })
      info('test message')
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('should not log when level is below WARN', () => {
      configure({ level: LogLevel.ERROR })
      warn('test message')
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should log when level is WARN', () => {
      configure({ level: LogLevel.WARN })
      warn('test message')
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('error', () => {
    it('should not log when level is NONE', () => {
      configure({ level: LogLevel.NONE })
      error('test message')
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should log when level is ERROR', () => {
      configure({ level: LogLevel.ERROR })
      error('test message')
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should handle unknown data type', () => {
      configure({ level: LogLevel.ERROR })
      error('test message', new Error('error'))
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('log', () => {
    it('should format message with timestamp and level', () => {
      log('TEST', 'message')
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T.*\] \[TEST\] message/),
      )
    })

    it('should log message without data', () => {
      log('INFO', 'simple message')
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] simple message'),
      )
    })

    it('should log message with string data', () => {
      log('INFO', 'message', 'string data')
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] message'),
        'string data',
      )
    })

    it('should log message with object data as JSON', () => {
      log('INFO', 'message', { key: 'value' })
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] message'),
        expect.stringContaining('"key": "value"'),
      )
    })

    it('should log message with number data', () => {
      log('INFO', 'message', 42)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] message'),
        '42',
      )
    })

    it('should log message with boolean data', () => {
      log('INFO', 'message', true)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] message'),
        'true',
      )
    })
  })

  describe('logger object', () => {
    it('should have all methods', () => {
      expect(logger.configure).toBe(configure)
      expect(logger.debug).toBe(debug)
      expect(logger.info).toBe(info)
      expect(logger.warn).toBe(warn)
      expect(logger.error).toBe(error)
      expect(logger.shouldLog).toBe(shouldLog)
    })
  })
})
