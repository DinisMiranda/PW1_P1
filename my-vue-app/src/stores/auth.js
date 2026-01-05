import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { get } from '../api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.username === 'admin')

  async function login(identifier, password) {
    // Autentica usando apenas os utilizadores do mock server
    const trimmedId = identifier?.trim()
    if (!trimmedId || !password) return false

    try {
      // Busca por username e (se tiver @) por email
      const [byUsername, byEmail] = await Promise.all([
        get('/users', { username: trimmedId }),
        trimmedId.includes('@') ? get('/users', { email: trimmedId }) : Promise.resolve([])
      ])

      const candidates = [...byUsername, ...byEmail]
      const found = candidates.find((u) => u.password === password)

      if (!found) return false

      const { password: _removed, ...safeUser } = found
      user.value = safeUser
      token.value = `mock-token-${safeUser.id}`
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      // Carregar dados do utilizador logado (habitos, xp, badges)
      try {
        const [{ useHabitStore }, { useUserStore }] = await Promise.all([
          import('./habit'),
          import('./user')
        ])
        const habitStore = useHabitStore()
        const userStore = useUserStore()
        await Promise.all([
          habitStore.loadHabits(safeUser.id),
          userStore.loadUserData(safeUser.id)
        ])
      } catch (loadErr) {
        console.warn('Dados adicionais não carregados', loadErr)
      }
      return true
    } catch (err) {
      console.error('Login failed', err)
      return false
    }
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

