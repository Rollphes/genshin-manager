/**
 * Log level enumeration for the unified logging system
 */
export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
}

/**
 * Log level configuration options
 */
export interface LoggerOptions {
  /**
   * Current log level threshold
   * @default LogLevel.NONE
   */
  level?: LogLevel
}

/**
 * Unified logging system with log4js-style level management
 * Provides consistent logging across the entire codebase
 */
let currentLevel: LogLevel = LogLevel.NONE

/**
 * Configure the logger with new options
 * @param options - Logger configuration options
 */
export function configure(options: LoggerOptions): void {
  currentLevel = options.level ?? LogLevel.NONE
}

/**
 * Log a debug message
 * @param message - Debug message
 * @param data - Additional data to log
 */
export function debug(
  message: string,
  data?: string | number | boolean | object,
): void {
  if (shouldLog(LogLevel.DEBUG)) log('DEBUG', message, data)
}

/**
 * Log an info message
 * @param message - Info message
 * @param data - Additional data to log
 */
export function info(
  message: string,
  data?: string | number | boolean | object,
): void {
  if (shouldLog(LogLevel.INFO)) log('INFO', message, data)
}

/**
 * Log a warning message
 * @param message - Warning message
 * @param data - Additional data to log
 */
export function warn(
  message: string,
  data?: string | number | boolean | object,
): void {
  if (shouldLog(LogLevel.WARN)) log('WARN', message, data)
}

/**
 * Log an error message
 * @param message - Error message
 * @param data - Additional data to log
 */
export function error(message: string, data?: unknown): void {
  if (shouldLog(LogLevel.ERROR)) log('ERROR', message, data)
}

/**
 * Check if a given log level should be logged
 * @param level - Log level to check
 * @returns whether the level should be logged
 */
export function shouldLog(level: LogLevel): boolean {
  return level <= currentLevel
}

/**
 * Unified logger object for easy import and use
 */
export const logger = {
  configure,
  debug,
  info,
  warn,
  error,
  shouldLog,
}

/**
 * Internal logging method
 * @param levelName - Log level name
 * @param message - Log message
 * @param data - Additional data to log
 */
export function log(levelName: string, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString()
  const formattedMessage = `[${timestamp}] [${levelName}] ${message}`

  if (data !== undefined) {
    const dataString =
      typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    console.log(formattedMessage, dataString)
  } else {
    console.log(formattedMessage)
  }
}
