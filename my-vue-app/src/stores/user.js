import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const xp = ref(parseInt(localStorage.getItem('xp') || '0'))
  const level = ref(parseInt(localStorage.getItem('level') || '1'))
  const badges = ref(JSON.parse(localStorage.getItem('badges') || '[]'))
  const streak = ref(parseInt(localStorage.getItem('streak') || '0'))

  const xpForNextLevel = computed(() => level.value * 100)
  const xpProgress = computed(() => (xp.value % 100) / 100)

  function saveState() {
    localStorage.setItem('xp', xp.value.toString())
    localStorage.setItem('level', level.value.toString())
    localStorage.setItem('badges', JSON.stringify(badges.value))
    localStorage.setItem('streak', streak.value.toString())
  }

  function gainXP(amount) {
    xp.value += amount
    
    // Verificar subida de nível
    const newLevel = Math.floor(xp.value / 100) + 1
    if (newLevel > level.value) {
      level.value = newLevel
      checkBadges()
    }
    
    saveState()
  }

  function checkBadges() {
    const newBadges = []
    
    // Badge: Primeiro Passo
    if (level.value >= 1 && !badges.value.includes('primeiro-passo')) {
      newBadges.push('primeiro-passo')
    }
    
    // Badge: Mestre do Hábito
    if (level.value >= 10 && !badges.value.includes('mestre')) {
      newBadges.push('mestre')
    }
    
    if (newBadges.length > 0) {
      badges.value.push(...newBadges)
      saveState()
      return newBadges
    }
    
    return []
  }

  function updateStreak(days) {
    streak.value = days
    saveState()
  }

  function init() {
    // Restaurar do localStorage já está feito nos refs
    saveState()
  }

  return {
    xp,
    level,
    badges,
    streak,
    xpForNextLevel,
    xpProgress,
    gainXP,
    updateStreak,
    checkBadges,
    init
  }
})

