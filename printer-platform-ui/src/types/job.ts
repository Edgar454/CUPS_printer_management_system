export type JobStatus =
  | "QUEUED"
  | "FAILED"
  | "SCHEDULED"
  | "PROCESSING"
  | "PRINTING"
  | "COMPLETED"
  | "CANCELLED"

export type Job = {
  id: string          
  printer_id: number | null
  file_name: string   
  file_path: string
  status: JobStatus
  scheduled_at: string | null
  retry_count: number
  error_message: string | null
  created_at: string  
  updated_at: string
}

export type JobListResponse = {
  items: Job[]
  total: number
}

export type JobEvent = {
  id: number
  job_id: string
  event_type: string
  printer_id: number | null
  message: string | null
  error: string | null
  source: string
  created_at: string
}