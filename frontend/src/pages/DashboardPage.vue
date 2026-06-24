<template>
  <div>
    <h1 class="page-title">Дашборд — {{ auth.user?.name }}</h1>
    <span :class="`tag tag-${auth.user?.role === 'employer' ? 'backend' : 'frontend'}`">
      {{ auth.user?.role === 'employer' ? '🏢 Роботодавець' : '👤 Шукач' }}
    </span>

    <!-- EMPLOYER: мої вакансії -->
    <div v-if="auth.isEmployer" class="section">
      <div class="section-header">
        <h2>Мої вакансії</h2>
        <router-link to="/post-job" class="btn btn-primary">+ Нова вакансія</router-link>
      </div>

      <div v-for="job in myJobs" :key="job.id" class="card job-row">
        <div class="job-row-info">
          <strong>{{ job.title }}</strong>
          <span class="muted">{{ job.city }} · ${{ job.salary_min }}–${{ job.salary_max }}</span>
        </div>
        <div class="job-row-actions">
          <span class="applications-count" @click="loadApplications(job.id)">
            Відгуки →
          </span>
          <button @click="deleteJob(job.id)" class="btn btn-danger btn-sm">Видалити</button>
        </div>
      </div>

      <!-- Відгуки на вакансію -->
      <div v-if="selectedApplications.length" class="applications-panel card">
        <h3>Відгуки на вакансію</h3>
        <div v-for="app in selectedApplications" :key="app.id" class="app-item">
          <div>
            <strong>{{ app.seeker_name }}</strong> — {{ app.seeker_email }}
            <p class="cover-letter">{{ app.cover_letter }}</p>
          </div>
          <select :value="app.status" @change="changeStatus(app.id, ($event.target as HTMLSelectElement).value)">
            <option value="pending">Очікує</option>
            <option value="reviewed">Переглянуто</option>
            <option value="accepted">Прийнято ✅</option>
            <option value="rejected">Відхилено ❌</option>
          </select>
        </div>
      </div>
    </div>

    <!-- SEEKER: мої відгуки -->
    <div v-if="auth.isSeeker" class="section">
      <h2>Мої відгуки</h2>
      <div v-if="myApplications.length === 0" class="empty">Ти ще не відгукувався на вакансії</div>
      <div v-for="app in myApplications" :key="app.id" class="card app-row">
        <strong>{{ (app as any).job_title }}</strong>
        <span class="muted">{{ (app as any).city }}</span>
        <span :class="`status status-${app.status}`">{{ statusLabel(app.status) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { jobsApi, applicationsApi } from '../api'

const auth = useAuthStore()
const myJobs = ref<any[]>([])
const myApplications = ref<any[]>([])
const selectedApplications = ref<any[]>([])

async function loadMyJobs() {
  // TODO: додати endpoint GET /api/jobs/my — поки що завантажуємо всі і фільтруємо
  const res = await jobsApi.getAll()
  myJobs.value = res.data.data.filter((j: any) => j.employer_id === auth.user?.id)
}

async function loadApplications(jobId: number) {
  const res = await applicationsApi.getByJob(jobId)
  selectedApplications.value = res.data.data
}

async function changeStatus(appId: number, status: string) {
  await applicationsApi.updateStatus(appId, status)
  // Оновити локально
  const app = selectedApplications.value.find(a => a.id === appId)
  if (app) app.status = status
}

async function deleteJob(id: number) {
  if (!confirm('Видалити вакансію?')) return
  await jobsApi.remove(id)
  myJobs.value = myJobs.value.filter(j => j.id !== id)
}

async function loadMyApplications() {
  const res = await applicationsApi.getMine()
  myApplications.value = res.data.data
}

function statusLabel(s: string) {
  const labels: Record<string, string> = {
    pending: 'Очікує', reviewed: 'Переглянуто',
    accepted: 'Прийнято ✅', rejected: 'Відхилено ❌'
  }
  return labels[s] ?? s
}

onMounted(() => {
  if (auth.isEmployer) loadMyJobs()
  if (auth.isSeeker)   loadMyApplications()
})
</script>

<style scoped>
.page-title { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; }
.section { margin-top: 2rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.job-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.job-row-info { display: flex; flex-direction: column; gap: 0.2rem; }
.job-row-actions { display: flex; gap: 0.75rem; align-items: center; }
.applications-count { color: #6366f1; cursor: pointer; font-size: 0.9rem; }
.btn-sm { padding: 0.3rem 0.7rem; font-size: 0.82rem; }
.applications-panel { margin-top: 1rem; }
.applications-panel h3 { margin-bottom: 0.75rem; }
.app-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 0.75rem 0; border-bottom: 1px solid #e2e8f0; }
.app-item select { padding: 0.3rem; border-radius: 5px; border: 1px solid #e2e8f0; }
.cover-letter { font-size: 0.85rem; color: #64748b; margin-top: 0.25rem; max-width: 500px; }
.app-row { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.75rem; }
.muted { color: #94a3b8; font-size: 0.85rem; }
.empty { color: #94a3b8; padding: 2rem 0; }
.status { font-size: 0.82rem; font-weight: 600; }
.status-pending   { color: #d97706; }
.status-reviewed  { color: #2563eb; }
.status-accepted  { color: #16a34a; }
.status-rejected  { color: #dc2626; }
</style>
