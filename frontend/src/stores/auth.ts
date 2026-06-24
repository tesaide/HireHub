import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api'

// TODO День 16: зрозуміти як Pinia зберігає стан між компонентами

interface User {
  id: number
  name: string
  email: string
  role: 'employer' | 'seeker'
}

export const useAuthStore = defineStore('auth', () => {
  const user  = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isLoggedIn   = computed(() => !!token.value)
  const isEmployer   = computed(() => user.value?.role === 'employer')
  const isSeeker     = computed(() => user.value?.role === 'seeker')

  async function login(email: string, password: string) {
    const res = await authApi.login({ email, password })
    token.value = res.data.token
    user.value  = res.data.user
    localStorage.setItem('token', res.data.token)
  }

  async function register(name: string, email: string, password: string, role: string) {
    const res = await authApi.register({ name, email, password, role })
    token.value = res.data.token
    user.value  = res.data.user
    localStorage.setItem('token', res.data.token)
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await authApi.me()
      user.value = res.data.data
    } catch {
      logout()
    }
  }

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isLoggedIn, isEmployer, isSeeker, login, register, fetchMe, logout }
})
