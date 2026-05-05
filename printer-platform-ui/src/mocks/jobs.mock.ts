import type { Job } from "@/types/job"

export const JOBS: Job[] = [
  { id: 1042, file: "invoice_2025_05.pdf", printer: "HP LaserJet 400", status: "SUCCESS", time: "2 min ago" },
  { id: 1041, file: "report_q1.pdf", printer: "Canon iR-ADV C5535", status: "SUCCESS", time: "5 min ago" },
  { id: 1040, file: "presentation.pdf", printer: "Office Printer 1", status: "FAILED", time: "12 min ago" },
  { id: 1039, file: "contract_final.pdf", printer: "HP LaserJet 400", status: "SUCCESS", time: "18 min ago" },
  { id: 1038, file: "scan_2025_05_20.pdf", printer: "Brother MFC-L8900", status: "SUCCESS", time: "25 min ago" },
  { id: 1037, file: "budget_draft.pdf", printer: "Canon iR-ADV C5535", status: "SCHEDULED", time: "18:30" },
]