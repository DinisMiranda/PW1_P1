import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { fetchHabits } from '../api/habits'

export const useHabitStore = defineStore('habit', () => {
  const habits = ref(JSON.parse(localStorage.getItem('habits') || '[]'))

  // Salvar no localStorage sempre que hábitos mudarem
  function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits.value))
  }

  async function loadHabits(userId) {
    const data = await fetchHabits(userId)
    habits.value = data || []
    saveHabits()
  }

  function createHabit(habitData) {
    const newHabit = {
      id: Date.now(),
      name: habitData.name,
      category: habitData.category || 'Geral',
      frequency: habitData.frequency || 'daily',
      goalCount: habitData.goalCount || 1,
      streak: 0,
      xpEarned: 0,
      completedDays: [],
      active: true,
      createdAt: new Date().toISOString()
    }
    habits.value.push(newHabit)
    saveHabits()
    return newHabit
  }

  function updateHabit(id, updates) {
    const index = habits.value.findIndex(h => h.id === id)
    if (index !== -1) {
      habits.value[index] = { ...habits.value[index], ...updates }
      saveHabits()
      return habits.value[index]
    }
    return null
  }

  function deleteHabit(id) {
    const index = habits.value.findIndex(h => h.id === id)
    if (index !== -1) {
      habits.value.splice(index, 1)
      saveHabits()
      return true
    }
    return false
  }

  function toggleHabitDone(habitId, date = new Date().toISOString().split('T')[0]) {
    const habit = habits.value.find(h => h.id === habitId)
    if (!habit) return false

    const dateStr = date
    const index = habit.completedDays.indexOf(dateStr)

    const userStore = useUserStore()
    const xpGained = 10

    if (index === -1) {
      // Marcar como feito
      habit.completedDays.push(dateStr)
      habit.streak = calculateStreak(habit.completedDays)
      
      // Ganhar XP
      const oldLevel = userStore.level
      userStore.gainXP(xpGained)
      habit.xpEarned += xpGained
      
      // Se subiu de nível e tem personagem, dar pontos
      if (userStore.level > oldLevel) {
        import('./character.js').then(({ useCharacterStore }) => {
          const characterStore = useCharacterStore()
          if (characterStore.characterType) {
            for (let i = oldLevel; i < userStore.level; i++) {
              characterStore.levelUp()
            }
          }
        }).catch(() => {
          // Character store pode não estar inicializado
        })
      }
    } else {
      // Desmarcar
      habit.completedDays.splice(index, 1)
      habit.streak = calculateStreak(habit.completedDays)

      // Remover XP ganho anteriormente
      userStore.loseXP(xpGained)
      habit.xpEarned = Math.max(0, habit.xpEarned - xpGained)
    }

    saveHabits()
    return true
  }

  function calculateStreak(completedDays) {
    if (completedDays.length === 0) return 0
    
    const sorted = [...completedDays].sort().reverse()
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Verificar se hoje foi completado
    const todayStr = today.toISOString().split('T')[0]
    if (!sorted.includes(todayStr)) {
      // Se hoje não foi completado, verificar desde ontem
      today.setDate(today.getDate() - 1)
    }
    
    for (let i = 0; i < sorted.length; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const checkDateStr = checkDate.toISOString().split('T')[0]
      
      if (sorted.includes(checkDateStr)) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const activeHabits = computed(() => habits.value.filter(h => h.active))
  const totalHabits = computed(() => habits.value.length)

  return {
    habits,
    activeHabits,
    totalHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitDone,
    loadHabits
  }
})

