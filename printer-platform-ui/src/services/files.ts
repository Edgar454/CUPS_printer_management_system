import { api } from './client'
import type { UploadResponse } from '@/types/file'

export const getFiles = (limit = 100, offset = 0) =>
  api.get<string[]>('/files/', { params: { limit, offset } }).then(r => r.data)

export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<UploadResponse>('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data)
}