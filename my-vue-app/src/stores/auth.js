import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)

  function login(username, password) {
    // Autenticação simples - em produção usar API real
    if (username && password) {
      user.value = { id: 1, username, email: `${username}@example.com` }
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

  return { user, token, isAuthenticated, login, logout, init }
})

