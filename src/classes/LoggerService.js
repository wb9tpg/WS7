import winston from 'winston'
import fs from 'fs'

let logger_instance = null

class LoggerService {
  constructor(context) {
    // Only one instance is allowed so point to that instance
    if (LoggerService.instance == null) {
      console.log('creating logger instance')
      LoggerService.instance = this
    }

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
      console.error('Error clearing log files:', err)
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
    return LoggerService.instance
  }

  log(level, message, meta) {
    if (typeof message === 'object') {
      const summary =
        message.message || `Object keys: [${Object.keys(message).join(', ')}]`
      this.logger.log(level, summary, { ...message, ...meta })
    } else {
      this.logger.log(level, message, meta)
    }
  }

  info(message, meta) {
    this.log('info', message, meta)
  }
  error(message, meta) {
    this.log('error', message, meta)
  }
  warn(message, meta) {
    this.log('warn', message, meta)
  }
  debug(message, meta) {
    this.log('debug', message, meta)
  }
  silly(message, meta) {
    this.log('silly', message, meta)
  }
}

const logger = new LoggerService('app-service')
Object.freeze(logger)
export default logger
