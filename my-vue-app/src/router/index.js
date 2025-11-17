import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/habits',
      name: 'Habits',
      component: () => import('../views/Habits.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stats',
      name: 'Stats',
      component: () => import('../views/Stats.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/badges',
      name: 'Badges',
      component: () => import('../views/Badges.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Guard de autenticação
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router

