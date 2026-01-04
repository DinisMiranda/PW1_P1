import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.username === 'admin')

  function login(username, password) {
    // Autenticação simples - em produção usar API real
    if (username && password) {
      const role = username === 'admin' ? 'admin' : 'user'
      user.value = { id: 1, username, email: `${username}@example.com`, role }
      token.value = 'mock-token-' + Date.now()
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function init() {
    // Restaurar sessão do localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser && token.value) {
      user.value = JSON.parse(savedUser)
    }
  }

  return { user, token, isAuthenticated, isAdmin, login, logout, init }
})

