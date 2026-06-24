<template>
  <div v-if="job">
    <router-link to="/" class="back-link">← Назад до вакансій</router-link>

    <div class="card job-detail">
      <div class="job-header">
        <div>
          <h1>{{ job.title }}</h1>
          <span class="employer">{{ job.employer_name }}</span>
        </div>
        <span :class="`tag tag-${job.category.toLowerCase()}`">{{ job.category }}</span>
      </div>

      <div class="meta-row">
        <div class="meta-item"><span class="meta-icon">📍</span>{{ job.city }}</div>
        <div class="meta-item"><span class="meta-icon">💰</span>${{ job.salary_min }}–${{ job.salary_max }}</div>
        <div class="meta-item"><span class="meta-icon">📅</span>{{ formatDate(job.created_at) }}</div>
      </div>

      <hr class="divider" />
      <p class="description">{{ job.description }}</p>

      <!-- Форма відгуку (тільки seeker) -->
      <div v-if="auth.isSeeker" class="apply-section">
        <h3>Відгукнутись на вакансію</h3>
        <div class="form-group">
          <label>Супровідний лист</label>
          <textarea v-model="coverLetter" rows="4" placeholder="Розкажи чому ти підходиш..." />
        </div>
        <div v-if="applyError" class="error-msg">{{ applyError }}</div>
        <div v-if="applied" class="success-msg">✅ Відгук надіслано!</div>
        <button v-else @click="apply" :disabled="applying" class="btn btn-primary">
          {{ applying ? 'Надсилання...' : 'Надіслати відгук' }}
        </button>
      </div>

      <div v-else-if="!auth.isLoggedIn" class="apply-section">
        <router-link to="/login" class="btn btn-primary">Увійди щоб відгукнутись</router-link>
      </div>
    </div>
  </div>
  <div v-else class="loading">Завантаження...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { jobsApi, applicationsApi } from '../api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const auth = useAuthStore()
const job = ref<any>(null)
const coverLetter = ref('')
const applying = ref(false)
const applied = ref(false)
const applyError = ref('')

async function loadJob() {
  const res = await jobsApi.getById(Number(route.params.id))
  job.value = res.data.data
}

async function apply() {
  applyError.value = ''
  applying.value = true
  try {
    await applicationsApi.apply({ job_id: job.value.id, cover_letter: coverLetter.value })
    applied.value = true
  } catch (e: any) {
    applyError.value = e.response?.data?.error ?? 'Помилка'
  } finally {
    applying.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('uk-UA')
}

onMounted(loadJob)
</script>

<style scoped>
.back-link { color: #6366f1; text-decoration: none; font-size: 0.9rem; display: block; margin-bottom: 1rem; }
.job-detail { max-width: 760px; }
.job-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.job-header h1 { font-size: 1.4rem; margin-bottom: 0.2rem; }
.employer { color: #64748b; font-size: 0.9rem; }
.meta-row { display: flex; gap: 2rem; margin-bottom: 1.25rem; }
.meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; color: #475569; }
.divider { border: none; border-top: 1px solid #e2e8f0; margin-bottom: 1.25rem; }
.description { line-height: 1.7; color: #334155; white-space: pre-wrap; }
.apply-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; }
.apply-section h3 { margin-bottom: 1rem; }
.success-msg { color: #16a34a; font-size: 0.9rem; margin-top: 0.5rem; }
</style>
