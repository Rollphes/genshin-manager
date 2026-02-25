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
 * Loggable data type
 */
type LogData = Error | string

/**
 * Log level configuration options
 */
interface LoggerOptions {
  /**
   * Current log level threshold
   * @default LogLevel.NONE
   */
  readonly level?: LogLevel
}

/**
 * Unified logging system with log4js-style level management
 * Provides consistent logging across the entire codebase
 */
export class Logger {
  private currentLevel: LogLevel = LogLevel.NONE

  /**
   * Configure the logger with new options
   * @param options - Logger configuration options
   */
  public configure(options: LoggerOptions): void {
    this.currentLevel = options.level ?? LogLevel.NONE
  }

  /**
   * Log a debug message
   * @param message - Debug message
   * @param data - Additional data to log
   */
  public debug(message: string, data?: LogData): void {
    if (this.shouldLog(LogLevel.DEBUG))
      this.log(LogLevel.DEBUG, 'DEBUG', message, data)
  }

  /**
   * Log an info message
   * @param message - Info message
   * @param data - Additional data to log
   */
  public info(message: string, data?: LogData): void {
    if (this.shouldLog(LogLevel.INFO))
      this.log(LogLevel.INFO, 'INFO', message, data)
  }

  /**
   * Log a warning message
   * @param message - Warning message
   * @param data - Additional data to log
   */
  public warn(message: string, data?: LogData): void {
    if (this.shouldLog(LogLevel.WARN))
      this.log(LogLevel.WARN, 'WARN', message, data)
  }

  /**
   * Log an error message
   * @param message - Error message
   * @param data - Additional data to log
   */
  public error(message: string, data?: LogData): void {
    if (this.shouldLog(LogLevel.ERROR))
      this.log(LogLevel.ERROR, 'ERROR', message, data)
  }

  /**
   * Check if a given log level should be logged
   * @param level - Log level to check
   * @returns whether the level should be logged
   */
  public shouldLog(level: LogLevel): boolean {
    return level <= this.currentLevel
  }

  /**
   * Internal logging method
   * @param level - Log level
   * @param levelName - Log level name
   * @param message - Log message
   * @param data - Additional data to log
   */
  private log(
    level: LogLevel,
    levelName: string,
    message: string,
    data?: LogData,
  ): void {
    const timestamp = new Date().toISOString()
    const formattedMessage = `[${timestamp}] [${levelName}] ${message}`
    const logFn = level <= LogLevel.WARN ? console.error : console.log

    if (data !== undefined) {
      const dataString =
        typeof data === 'string' ? data : (data.stack ?? data.toString())
      logFn(formattedMessage, dataString)
    } else {
      logFn(formattedMessage)
    }
  }
}

/**
 * Singleton logger instance for application-wide logging
 */
export const logger = new Logger()
