// src/api/printers.ts
import { api } from './client'
import type { Printer , PrinterDiagnosisResponse , PrinterTestResponse } from '@/types/printer'

export type CreatePrinterPayload = {
  name: string
  cups_uri: string
}

export const getPrinters = () =>
  api.get<Printer[]>('/printers/').then(r => r.data)

export const getPrinter = (name: string) =>
  api.get<Printer>(`/printers/${name}`).then(r => r.data)

export const createPrinter = (payload: CreatePrinterPayload) =>
  api.post<Printer>('/printers/', payload).then(r => r.data)

export const deletePrinter = (name: string) =>
  api.delete(`/printers/${name}`).then(r => r.data)

export const testPrinter = (name: string) =>
  api.post<PrinterTestResponse>(`/printers/printers/${name}/test`).then(r => r.data)

export const diagnosePrinter = (name: string) =>
  api.get<PrinterDiagnosisResponse>(`/printers/printers/${name}/diagnose`).then(r => r.data)