import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// TODO День 16: зрозуміти як route guards захищають сторінки
const routes = [
  { path: '/',         component: () => import('../pages/JobsPage.vue') },
  { path: '/login',    component: () => import('../pages/LoginPage.vue') },
  { path: '/register', component: () => import('../pages/RegisterPage.vue') },
  {
    path: '/jobs/:id',
    component: () => import('../pages/JobDetailPage.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('../pages/DashboardPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/post-job',
    component: () => import('../pages/PostJobPage.vue'),
    meta: { requiresAuth: true, role: 'employer' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guard — перевіряємо авторизацію
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return '/login'
  }
  if (to.meta.role === 'employer' && !auth.isEmployer) {
    return '/'
  }
})
