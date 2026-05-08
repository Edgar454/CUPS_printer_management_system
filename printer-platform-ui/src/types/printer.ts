// src/types/printer.ts
export type PrinterStatus = "ONLINE" | "OFFLINE" | "ERROR"

export type Printer = {
  id: number
  name: string
  status: PrinterStatus
  cups_uri: string
  queue_count: number
}

export type PrinterTestResponse = {
  printer: string
  status: string
  output: string
}

export type PrinterDiagnosisResponse = {
  printer: string
  details: string
}

export type CreatePrinterPayload = {
  name: string
  cups_uri: string
}