import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { get, post } from '../api/client'
import { createUser } from '../api/users'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.username === 'admin')

  function clearLocalSessionData() {
    const keys = [
      'xp',
      'level',
      'badges',
      'streak',
      'habits',
      'characterType',
      'stat_str',
      'stat_vit',
      'stat_agi',
      'stat_int',
      'availablePoints',
      'characterLevel',
      'inventory',
      'equippedItems',
      'lootBoxes',
      'currentPhase',
      'phases'
    ]
    keys.forEach((k) => localStorage.removeItem(k))
  }

  async function register({ username, email, password }) {
    const trimmedUser = username?.trim()
    const trimmedEmail = email?.trim().toLowerCase()
    const trimmedPass = password?.trim()

    if (!trimmedUser || !trimmedEmail || !trimmedPass) {
      throw new Error('Preencha todos os campos.')
    }

    try {
      const [existingUser, existingEmail] = await Promise.all([
        get('/users', { username: trimmedUser }),
        get('/users', { email: trimmedEmail })
      ])

      if (existingUser?.length) throw new Error('Username já em uso.')
      if (existingEmail?.length) throw new Error('Email já em uso.')

      const newUser = await createUser({
        username: trimmedUser,
        email: trimmedEmail,
        password: trimmedPass,
        role: 'user',
        createdAt: new Date().toISOString()
      })

      // Criar registo inicial do utilizador no mock server
      await post('/userData', {
        userId: newUser.id,
        xp: 0,
        level: 1,
        badges: [],
        streak: 0
      })
      
      // Criar personagem default no mock server (sem classe definida ainda)
      await post('/characters', {
        userId: newUser.id,
        characterType: null,
        stats: { str: 10, vit: 10, agi: 10, int: 10 },
        availablePoints: 0,
        level: 1
      })

      const { password: _removed, ...safeUser } = newUser
      user.value = safeUser
      token.value = `mock-token-${safeUser.id}`
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      try {
        const [{ useHabitStore }, { useUserStore }, { useCharacterStore }, { useItemStore }] = await Promise.all([
          import('./habit'),
          import('./user'),
          import('./character'),
          import('./items')
        ])
        const habitStore = useHabitStore()
        const userStore = useUserStore()
        const characterStore = useCharacterStore()
        const itemStore = useItemStore()
        itemStore.setActiveUser(safeUser.id)

        const [_, __, characterRes] = await Promise.all([
          habitStore.loadHabits(safeUser.id),
          userStore.loadUserData(safeUser.id),
          get('/characters', { userId: safeUser.id })
        ])
        const characterRecord = characterRes?.[0]
        if (characterRecord) characterStore.setFromServer(characterRecord)
      } catch (loadErr) {
        console.warn('Dados adicionais não carregados', loadErr)
      }

      return true
    } catch (err) {
      console.error('Register failed', err)
      throw err
    }
  }

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

      // Carregar dados do utilizador logado (hábitos, xp, badges, personagem)
      try {
        const [{ useHabitStore }, { useUserStore }, { useCharacterStore }, { useItemStore }] = await Promise.all([
          import('./habit'),
          import('./user'),
          import('./character'),
          import('./items')
        ])
        const habitStore = useHabitStore()
        const userStore = useUserStore()
        const characterStore = useCharacterStore()
        const itemStore = useItemStore()
        itemStore.setActiveUser(safeUser.id)

        const [_, __, characterRes] = await Promise.all([
          habitStore.loadHabits(safeUser.id),
          userStore.loadUserData(safeUser.id),
          get('/characters', { userId: safeUser.id })
        ])
        const characterRecord = characterRes?.[0]
        if (characterRecord) characterStore.setFromServer(characterRecord)
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

    clearLocalSessionData()

    // Tentar limpar stores em memória para evitar bleed de dados entre sessões
    ;(async () => {
      try {
        const imports = await Promise.allSettled([
          import('./habit'),
          import('./user'),
          import('./character'),
          import('./items'),
          import('./battle')
        ])

        const habitStore = imports[0].status === 'fulfilled' ? imports[0].value.useHabitStore() : null
        const userStore = imports[1].status === 'fulfilled' ? imports[1].value.useUserStore() : null
        const characterStore = imports[2].status === 'fulfilled' ? imports[2].value.useCharacterStore() : null
        const itemStore = imports[3].status === 'fulfilled' ? imports[3].value.useItemStore() : null
        const battleStore = imports[4].status === 'fulfilled' ? imports[4].value.useBattleStore() : null

        if (habitStore) habitStore.habits = []
        if (userStore) {
          userStore.xp = 0
          userStore.level = 1
          userStore.badges = []
          userStore.streak = 0
        }
        if (characterStore) {
          characterStore.characterType = null
          characterStore.stats = { str: 10, vit: 10, agi: 10, int: 10 }
          characterStore.availablePoints = 0
          characterStore.level = 1
        }
        if (itemStore) {
          itemStore.setActiveUser(null)
          itemStore.inventory = []
          itemStore.equippedItems = []
          itemStore.lootBoxes = {}
        }
        if (battleStore) {
          battleStore.currentPhase = 1
          battleStore.phases = []
        }
      } catch (err) {
        console.warn('Falha ao limpar stores após logout', err)
      }
    })()
  }

  function init() {
    // Restaurar sessão do localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser && token.value) {
      user.value = JSON.parse(savedUser)
    }
  }

  return { user, token, isAuthenticated, isAdmin, login, register, logout, init }
})

