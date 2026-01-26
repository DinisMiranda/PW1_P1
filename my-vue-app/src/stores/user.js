import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { get } from '../api/client'
import { getLevelState } from '../constants/progression'

// Store que centraliza XP, nível, badges e streak do utilizador
export const useUserStore = defineStore('user', () => {
  const xp = ref(parseInt(localStorage.getItem('xp') || '0'))
  const level = ref(parseInt(localStorage.getItem('level') || '1'))
  const badges = ref(JSON.parse(localStorage.getItem('badges') || '[]'))
  const streak = ref(parseInt(localStorage.getItem('streak') || '0'))

  const levelState = computed(() => getLevelState(xp.value))
  const xpForNextLevel = computed(() => levelState.value.xpNeeded)
  const xpIntoCurrentLevel = computed(() => levelState.value.xpIntoLevel)
  const xpProgress = computed(() =>
    levelState.value.xpNeeded ? levelState.value.xpIntoLevel / levelState.value.xpNeeded : 0
  )
  const xpRemainingToNextLevel = computed(() =>
    Math.max(0, levelState.value.xpNeeded - levelState.value.xpIntoLevel)
  )

  // Persistir estado calculado para sobreviver a refreshes
  function saveState() {
    localStorage.setItem('xp', xp.value.toString())
    localStorage.setItem('level', level.value.toString())
    localStorage.setItem('badges', JSON.stringify(badges.value))
    localStorage.setItem('streak', streak.value.toString())
  }

  // Recalcula o nível baseado na curva de XP e desbloqueia badges se necessário
  function recalcLevel() {
    const computedLevel = levelState.value.level
    if (computedLevel > level.value) {
      level.value = computedLevel
      checkBadges()
    } else if (computedLevel < level.value) {
      level.value = computedLevel
    }
  }

  function gainXP(amount) {
    xp.value += amount
    recalcLevel()
    saveState()
  }

  function loseXP(amount) {
    xp.value = Math.max(0, xp.value - amount)
    recalcLevel()
    saveState()
  }

  // Verifica critérios simples de conquista e devolve as recém-desbloqueadas
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

  // Carrega o registo persistido no mock server e atualiza o store local
  async function loadUserData(userId) {
    const data = await get('/userData', { userId })
    const record = data?.[0]
    if (!record) return false
    xp.value = record.xp ?? 0
    level.value = record.level ?? 1
    badges.value = record.badges ?? []
    streak.value = record.streak ?? 0
    saveState()
    recalcLevel()
    return true
  }

  function init() {
    // Restaurar do localStorage já está feito nos refs
    recalcLevel()
    saveState()
  }

  return {
    xp,
    level,
    badges,
    streak,
    xpForNextLevel,
    xpIntoCurrentLevel,
    xpRemainingToNextLevel,
    xpProgress,
    gainXP,
    loseXP,
    updateStreak,
    loadUserData,
    checkBadges,
    init
  }
})

