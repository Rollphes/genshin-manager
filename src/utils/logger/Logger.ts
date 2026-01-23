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
  public debug(
    message: string,
    data?: string | number | boolean | object,
  ): void {
    if (this.shouldLog(LogLevel.DEBUG)) this.log('DEBUG', message, data)
  }

  /**
   * Log an info message
   * @param message - Info message
   * @param data - Additional data to log
   */
  public info(
    message: string,
    data?: string | number | boolean | object,
  ): void {
    if (this.shouldLog(LogLevel.INFO)) this.log('INFO', message, data)
  }

  /**
   * Log a warning message
   * @param message - Warning message
   * @param data - Additional data to log
   */
  public warn(
    message: string,
    data?: string | number | boolean | object,
  ): void {
    if (this.shouldLog(LogLevel.WARN)) this.log('WARN', message, data)
  }

  /**
   * Log an error message
   * @param message - Error message
   * @param data - Additional data to log
   */
  public error(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) this.log('ERROR', message, data)
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
   * @param levelName - Log level name
   * @param message - Log message
   * @param data - Additional data to log
   */
  private log(levelName: string, message: string, data?: unknown): void {
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
}

/**
 * Singleton logger instance for application-wide logging
 */
export const logger = new Logger()
