import axios from 'axios'

// TODO День 16: написати цей файл самостійно, потім порівняти

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: автоматично додає JWT до кожного запиту
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: обробляємо 401 — редірект на логін
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API методи — згруповані по ресурсах
export const authApi = {
  register: (data: unknown)       => api.post('/auth/register', data),
  login:    (data: unknown)       => api.post('/auth/login', data),
  me:       ()                    => api.get('/auth/me'),
}

export const jobsApi = {
  getAll:  (params?: unknown)     => api.get('/jobs', { params }),
  getById: (id: number)           => api.get(`/jobs/${id}`),
  create:  (data: unknown)        => api.post('/jobs', data),
  update:  (id: number, d: unknown) => api.put(`/jobs/${id}`, d),
  remove:  (id: number)           => api.delete(`/jobs/${id}`),
}

export const applicationsApi = {
  apply:        (data: unknown)       => api.post('/applications', data),
  getMine:      ()                    => api.get('/applications/my'),
  getByJob:     (jobId: number)       => api.get(`/applications/job/${jobId}`),
  updateStatus: (id: number, status: string) => api.patch(`/applications/${id}/status`, { status }),
}
