export type LogLevel = "INFO" | "WARN" | "ERROR"

export type Log = {
  type: LogLevel
  msg: string
  time: string
}