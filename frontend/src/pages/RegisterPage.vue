<template>
  <div class="auth-wrap">
    <div class="auth-card card">
      <h1>Реєстрація</h1>
      <p class="subtitle">Вже є акаунт? <router-link to="/login">Увійти</router-link></p>

      <div class="form-group">
        <label>Ім'я</label>
        <input v-model="form.name" placeholder="Іван Петренко" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="you@example.com" />
      </div>
      <div class="form-group">
        <label>Пароль</label>
        <input v-model="form.password" type="password" placeholder="Мін. 6 символів" />
      </div>
      <div class="form-group">
        <label>Роль</label>
        <select v-model="form.role">
          <option value="seeker">👤 Шукаю роботу</option>
          <option value="employer">🏢 Роботодавець</option>
        </select>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <button @click="submit" :disabled="loading" class="btn btn-primary full-width">
        {{ loading ? 'Реєстрація...' : 'Зареєструватись' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ name: '', email: '', password: '', role: 'seeker' })
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(form.value.name, form.value.email, form.value.password, form.value.role)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.error ?? 'Помилка реєстрації'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrap { display: flex; justify-content: center; padding: 3rem 1rem; }
.auth-card { width: 100%; max-width: 420px; }
.auth-card h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
.subtitle { font-size: 0.88rem; color: #64748b; margin-bottom: 1.5rem; }
.subtitle a { color: #6366f1; }
.full-width { width: 100%; margin-top: 0.5rem; padding: 0.65rem; font-size: 1rem; }
</style>
