import { LogLevel } from '@nestjs/common'

export const DEFAULT_LOG_LEVELS: LogLevel[] = [
  'verbose',
  'debug',
  'log',
  'warn',
  'error',
]

export const getLogLevels = (logLevel: number) => {
  if (!logLevel || logLevel < 0 || logLevel > 4) {
    return [...DEFAULT_LOG_LEVELS]
  }
  return DEFAULT_LOG_LEVELS.slice(logLevel)
}
