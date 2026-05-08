import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8081/',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`API error: ${error.response?.status} ${error.config?.url}`)
    return Promise.reject(error)
  }
)