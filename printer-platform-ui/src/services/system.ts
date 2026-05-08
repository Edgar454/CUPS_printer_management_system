import { api } from './client'
import type { HealthResponse, WorkerStatus, SystemStats, QueueMetrics } from '@/types/system'

export const getHealth = () =>
  api.get<HealthResponse>('/system/health').then(r => r.data)

export const getWorkers = () =>
  api.get<WorkerStatus[]>('/system/workers').then(r => r.data)

export const getStats = () =>
  api.get<SystemStats>('/system/stats').then(r => r.data)

export const getQueueMetrics = () =>
  api.get<QueueMetrics>('/system/queue').then(r => r.data)