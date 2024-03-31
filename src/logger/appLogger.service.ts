import { ConsoleLogger, LogLevel } from '@nestjs/common'
import { writeFile, watch, stat, rename } from 'fs/promises'

export class AppLogger extends ConsoleLogger {
  private static LOG_PATH = 'logs/log.txt'
  private static ERROR_LOG_PATH = 'logs/error.log.txt'

  verbose(message: string, context?: string) {
    const ctx = context || this.context
    super.verbose(message, ctx)
    this.writeToFile('verbose', message, ctx)
  }

  debug(message: string, context?: string) {
    const ctx = context || this.context
    super.debug(message, ctx)
    this.writeToFile('debug', message, ctx)
  }

  log(message: string, context?: string) {
    const ctx = context || this.context
    super.log(message, ctx)
    this.writeToFile('log', message, ctx)
  }

  warn(message: string, context?: string) {
    const ctx = context || this.context
    super.warn(message, ctx)
    this.writeToFile('warn', message, ctx)
  }

  error(message: string, stack?: string, context?: string) {
    const ctx = context || this.context
    if (stack) {
      super.error(message, stack, ctx)
      this.writeToFile('error', stack, ctx)
    } else {
      super.error(message, undefined, ctx)
      this.writeToFile('error', message, ctx)
    }
  }

  async setLogRotation(limit: number) {
    const msg = `Log file rotation is enabled. The size limit for log files is ${limit}.`
    this.log(msg, AppLogger.name)

    const logWatcher = watch(AppLogger.LOG_PATH)
    for await (const { eventType } of logWatcher) {
      if (eventType === 'change') {
        const { size } = await stat(AppLogger.LOG_PATH)
        if (size > limit) {
          const path = `${AppLogger.LOG_PATH}.${new Date().getTime()}`
          await rename(AppLogger.LOG_PATH, path)
          await writeFile(AppLogger.LOG_PATH, '', { flag: 'a' })
        }
      }
    }

    const errorLogWatcher = watch(AppLogger.ERROR_LOG_PATH)
    for await (const { eventType } of errorLogWatcher) {
      if (eventType === 'change') {
        const { size } = await stat(AppLogger.ERROR_LOG_PATH)
        if (size > limit) {
          const path = `${AppLogger.ERROR_LOG_PATH}.${new Date().getTime()}`
          await rename(AppLogger.ERROR_LOG_PATH, path)
          await writeFile(AppLogger.ERROR_LOG_PATH, '', { flag: 'a' })
        }
      }
    }
  }

  private writeToFile(logLevel: LogLevel, message: string, context?: string) {
    const msg = this.formatMsg(logLevel, message, context)
    writeFile(AppLogger.LOG_PATH, msg, { flag: 'a' })
    if (logLevel === 'error') {
      writeFile(AppLogger.ERROR_LOG_PATH, msg, { flag: 'a' })
    }
  }

  private formatMsg(logLevel: LogLevel, message: string, context?: string) {
    const ctx = context || ''
    return `${this.getTimestamp()}\t${logLevel.toUpperCase()}\t[${ctx}]\t${message}\n`
  }
}
