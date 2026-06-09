// @ts-check
import winston from 'winston'
import fs from 'fs'

let logger_instance = null

/**
 * WINSTON logger class
 * @class LoggerService
 */
class LoggerService {
  /**
   * The cached singleton instance.
   * @type {LoggerService|null}
   */
  static #instance = null

  /**
   * Build out out logger class
   * @param {string} context - the string describing this logger
   * @returns
   * @hideconstructor
   */
  constructor(context) {
    // Only one instance is allowed so point to that instance
    if (LoggerService.#instance == null) {
      LoggerService.#instance = this
    }

    /** @type {string} */
    this.context = context

    // Clear log files
    try {
      if (fs.existsSync('./logs/error.json')) {
        fs.unlinkSync('./logs/error.json')
      }
      if (fs.existsSync('./logs/combined.json')) {
        fs.unlinkSync('./logs/combined.json')
      }
    } catch (err) {
      // Force-cast 'err' by wrapping it in parentheses like this:
      const error = /** @type {Error} */ (err)
      console.error('Error clearing log files:', error.message)
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'silly',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf((info) => `${info.level}: ${info.message}`)
          ),
        }),
        new winston.transports.File({
          filename: './logs/error.json',
          level: 'error',
          format: winston.format.printf((info) => JSON.stringify(info)),
        }),
        new winston.transports.File({
          filename: './logs/combined.json',
          format: winston.format.printf((info) => {
            const { level, message, ...metadata } = info
            return JSON.stringify({ level, message, ...metadata })
          }),
        }),
      ],
    })
    return LoggerService.#instance
  }

  /**
   * log a message where we specify the level
   * @param {string} level
   * @param {*} message
   * @param {Record<string, any>} [meta] - Optional metadata object.
   */
  log(level, message, meta) {
    if (typeof message === 'object') {
      const summary =
        message.message || `Object keys: [${Object.keys(message).join(', ')}]`
      this.logger.log(level, summary, { ...message, ...meta })
    } else {
      this.logger.log(level, message, meta)
    }
  }

  /**
   * log an informational message
   * @param {*} message
   * @param {Record<string, any>} [meta] - Optional metadata object.
   */
  info(message, meta) {
    this.log('info', message, meta)
  }

  /**
   * log an error message
   * @param {*} message
   * @param {Record<string, any>} [meta] - Optional metadata object.
   */
  error(message, meta) {
    this.log('error', message, meta)
  }

  /**
   * log a warning message
   * @param {*} message
   * @param {Record<string, any>} [meta] - Optional metadata object.
   */
  warn(message, meta) {
    this.log('warn', message, meta)
  }

  /**
   * log a debug message
   * @param {*} message
   * @param {Record<string, any>} [meta] - Optional metadata object.
   */
  debug(message, meta) {
    this.log('debug', message, meta)
  }

  /**
   * log a silly message
   * @param {*} message
   * @param {Record<string, any>} [meta] - Optional metadata object.
   */
  silly(message, meta) {
    this.log('silly', message, meta)
  }
}

const logger = new LoggerService('app-service')
Object.freeze(logger)
export default logger
