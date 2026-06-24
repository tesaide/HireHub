<template>
  <div>
    <h1 class="page-title">Вакансії</h1>

    <!-- Фільтри -->
    <div class="filters card">
      <div class="form-group">
        <label>Місто</label>
        <input v-model="filters.city" placeholder="Kyiv, Remote..." @input="loadJobs" />
      </div>
      <div class="form-group">
        <label>Категорія</label>
        <select v-model="filters.category" @change="loadJobs">
          <option value="">Всі</option>
          <option>Backend</option>
          <option>Frontend</option>
          <option>Fullstack</option>
          <option>DevOps</option>
          <option>QA</option>
        </select>
      </div>
      <div class="form-group">
        <label>Мін. зарплата ($)</label>
        <input v-model.number="filters.minSalary" type="number" placeholder="1000" @input="loadJobs" />
      </div>
    </div>

    <!-- Список вакансій -->
    <div v-if="loading" class="loading">Завантаження...</div>

    <div v-else-if="jobs.length === 0" class="empty">
      Вакансій не знайдено. Спробуй змінити фільтри.
    </div>

    <div v-else class="jobs-list">
      <div v-for="job in jobs" :key="job.id" class="job-card card">
        <div class="job-header">
          <div>
            <h2 class="job-title">{{ job.title }}</h2>
            <span class="employer-name">{{ job.employer_name }}</span>
          </div>
          <span :class="`tag tag-${job.category.toLowerCase()}`">{{ job.category }}</span>
        </div>

        <div class="job-meta">
          <span>📍 {{ job.city }}</span>
          <span>💰 ${{ job.salary_min }}–${{ job.salary_max }}</span>
          <span>📅 {{ formatDate(job.created_at) }}</span>
        </div>

        <p class="job-desc">{{ job.description.slice(0, 120) }}...</p>

        <router-link :to="`/jobs/${job.id}`" class="btn btn-outline">Детальніше →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { jobsApi } from '../api'

const jobs = ref<any[]>([])
const loading = ref(true)
const filters = ref({ city: '', category: '', minSalary: undefined as number | undefined })

async function loadJobs() {
  loading.value = true
  try {
    const params: Record<string, unknown> = {}
    if (filters.value.city)      params.city      = filters.value.city
    if (filters.value.category)  params.category  = filters.value.category
    if (filters.value.minSalary) params.minSalary = filters.value.minSalary

    const res = await jobsApi.getAll(params)
    jobs.value = res.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('uk-UA')
}

onMounted(loadJobs)
</script>

<style scoped>
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; }

.filters {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.jobs-list { display: flex; flex-direction: column; gap: 1rem; }

.job-card { transition: box-shadow 0.2s; }
.job-card:hover { box-shadow: 0 4px 16px rgba(99,102,241,0.1); }

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.job-title { font-size: 1.1rem; font-weight: 600; color: #0f172a; }
.employer-name { font-size: 0.85rem; color: #64748b; }

.job-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.job-desc { font-size: 0.9rem; color: #475569; margin-bottom: 1rem; line-height: 1.5; }

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
}
</style>
