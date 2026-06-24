<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="logo">🏢 HireHub</router-link>

      <div class="nav-links">
        <router-link to="/">Вакансії</router-link>

        <template v-if="auth.isLoggedIn">
          <router-link v-if="auth.isEmployer" to="/post-job">+ Додати вакансію</router-link>
          <router-link to="/dashboard">Дашборд</router-link>

          <!-- Сповіщення (WebSocket) -->
          <div v-if="auth.isEmployer" class="notif-bell" @click="showNotifs = !showNotifs">
            🔔 <span v-if="notifications.length" class="badge">{{ notifications.length }}</span>
            <div v-if="showNotifs" class="notif-dropdown">
              <div v-if="!notifications.length" class="notif-empty">Немає сповіщень</div>
              <div v-for="n in notifications" :key="n.time" class="notif-item">
                {{ n.message }}
              </div>
            </div>
          </div>

          <span class="user-name">{{ auth.user?.name }}</span>
          <button @click="auth.logout(); $router.push('/')" class="btn-logout">Вийти</button>
        </template>

        <template v-else>
          <router-link to="/login">Увійти</router-link>
          <router-link to="/register" class="btn-register">Реєстрація</router-link>
        </template>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useSocket } from './composables/useSocket'

const auth = useAuthStore()
const { notifications, connect } = useSocket()
const showNotifs = ref(false)

onMounted(async () => {
  await auth.fetchMe()
  if (auth.isLoggedIn && auth.user) {
    connect(auth.user.id)
  }
})
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #f8fafc;
  color: #1e293b;
}

#app { min-height: 100vh; }

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 60px;
  background: #0f172a;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #6366f1;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.router-link-active { color: #fff; }

.btn-register {
  background: #6366f1;
  color: #fff !important;
  padding: 0.4rem 1rem;
  border-radius: 6px;
}

.btn-logout {
  background: transparent;
  border: 1px solid #475569;
  color: #94a3b8;
  padding: 0.35rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.user-name { color: #e2e8f0; font-size: 0.85rem; }

.notif-bell {
  position: relative;
  cursor: pointer;
  color: #94a3b8;
  font-size: 1.1rem;
  user-select: none;
}

.badge {
  background: #ef4444;
  color: #fff;
  border-radius: 50%;
  padding: 0 5px;
  font-size: 0.7rem;
  vertical-align: top;
}

.notif-dropdown {
  position: absolute;
  right: 0;
  top: 30px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  width: 280px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 200;
}

.notif-item {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #e2e8f0;
  border-bottom: 1px solid #334155;
}

.notif-empty {
  padding: 1rem;
  color: #64748b;
  font-size: 0.85rem;
  text-align: center;
}

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Спільні стилі для карток */
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.5rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.85; }
.btn-primary { background: #6366f1; color: #fff; }
.btn-danger  { background: #ef4444; color: #fff; }
.btn-outline { background: transparent; border: 1px solid #6366f1; color: #6366f1; }

.form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
.form-group label { font-size: 0.85rem; font-weight: 500; color: #64748b; }
.form-group input, .form-group textarea, .form-group select {
  padding: 0.6rem 0.85rem;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus, .form-group textarea:focus { border-color: #6366f1; }

.error-msg { color: #ef4444; font-size: 0.85rem; margin-top: 0.5rem; }
.tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}
.tag-backend  { background: #ede9fe; color: #6d28d9; }
.tag-frontend { background: #dcfce7; color: #15803d; }
.tag-fullstack{ background: #dbeafe; color: #1d4ed8; }
.tag-devops   { background: #fef9c3; color: #a16207; }
.tag-qa       { background: #fce7f3; color: #9d174d; }
</style>
