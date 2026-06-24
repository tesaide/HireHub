<template>
  <div class="post-wrap">
    <div class="card">
      <h1>Нова вакансія</h1>

      <div class="form-group">
        <label>Назва вакансії</label>
        <input v-model="form.title" placeholder="Node.js Developer" />
      </div>
      <div class="form-group">
        <label>Опис</label>
        <textarea v-model="form.description" rows="5" placeholder="Що буде робити кандидат..." />
      </div>
      <div class="salary-row">
        <div class="form-group">
          <label>Зарплата від ($)</label>
          <input v-model.number="form.salary_min" type="number" placeholder="1500" />
        </div>
        <div class="form-group">
          <label>Зарплата до ($)</label>
          <input v-model.number="form.salary_max" type="number" placeholder="3000" />
        </div>
      </div>
      <div class="form-group">
        <label>Місто</label>
        <input v-model="form.city" placeholder="Kyiv / Remote" />
      </div>
      <div class="form-group">
        <label>Категорія</label>
        <select v-model="form.category">
          <option>Backend</option>
          <option>Frontend</option>
          <option>Fullstack</option>
          <option>DevOps</option>
          <option>QA</option>
        </select>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="success" class="success-msg">✅ Вакансію опубліковано!</div>

      <button @click="submit" :disabled="loading" class="btn btn-primary">
        {{ loading ? 'Публікація...' : 'Опублікувати' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jobsApi } from '../api'

const router = useRouter()
const form = ref({
  title: '', description: '',
  salary_min: undefined as number | undefined,
  salary_max: undefined as number | undefined,
  city: '', category: 'Backend',
})
const error = ref('')
const success = ref(false)
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await jobsApi.create(form.value)
    success.value = true
    setTimeout(() => router.push('/dashboard'), 1500)
  } catch (e: any) {
    const details = e.response?.data?.details
    error.value = details
      ? details.map((d: any) => `${d.field}: ${d.message}`).join(', ')
      : e.response?.data?.error ?? 'Помилка'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.post-wrap { max-width: 600px; margin: 0 auto; }
.post-wrap h1 { font-size: 1.5rem; margin-bottom: 1.5rem; }
.salary-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.btn { margin-top: 0.5rem; padding: 0.65rem 2rem; }
.success-msg { color: #16a34a; font-size: 0.9rem; margin-bottom: 0.5rem; }
</style>
