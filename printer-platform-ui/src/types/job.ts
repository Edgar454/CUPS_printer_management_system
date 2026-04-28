export type JobStatus =
  | "SUCCESS"
  | "FAILED"
  | "SCHEDULED"
  | "PENDING"
  | "PROCESSING"

export type Job = {
  id: number
  file: string
  printer: string
  status: JobStatus
  time: string // later: Date
}