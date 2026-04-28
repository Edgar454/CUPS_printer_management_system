export type PrinterStatus = "ONLINE" | "OFFLINE"

export type Printer = {
  id: number
  name: string
  ip: string
  status: PrinterStatus
  queue: number
  lastActivity: string 
}