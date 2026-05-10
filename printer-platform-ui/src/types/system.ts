// src/types/system.ts
export type HealthResponse = {
  status: "ok" | "degraded"
  checks: {
    database: boolean
    cups: boolean
  }
}

export type WorkerStatus = {
  worker_id: string
  last_seen: string
  lag: string
}

export type SystemStats = {
  total: number
  completed: number
  failed: number
  processing: number
}

export type QueueMetrics = {
  queued: number
  scheduled: number
}

