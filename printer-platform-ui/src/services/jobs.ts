import { api } from './client'
import type { Job, JobEvent , JobListResponse } from '@/types/job'

export type CreateJobPayload = {
  file_name: string
  file_path: string
  printer_id?: number | null
  client_request_id: string
  scheduled_at?: string | null
}

export type JobsFilter = {
  status?: string
  printer_id?: number
  submitted_by?: string
  limit?: number
  offset?: number
}

export const getJobs = (filter?: JobsFilter) =>
  api.get<JobListResponse>('/jobs/', { params: filter }).then(r => r.data)

export const submitJob = (payload: CreateJobPayload) => 
  api.post<Job>('/jobs/', payload).then(r => r.data)

export const getJob = (id: string) =>
  api.get<Job>(`/jobs/${id}`).then(r => r.data)

export const cancelJob = (id: string, client_request_id: string) => 
  api.post<Job>(`/jobs/${id}/cancel`, null, { params: { client_request_id } }).then(r => r.data)

export const retryJob = (id: string, client_request_id: string) => 
  api.post<Job>(`/jobs/${id}/retry`, null, { params: { client_request_id } }).then(r => r.data)

export const getJobEvents = (id: string, limit = 100, offset = 0) =>
  api.get<JobEvent[]>(`/jobs/${id}/events`, { params: { limit, offset } }).then(r => r.data)

export const fetchRecentEvents = (limit: number) =>
  api.get<JobEvent[]>('/jobs/events', { params: { limit } }).then(r => r.data)