<template>
  <div class="auth-wrap">
    <div class="auth-card card">
      <h1>Увійти</h1>
      <p class="subtitle">Немає акаунту? <router-link to="/register">Реєстрація</router-link></p>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="you@example.com" />
      </div>
      <div class="form-group">
        <label>Пароль</label>
        <input v-model="form.password" type="password" placeholder="••••••" />
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <button @click="submit" :disabled="loading" class="btn btn-primary full-width">
        {{ loading ? 'Вхід...' : 'Увійти' }}
      </button>

      <div class="demo-hint">
        <strong>Тестові акаунти (пароль: password123)</strong><br/>
        Employer: alpha@corp.com<br/>
        Seeker: ivan@gmail.com
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value.email, form.value.password)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.error ?? 'Помилка входу'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrap {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}
.auth-card {
  width: 100%;
  max-width: 420px;
}
.auth-card h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
.subtitle { font-size: 0.88rem; color: #64748b; margin-bottom: 1.5rem; }
.subtitle a { color: #6366f1; }
.full-width { width: 100%; margin-top: 0.5rem; padding: 0.65rem; font-size: 1rem; }
.demo-hint {
  margin-top: 1.25rem;
  padding: 0.75rem;
  background: #f1f5f9;
  border-radius: 7px;
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.6;
}
</style>
