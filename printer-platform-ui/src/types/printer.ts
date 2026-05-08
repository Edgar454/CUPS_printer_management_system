// src/types/printer.ts
export type PrinterStatus = "ONLINE" | "OFFLINE" | "ERROR"

export type Printer = {
  id: number
  name: string
  status: PrinterStatus
  cups_uri: string
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